"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface VisionPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export default function VisionPanel({ title, children, className, style, delay = 0 }: VisionPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`glass-card overflow-hidden ${className || ""}`}
      style={style}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="traffic-light red" />
          <span className="traffic-light yellow" />
          <span className="traffic-light green" />
        </div>
        <span className="mr-auto text-[10px] font-medium text-[#64748b]">
          {title}
        </span>
      </div>
      {/* Content */}
      <div className="p-2.5">
        {children}
      </div>
    </motion.div>
  );
}
