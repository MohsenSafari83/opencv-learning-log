import Link from "next/link";
import { MODULES } from "@/lib/modules";

export default function ProjectsPage() {
  const withProject = MODULES.filter((m) => m.project);

  return (
    <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-12">
      <div className="mb-10">
        <span className="mb-3 inline-block rounded-full border border-[rgba(167,139,250,0.2)] bg-[rgba(167,139,250,0.08)] px-4 py-1.5 text-xs font-semibold text-[#a78bfa]">
          Hands-On
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          All{" "}
          <span className="bg-gradient-to-r from-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p dir="rtl" className="mt-4 max-w-xl text-right text-slate-600 dark:text-[#8C9AAF]">
          پروژهٔ هر ماژول، جدا از نوت‌ها — دقیقاً مثل project.html در سایت قدیمی.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {withProject.map((m) => (
          <Link
            key={m.id}
            href={`/modules/${m.id}/project`}
            className="glass-card block p-6 transition-transform hover:-translate-y-0.5"
          >
            <h2 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">{m.label}</h2>
            <p dir="rtl" className="text-right text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">
              {m.project!.summary}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
