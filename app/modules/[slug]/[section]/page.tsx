import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getModule,
  getSection,
  sectionTypeMeta,
  MODULES,
} from "@/lib/modules";
import { readSectionHtml, placeholderSectionHtml } from "@/lib/content";
import ContentInteractions from "@/components/ContentInteractions";
import ModuleReadingNav from "@/components/ModuleReadingNav";
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
      {/* Module Section Strip — port of ensureModuleStrip() */}
      <nav className="module-strip mb-8 flex flex-wrap gap-2" aria-label="Module sections">
        {mod.sections.map((s) => {
          const sMeta = sectionTypeMeta(s.type);
          const ready = !!s.file;
          const active = s.type === params.section;
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
      </nav>

      {/* Section content — same HTML fragment as the old site, now with
          TOC/scroll-spy/copy-buttons/section-links ported into React */}
      <ContentInteractions html={html} />

      <ModuleReadingNav moduleId={mod.id} />
    </main>
  );
}
