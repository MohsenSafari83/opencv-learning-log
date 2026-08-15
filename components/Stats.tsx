"use client";

import { motion } from "framer-motion";
import { Code, Image, TrendingUp, Star } from "lucide-react";
import { MODULES } from "@/lib/modules";

const completeCount = MODULES.filter((m) => m.status === "complete").length;
const exerciseTotal = MODULES.reduce((sum, m) => sum + (m.exercises?.count ?? 0), 0);
const projectCount = MODULES.filter((m) => m.project).length;

const statsData = [
  { icon: Code, label: "Modules", value: `${completeCount} / ${MODULES.length}`, color: "#20D9FF", bg: "rgba(32,217,255,0.08)", border: "rgba(32,217,255,0.15)" },
  { icon: Image, label: "Projects", value: projectCount > 0 ? String(projectCount) : "Coming soon", color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)" },
  { icon: TrendingUp, label: "Exercises", value: String(exerciseTotal), color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.15)" },
  { icon: Star, label: "Progress", value: completeCount === 0 ? "Just Started" : completeCount === MODULES.length ? "Complete" : "In Progress", color: "#38E89A", bg: "rgba(56,232,154,0.08)", border: "rgba(56,232,154,0.15)", isGreen: true },
];

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="flex flex-wrap items-center gap-6 sm:gap-8"
    >
      {statsData.map((stat, i) => (
        <div key={i} className="flex items-center gap-4">
          {i > 0 && (
            <div className="hidden h-8 w-[1px] bg-slate-200 dark:bg-white/10 sm:block" />
          )}
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl border"
              style={{
                background: stat.bg,
                borderColor: stat.border,
                boxShadow: `0 0 12px ${stat.bg}`,
              }}
            >
              <stat.icon size={18} style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-[#64748b]">{stat.label}</p>
              <p
                className={`text-lg font-extrabold ${
                  stat.isGreen ? "text-[#38E89A]" : "text-slate-900 dark:text-white"
                }`}
                style={stat.isGreen ? { textShadow: "0 0 10px rgba(56,232,154,0.3)" } : {}}
              >
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
