"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FeatureDetectionCard({
  href,
  delay = 0,
  className,
}: {
  href: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      <Link
        href={href}
        className="group glass-card block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(56,232,154,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38E89A]/60"
      >
        <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38E89A] shadow-[0_0_6px_#38E89A]" />
          <span className="text-[10px] font-semibold tracking-wide text-[#8C9AAF]">
            FEATURE DETECTION
          </span>
          <ArrowUpRight
            size={12}
            className="ml-auto text-[#64748b] opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#38E89A] group-hover:opacity-100"
          />
        </div>
        <svg viewBox="0 0 300 110" className="h-[90px] w-full">
          <rect width="300" height="110" fill="#050b16" />
          <polyline
            points="0,90 20,80 40,85 60,60 80,70 100,40 120,55 140,20 160,45 180,15 200,35 220,10 240,30 260,18 280,32 300,22"
            fill="none"
            stroke="#38E89A"
            strokeWidth="2"
            opacity="0.9"
          />
          <polygon
            points="0,90 20,80 40,85 60,60 80,70 100,40 120,55 140,20 160,45 180,15 200,35 220,10 240,30 260,18 280,32 300,22 300,110 0,110"
            fill="url(#terrainFill)"
          />
          <defs>
            <linearGradient id="terrainFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38E89A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38E89A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="220" cy="10" r="3.5" fill="#20D9FF">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        </svg>
      </Link>
    </motion.div>
  );
}
