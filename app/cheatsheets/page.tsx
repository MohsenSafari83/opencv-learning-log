import Link from "next/link";
import { MODULES } from "@/lib/modules";

export default function CheatSheetsPage() {
  const withCheatSheet = MODULES.filter((m) =>
    m.sections.some((s) => s.type === "cheatsheet" && s.file)
  );

  return (
    <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-12">
      <div className="mb-10">
        <span className="mb-3 inline-block rounded-full border border-[rgba(32,217,255,0.2)] bg-[rgba(32,217,255,0.08)] px-4 py-1.5 text-xs font-semibold text-[#20D9FF]">
          Reference
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          All{" "}
          <span className="bg-gradient-to-r from-[#20D9FF] to-[#38E89A] bg-clip-text text-transparent">
            Cheat Sheets
          </span>
        </h1>
        <p dir="rtl" className="mt-4 max-w-xl text-right text-slate-600 dark:text-[#8C9AAF]">
          مرجع سریع توابع، سینتکس، الگوها و اشتباهات رایج هر ماژول — جدا از نوت‌ها.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {withCheatSheet.map((m) => (
          <Link
            key={m.id}
            href={`/modules/${m.id}/cheatsheet`}
            className="glass-card block p-6 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{m.label}</h2>
              <span className="rounded-full border border-[rgba(32,217,255,0.2)] bg-[rgba(32,217,255,0.08)] px-3 py-1 text-xs font-medium text-[#20D9FF]">
                Cheat Sheet
              </span>
            </div>
            <p dir="rtl" className="text-right text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">
              {m.desc}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
