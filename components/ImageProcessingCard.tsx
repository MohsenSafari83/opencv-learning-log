"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";

function Thumb({ variant }: { variant: "original" | "processing" | "result" }) {
  return (
    <svg viewBox="0 0 60 60" className="h-full w-full">
      <rect width="60" height="60" fill="#050b16" />
      {variant === "original" && (
        <g opacity="0.85">
          {Array.from({ length: 36 }).map((_, i) => {
            const x = (i % 6) * 10;
            const y = Math.floor(i / 6) * 10;
            const v = 20 + ((i * 37) % 60);
            return <rect key={i} x={x} y={y} width="10" height="10" fill={`rgb(${v},${v},${v})`} />;
          })}
        </g>
      )}
      {variant === "processing" && (
        <g stroke="#20D9FF" strokeWidth="1.5" fill="none" opacity="0.9">
          <path d="M8 30 L20 12 L34 40 L46 18 L54 30" />
          <path d="M8 40 L20 46 L34 24 L46 44 L54 36" opacity="0.5" />
        </g>
      )}
      {variant === "result" && (
        <g>
          <rect x="12" y="10" width="36" height="40" rx="3" fill="none" stroke="#38E89A" strokeWidth="2" />
          <circle cx="30" cy="30" r="4" fill="#38E89A" />
        </g>
      )}
    </svg>
  );
}

export default function ImageProcessingCard({
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
        className="group glass-card block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(32,217,255,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20D9FF]/60"
      >
        <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-3 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#20D9FF] shadow-[0_0_6px_#20D9FF]" />
          <span className="text-[10px] font-semibold tracking-wide text-[#8C9AAF]">
            IMAGE PROCESSING
          </span>
          <ArrowUpRight
            size={12}
            className="ml-auto text-[#64748b] opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#20D9FF] group-hover:opacity-100"
          />
        </div>
        <div className="flex items-center gap-1.5 p-3">
          {(["original", "processing", "result"] as const).map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <div className="flex flex-col items-center gap-1">
                <div className="h-11 w-11 overflow-hidden rounded-md border border-white/10">
                  <Thumb variant={step} />
                </div>
                <span className="text-[8px] capitalize text-[#64748b]">{step}</span>
              </div>
              {i < 2 && <ChevronRight size={12} className="text-[#334155]" />}
            </div>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
