"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eye, Layers, Palette } from "lucide-react";
import CodePanel from "./CodePanel";
import { MODULES } from "@/lib/modules";

// The 3 satellite cards link to the real first 3 modules instead of the old
// abstract Edges/Contours/3D-Point-Cloud panels (which implied fake output
// from a stock photo). Icons match the ones used in Modules.tsx for the
// same module, for visual consistency across the site.
const moduleIcons = [Eye, Layers, Palette];
const moduleColors = ["#20D9FF", "#2477FF", "#a78bfa"];
interface FloatCardProps {
  href: string;
  icon: React.ComponentType<{
    size?: number | string;
    className?: string;
    style?: React.CSSProperties;
  }>;
  color: string;
  title: string;
  desc: string;
  className: string;
  delay: number;
}

function FloatCard({ href, icon: Icon, color, title, desc, className, delay }: FloatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      className={className}
    >
      <Link
        href={href}
        className="group glass-card block h-full w-full p-4 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[0_0_30px_rgba(32,217,255,0.18)] focus-visible:-translate-y-1 focus-visible:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#20D9FF]/60 active:scale-[0.98]"
      >
        <div className="mb-2 flex items-center justify-between">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg border"
            style={{ background: `${color}15`, borderColor: `${color}30` }}
          >
            <Icon size={15} style={{ color }} />
          </div>
          {/* Always faintly visible so the affordance works on touch devices,
              not only on hover (desktop). */}
          <ArrowUpRight
            size={13}
            className="text-[#64748b] opacity-50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#20D9FF] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </div>
        <div className="text-xs font-bold text-slate-900 dark:text-white">{title}</div>
        <div className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500 dark:text-[#8C9AAF]">
          {desc}
        </div>
      </Link>
    </motion.div>
  );
}

/** Honest illustrative bounding-box graphic — not a stock photo pretending
 * to be real algorithm output. Replaces the old broken Unsplash <img>. */
