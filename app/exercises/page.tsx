import Link from "next/link";
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
          تمرین‌های هر ماژول، جدا از نوت‌ها — دقیقاً مثل exercises.html در سایت قدیمی.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {withExercises.map((m) => (
          <Link
            key={m.id}
            href={`/modules/${m.id}/exercises`}
            className="glass-card block p-6 transition-transform hover:-translate-y-0.5"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{m.label}</h2>
              <span className="rounded-full border border-[rgba(56,232,154,0.2)] bg-[rgba(56,232,154,0.08)] px-3 py-1 text-xs font-medium text-[#38E89A]">
                {m.exercises!.count} تمرین
              </span>
            </div>
            <p dir="rtl" className="text-right text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">
              {m.exercises!.titles.join("، ")}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
