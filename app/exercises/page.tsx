import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import { MODULES } from "@/lib/modules";

export default function ExercisesPage() {
  const withExercises = MODULES.filter((m) => m.exercises);

  return (
    <main className="mx-auto max-w-4xl px-6 pt-32 pb-24 lg:px-12">
      <div className="mb-10">
        <span className="mb-3 inline-block rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] px-4 py-1.5 text-xs font-semibold text-[#fbbf24]">
          Practice
        </span>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
          All{" "}
          <span className="bg-gradient-to-r from-[#fbbf24] to-[#f472b6] bg-clip-text text-transparent">
            Exercises
          </span>
        </h1>
        <p dir="rtl" className="mt-4 max-w-xl text-right text-slate-600 dark:text-[#8C9AAF]">
          تمرین‌ها و آزمون‌های هر ماژول، جدا از نوت‌ها — دقیقاً مثل exercises.html در سایت قدیمی.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {withExercises.map((m) => (
          <div key={m.id} className="glass-card p-6">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{m.label}</h2>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[rgba(56,232,154,0.2)] bg-[rgba(56,232,154,0.08)] px-3 py-1 text-xs font-medium text-[#38E89A]">
                  {m.exercises!.count} تمرین
                </span>
                {m.quiz && (
                  <span className="rounded-full border border-[rgba(32,217,255,0.2)] bg-[rgba(32,217,255,0.08)] px-3 py-1 text-xs font-medium text-[#20D9FF]">
                    {m.quiz.count} سؤال آزمون
                  </span>
                )}
              </div>
            </div>

            <p dir="rtl" className="mb-4 text-right text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">
              {m.exercises!.titles.join("، ")}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href={`/modules/${m.id}/exercises`}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[rgba(15,23,42,0.6)] px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition-all hover:-translate-y-0.5 hover:border-[rgba(56,232,154,0.3)]"
              >
                شروع تمرین‌ها
                <ArrowRight size={14} />
              </Link>
              {m.quiz && (
                <Link
                  href={`/modules/${m.id}/quiz`}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[rgba(15,23,42,0.6)] px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white transition-all hover:-translate-y-0.5 hover:border-[rgba(32,217,255,0.3)]"
                >
                  <HelpCircle size={14} />
                  شروع آزمون
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}