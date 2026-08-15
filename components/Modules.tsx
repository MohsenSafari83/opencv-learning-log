"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Eye, Palette, Search, Box, GitBranch, Brain, Layers, Sparkles } from "lucide-react";
import { MODULES } from "@/lib/modules";

// Icons are a presentation-only concern, so they're mapped by index here
// rather than stored in the manifest (lib/modules.ts is the single source
// of truth for module id/desc/status/sections, ported from content-loader.js).
const icons = [Eye, Layers, Palette, Search, Box, GitBranch, Brain, Sparkles, Sparkles];

const statusLabel: Record<string, string> = {
  complete: "Completed",
  placeholder: "Upcoming",
};

const statusColor: Record<string, string> = {
  complete: "#38E89A",
  placeholder: "#64748b",
};

const levelColors: Record<string, string> = {
  Completed: "text-[#38E89A] bg-[rgba(56,232,154,0.1)] border-[rgba(56,232,154,0.2)]",
  Upcoming: "text-[#64748b] bg-[rgba(100,116,139,0.1)] border-[rgba(100,116,139,0.2)]",
};

export default function Modules() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="modules" className="relative z-10 py-24" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-[rgba(32,217,255,0.2)] bg-[rgba(32,217,255,0.08)] px-4 py-1.5 text-xs font-semibold text-[#20D9FF]">
            Learning Path
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Learning{" "}
            <span className="bg-gradient-to-r from-[#2477FF] via-[#20D9FF] to-[#38E89A] bg-clip-text text-transparent">
              Modules
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-[#8C9AAF]">
            A structured curriculum covering everything from basics to advanced computer vision.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, i) => {
            const Icon = icons[i] ?? Sparkles;
            const status = statusLabel[mod.status];
            const color = statusColor[mod.status];
            return (
              <motion.a
                key={mod.id}
                href={`/modules/${mod.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card group block cursor-pointer p-6"
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-transform group-hover:scale-110"
                  style={{
                    background: `${color}15`,
                    borderColor: `${color}30`,
                    boxShadow: `0 0 20px ${color}10`,
                  }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                  {mod.label}
                </h3>
                <p dir="rtl" className="mb-4 line-clamp-3 text-right text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">
                  {mod.desc || "Notes in progress — content to be added"}
                </p>
                <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${levelColors[status]}`}>
                  {status}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}