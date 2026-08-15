"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { MODULES } from "@/lib/modules";

// Real exercise titles pulled from module content (lib/modules.ts), not a
// hardcoded fake list — no invented difficulty or completion status, since
// that data doesn't actually exist per-exercise in the content model.
const modulesWithExercises = MODULES.filter(
  (m) => m.exercises && m.exercises.titles.length > 0
);
const totalExercises = MODULES.reduce(
  (sum, m) => sum + (m.exercises?.count ?? 0),
  0
);
const preview = modulesWithExercises
  .flatMap((m) =>
    (m.exercises?.titles ?? []).map((title) => ({
      title,
      moduleLabel: m.label,
      moduleId: m.id,
    }))
  )
  .slice(0, 6);

export default function Exercises() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="exercises" className="relative z-10 py-24" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)] px-4 py-1.5 text-xs font-semibold text-[#fbbf24]">
            Practice
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Coding{" "}
            <span className="bg-gradient-to-r from-[#fbbf24] to-[#f472b6] bg-clip-text text-transparent">
              Exercises
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-[#8C9AAF]">
            {totalExercises > 0
              ? `${totalExercises} hands-on exercises across the modules — a quick look, with the full list on the Exercises page.`
              : "Hands-on coding challenges tied to each module — coming soon."}
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
          {preview.length > 0 ? (
            preview.map((ex, i) => (
              <motion.div
                key={`${ex.moduleId}-${i}`}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  href={`/modules/${ex.moduleId}`}
                  className="group mb-3 flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white/70 dark:bg-[rgba(15,23,42,0.4)] px-5 py-4 backdrop-blur-sm transition-all hover:border-[rgba(32,217,255,0.2)] hover:bg-white dark:hover:bg-[rgba(15,23,42,0.6)]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[rgba(251,191,36,0.2)] bg-[rgba(251,191,36,0.08)]">
                    <BookOpen size={15} className="text-[#fbbf24]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {ex.title}
                    </h4>
                    <div className="mt-1 text-xs text-slate-500 dark:text-[#64748b]">
                      {ex.moduleLabel}
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="shrink-0 text-[#64748b] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-[#fbbf24] group-hover:opacity-100"
                  />
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-white/10 px-5 py-8 text-center text-sm text-slate-500 dark:text-[#64748b]">
              Exercises are being written module by module — check back soon.
            </div>
          )}

          {totalExercises > preview.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 text-center"
            >
              <Link
                href="/exercises"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[rgba(15,23,42,0.5)] px-6 py-3 text-sm font-semibold text-slate-900 dark:text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-[rgba(251,191,36,0.3)]"
              >
                View all {totalExercises} exercises
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
