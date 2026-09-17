import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getModule,
  getSection,
  sectionTypeMeta,
  MODULES,
} from "@/lib/modules";
import { readSectionHtml, readQuizJson, placeholderSectionHtml } from "@/lib/content";
import ContentInteractions from "@/components/ContentInteractions";
import ModuleReadingNav from "@/components/ModuleReadingNav";
import QuizRunner from "@/components/QuizRunner";
import "@/app/content-sections.css";

export function generateStaticParams() {
  return MODULES.flatMap((m) => {
    const params: { slug: string; section: string }[] = m.sections.map((s) => ({
      slug: m.id,
      section: s.type,
    }));

    if (m.exercises) {
      params.push({ slug: m.id, section: "exercises" });
    }

    if (m.project) {
      params.push({ slug: m.id, section: "project" });
    }

    if (m.quiz) {
      params.push({ slug: m.id, section: "quiz" });
    }

    return params;
  });
}

export default async function ModuleSectionPage({
  params,
}: {
  params: { slug: string; section: string };
}) {
  const mod = getModule(params.slug);
  if (!mod) notFound();

  // Quiz renders a completely different, interactive UI (radio buttons +
  // submit + reveal), not an HTML fragment — so it's handled as its own
  // early-return branch rather than being forced through the
  // readSectionHtml/ContentInteractions path built for prose content.
  if (params.section === "quiz") {
    if (!mod.quiz) notFound();
    const questions = await readQuizJson(mod.quiz.file);
    if (!questions || questions.length === 0) notFound();

    return (
      <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-[#8C9AAF] dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          بازگشت به صفحه اصلی
        </Link>

        <ModuleSectionStrip mod={mod} activeSection="quiz" />

        <QuizRunner moduleLabel={mod.label} questions={questions} />

        <ModuleReadingNav moduleId={mod.id} />
      </main>
    );
  }

  // exercises/project are separate manifest fields (not in sections[]),
  // matching the old site where they live on standalone pages, not app.html.
  let file: string | undefined;
  let placeholder = false;
  let labelFa = params.section;
  let desc = "";

  if (params.section === "exercises" && mod.exercises) {
    file = mod.exercises.file;
    labelFa = "تمرین‌ها";
  } else if (params.section === "project" && mod.project) {
    file = mod.project.file;
    labelFa = "پروژه";
  } else {
    const section = getSection(params.slug, params.section);
    if (!section) notFound();
    const meta = sectionTypeMeta(section.type);
    file = section.file;
    placeholder = !!section.placeholder;
    labelFa = meta?.labelFa ?? section.type;
    desc = meta?.desc ?? "";
  }

  // Same branching as ensureModuleContent(): placeholder sections render a
  // synchronous "coming soon" card; real sections read their HTML file.
  const html = placeholder
    ? placeholderSectionHtml(mod.id, params.section, labelFa, desc)
    : (await readSectionHtml(file!)) ??
      placeholderSectionHtml(mod.id, params.section, labelFa, "خطا در بارگذاری محتوا");

  return (
    <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-12">
      {/* Back to home */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-[#8C9AAF] dark:hover:text-white"
      >
        <ArrowLeft size={16} />
        بازگشت به صفحه اصلی
      </Link>

      <ModuleSectionStrip mod={mod} activeSection={params.section} />

      {/* Section content — same HTML fragment as the old site, now with
          TOC/scroll-spy/copy-buttons/section-links ported into React */}
      <ContentInteractions html={html} />

      <ModuleReadingNav moduleId={mod.id} />
    </main>
  );
}

/**
 * Module section-strip nav — port of ensureModuleStrip(), extended to also
 * list exercises/project/quiz (previously missing from the strip entirely,
 * even though their pages existed and were reachable by direct URL).
 */
function ModuleSectionStrip({
  mod,
  activeSection,
}: {
  mod: NonNullable<ReturnType<typeof getModule>>;
  activeSection: string;
}) {
  const extraItems: { type: string; ready: boolean }[] = [
    ...(mod.exercises ? [{ type: "exercises", ready: true }] : []),
    ...(mod.project ? [{ type: "project", ready: true }] : []),
    ...(mod.quiz ? [{ type: "quiz", ready: true }] : []),
  ];

  return (
    <nav className="module-strip mb-8 flex flex-wrap gap-2" aria-label="Module sections">
      {mod.sections.map((s) => {
        const sMeta = sectionTypeMeta(s.type);
        const ready = !!s.file;
        const active = s.type === activeSection;
        return (
          <Link
            key={s.type}
            href={`/modules/${mod.id}/${s.type}`}
            className={`strip-item ${ready ? "ready" : "soon"} ${active ? "active" : ""}`}
          >
            <span>{sMeta?.labelFa ?? s.type}</span>
            <span className="strip-status" aria-hidden="true">{ready ? "✓" : "⏳"}</span>
          </Link>
        );
      })}
      {extraItems.map((s) => {
        const sMeta = sectionTypeMeta(s.type);
        const active = s.type === activeSection;
        return (
          <Link
            key={s.type}
            href={`/modules/${mod.id}/${s.type}`}
            className={`strip-item ready ${active ? "active" : ""}`}
          >
            <span>{sMeta?.labelFa ?? s.type}</span>
            <span className="strip-status" aria-hidden="true">✓</span>
          </Link>
        );
      })}
    </nav>
  );
}