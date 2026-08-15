"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import FeatureStrip from "./FeatureStrip";
import HeroScanVisual from "./HeroScanVisual";

export default function Hero() {
  return (
    <section className="relative z-10 mx-auto max-w-[1500px] px-6 pt-32 pb-16 lg:px-12 lg:pt-36">
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* Left Content */}
        <div className="relative flex-1 max-w-[560px]">
          {/* Glow behind text */}
          <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.06),transparent_70%)] blur-[60px] pointer-events-none dark:block hidden" />

          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(32,217,255,0.2)] bg-[rgba(32,217,255,0.08)] px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#20D9FF] backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#20D9FF] shadow-[0_0_8px_#20D9FF]" />
            Learn. Practice. Build.
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.5rem]"
          >
            <span className="text-slate-900 dark:text-white">OpenCV</span>
            <br />
            <span className="bg-gradient-to-r from-[#2477FF] via-[#20D9FF] to-[#38E89A] bg-clip-text text-transparent">
              Learning Log
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8 flex gap-4"
          >
            <div className="mt-1 h-auto w-[3px] shrink-0 rounded-full bg-gradient-to-b from-[#2477FF] via-[#20D9FF] to-[#38E89A]" />
            <p
              dir="rtl"
              lang="fa"
              className="font-vazir text-base leading-[1.9] text-slate-600 dark:text-[#94a3b8] sm:text-lg text-right"
            >
              مسیر یادگیری من از مبانی OpenCV تا سیستم‌های واقعی،
              <br className="hidden sm:block" />
              با کد، تصویر، تمرین و پروژه‌های کاربردی.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-10 flex flex-wrap gap-4"
          >
            <a
              href="#modules"
              className="btn-glow group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#2477FF] via-[#20D9FF] to-[#38E89A] px-7 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(32,217,255,0.4),0_0_60px_rgba(56,232,154,0.15)] sm:px-8 sm:py-4 sm:text-base"
            >
              Start Learning
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="https://github.com/MohsenSafari83/opencv-learning-log"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[rgba(15,23,42,0.6)] px-7 py-3.5 text-sm font-semibold text-slate-900 dark:text-white backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-[rgba(32,217,255,0.3)] hover:shadow-[0_0_25px_rgba(32,217,255,0.1)] sm:px-8 sm:py-4 sm:text-base"
            >
              <Github size={16} />
              View GitHub
            </a>
          </motion.div>

          {/* Feature strip (replaces the old icon+number Stats row) */}
          <FeatureStrip />
        </div>

        {/* Right Visual */}
        <div className="relative w-full lg:flex-1 lg:max-w-[880px]">
          <HeroScanVisual />
        </div>
      </div>
    </section>
  );
}
