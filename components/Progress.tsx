"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, Target, Zap, Award } from "lucide-react";
import { MODULES } from "@/lib/modules";

// Module status is binary (complete/placeholder) in the manifest, so the bar
// is 100% or 0% — there's no partial-completion signal to derive a % from
// without the module itself tracking sub-topic progress.
const progressColors = ["#20D9FF", "#2477FF", "#38E89A", "#a78bfa", "#f472b6", "#fbbf24", "#ef4444", "#20D9FF", "#38E89A"];
const progressData = MODULES.map((m, i) => ({
  label: m.label,
  value: m.status === "complete" ? 100 : 0,
  color: m.status === "complete" ? progressColors[i % progressColors.length] : "#64748b",
}));

const completeCount = MODULES.filter((m) => m.status === "complete").length;
const exerciseTotal = MODULES.reduce((sum, m) => sum + (m.exercises?.count ?? 0), 0);
const projectCount = MODULES.filter((m) => m.project).length;
const currentModule = MODULES.find((m) => m.status !== "complete");

const achievements = [
  { icon: Target, label: "Modules Completed", value: `${completeCount}/${MODULES.length}`, color: "#20D9FF" },
  { icon: Zap, label: "Exercises Done", value: String(exerciseTotal), color: "#38E89A" },
  { icon: TrendingUp, label: "Current Module", value: currentModule?.label ?? "All done", color: "#fbbf24" },
  { icon: Award, label: "Real Projects", value: String(projectCount), color: "#f472b6" },
];

export default function Progress() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative z-10 py-24" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-[rgba(56,232,154,0.2)] bg-[rgba(56,232,154,0.08)] px-4 py-1.5 text-xs font-semibold text-[#38E89A]">
            Your Journey
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Learning{" "}
            <span className="bg-gradient-to-r from-[#38E89A] to-[#20D9FF] bg-clip-text text-transparent">
              Progress
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-[#8C9AAF]">
            Track your advancement through the computer vision curriculum.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Progress Bars */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8"
          >
            <h3 className="mb-6 text-lg font-bold text-slate-900 dark:text-white">Module Progress</h3>
            <div className="space-y-5">
              {progressData.map((item, i) => (
                <div key={i}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-[#94a3b8]">{item.label}</span>
                    <span className="text-sm font-bold" style={{ color: item.color }}>
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${item.value}%` } : {}}
                      transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}80)`,
                        boxShadow: `0 0 10px ${item.color}40`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Achievement Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {achievements.map((ach, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="glass-card flex flex-col items-center justify-center p-6 text-center"
              >
                <div
                  className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border"
                  style={{
                    background: `${ach.color}15`,
                    borderColor: `${ach.color}30`,
                    boxShadow: `0 0 20px ${ach.color}10`,
                  }}
                >
                  <ach.icon size={22} style={{ color: ach.color }} />
                </div>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{ach.value}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-[#64748b]">{ach.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
