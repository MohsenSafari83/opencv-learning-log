"use client";

import { motion } from "framer-motion";

export default function Quote() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.2 }}
      className="relative z-10 mx-auto max-w-xl px-6 py-10 text-center"
    >
      <div className="glass-card inline-block px-8 py-5">
        <p className="text-lg italic text-slate-500 dark:text-[#64748b]">
          <span className="text-[#20D9FF] opacity-40 text-2xl leading-none">"</span>
          Vision is not just seeing. It{"'"}s{" "}
          <span className="bg-gradient-to-r from-[#20D9FF] to-[#38E89A] bg-clip-text text-transparent font-semibold">
            understanding.
          </span>
          <span className="text-[#20D9FF] opacity-40 text-2xl leading-none">"</span>
        </p>
      </div>
    </motion.div>
  );
}