function DetectionGraphic() {
  return (
    <svg viewBox="0 0 400 260" className="h-full w-full">
      <defs>
        <linearGradient id="objFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#20D9FF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#38E89A" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="#0a0f1a" />
      <path
        d="M0 0h400M0 26h400M0 52h400M0 78h400M0 104h400M0 130h400M0 156h400M0 182h400M0 208h400M0 234h400"
        stroke="#1a2436"
        strokeWidth="1"
      />
      <path
        d="M0 0v400M26 0v400M52 0v400M78 0v400M104 0v400M130 0v400M156 0v400M182 0v400M208 0v400M234 0v400M260 0v400M286 0v400M312 0v400M338 0v400M364 0v400"
        stroke="#1a2436"
        strokeWidth="1"
      />

      {/* Generic illustrative "object" — deliberately abstract, not a real photo */}
      <path
        d="M150 90 Q120 110 125 150 Q130 195 175 205 Q225 215 250 180 Q275 145 255 110 Q235 75 195 78 Q165 80 150 90Z"
        fill="url(#objFill)"
        stroke="#38E89A"
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Bounding box */}
      <rect
        x="108"
        y="62"
        width="180"
        height="168"
        rx="4"
        fill="none"
        stroke="#20D9FF"
        strokeWidth="2"
        style={{ filter: "drop-shadow(0 0 6px rgba(32,217,255,0.5))" }}
      />
      <rect x="108" y="62" width="10" height="10" fill="#20D9FF" />
      <rect x="278" y="62" width="10" height="10" fill="#20D9FF" />
      <rect x="108" y="220" width="10" height="10" fill="#20D9FF" />
      <rect x="278" y="220" width="10" height="10" fill="#20D9FF" />

      {/* Confidence label */}
      <rect x="108" y="40" width="98" height="20" rx="4" fill="#20D9FF" />
      <text x="118" y="54" fontSize="11" fontWeight="700" fill="#031018" fontFamily="monospace">
        object · 0.97
      </text>
    </svg>
  );
}

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip tilt on touch devices

    const handleMouse = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      container.style.transform = `rotateY(${-6 + x * 4}deg) rotateX(${3 + y * -3}deg)`;
    };
    const reset = () => {
      container.style.transform = "rotateY(-6deg) rotateX(3deg)";
    };
    container.addEventListener("mousemove", handleMouse);
    container.addEventListener("mouseleave", reset);
    return () => {
      container.removeEventListener("mousemove", handleMouse);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

  // Real first 3 modules — falls back gracefully if content/ has fewer than 3.
  const satellites = MODULES.slice(0, 3);

  return (
    <div className="relative h-[560px] w-full sm:h-[620px] lg:h-[650px]" style={{ perspective: "1000px" }}>
      <div
        ref={containerRef}
        className="relative h-full w-full"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-6deg) rotateX(3deg)",
          transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.08),transparent_60%)] blur-[80px]" />

        {/* z-index plan (deliberate, not DOM-order): center panel highest,
            code panel + 3 module cards share a lower tier, none overlap
            another element's content by more than ~10% by construction. */}

        {/* Code panel — top-left. Links to the Projects page (closest match
            for a standalone detection.py sample). */}
        <Link
          href="/projects"
          className="group absolute left-[0%] top-[2%] z-20 block w-[42%] max-w-[210px] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline-none"
        >
          <CodePanel />
          <div className="mt-1.5 flex items-center gap-1 text-[10px] text-[#64748b] opacity-70 transition-opacity group-hover:opacity-100 group-hover:text-[#20D9FF]">
            View projects <ArrowUpRight size={10} />
          </div>
        </Link>

        {/* Center detection preview — dominant, always-honest illustrative graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="absolute left-1/2 top-1/2 z-30 w-[76%] max-w-[360px] -translate-x-1/2 -translate-y-1/2"
        >
          <Link
            href="/projects"
            className="group glass-card block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(32,217,255,0.15)] focus-visible:outline-none"
          >
            <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-3.5 py-2.5">
              <div className="flex gap-1.5">
                <span className="traffic-light red" />
                <span className="traffic-light yellow" />
                <span className="traffic-light green" />
              </div>
              <span className="mr-auto text-[11px] font-medium text-[#64748b]">output.svg</span>
              <ArrowUpRight
                size={13}
                className="text-[#64748b] opacity-60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#20D9FF] group-hover:opacity-100"
              />
            </div>
            <DetectionGraphic />
            <div className="px-3.5 py-2 text-[10px] text-[#64748b]">
              Illustrative — real project outputs coming soon
            </div>
          </Link>
        </motion.div>

        {/* 3 satellite module cards — symmetric corners, real content, real links */}
        {satellites[0] && (
          <FloatCard
            href={`/modules/${satellites[0].id}`}
            icon={moduleIcons[0]}
            color={moduleColors[0]}
            title={satellites[0].label}
            desc={satellites[0].desc || "Coming soon"}
            delay={0.5}
            className="absolute right-[0%] top-[3%] z-20 w-[44%] max-w-[180px]"
          />
        )}
        {satellites[1] && (
          <FloatCard
            href={`/modules/${satellites[1].id}`}
            icon={moduleIcons[1]}
            color={moduleColors[1]}
            title={satellites[1].label}
            desc={satellites[1].desc || "Coming soon"}
            delay={0.65}
            className="absolute bottom-[4%] left-[0%] z-20 w-[44%] max-w-[180px]"
          />
        )}
        {satellites[2] && (
          <FloatCard
            href={`/modules/${satellites[2].id}`}
            icon={moduleIcons[2]}
            color={moduleColors[2]}
            title={satellites[2].label}
            desc={satellites[2].desc || "Coming soon"}
            delay={0.8}
            className="absolute bottom-[4%] right-[2%] z-20 w-[44%] max-w-[190px]"
          />
        )}
      </div>
    </div>
  );
}
