"use client";

import { motion } from "framer-motion";
import { Camera, Code2, Brain, LineChart } from "lucide-react";
import { MODULES } from "@/lib/modules";

const completeCount = MODULES.filter((m) => m.status === "complete").length;
const exerciseTotal = MODULES.reduce((sum, m) => sum + (m.exercises?.count ?? 0), 0);
const projectCount = MODULES.filter((m) => m.project).length;

const items = [
  {
    icon: Camera,
    title: "Real Projects",
    desc: projectCount > 0 ? `${projectCount} shipped so far` : "Build practical CV applications",
    color: "#20D9FF",
  },
  {
    icon: Code2,
    title: "Hands-on",
    desc: `${exerciseTotal} exercises with real datasets`,
    color: "#38E89A",
  },
  {
    icon: Brain,
    title: "Deep Learning",
    desc: "Explore DL with OpenCV & more",
    color: "#a78bfa",
  },
  {
    icon: LineChart,
    title: "Progress Tracking",
    desc: `${completeCount} / ${MODULES.length} modules complete`,
    color: "#f472b6",
  },
];

export default function FeatureStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.75 }}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="glass-card flex flex-col gap-2 p-3.5 transition-all duration-300 hover:-translate-y-0.5"
        >
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border"
            style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}
          >
            <item.icon size={15} style={{ color: item.color }} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
            <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-[#8C9AAF]">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
