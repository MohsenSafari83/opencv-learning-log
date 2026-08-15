"use client";

import { motion } from "framer-motion";

/**
 * Abstract "vision system" HUD graphic: concentric rings + crosshair + grid,
 * standing in for the stock eye photo from the reference design. Everything
 * here is generated geometry, not a photo pretending to be live detector
 * output — consistent with DetectionGraphic's honesty rule.
 */
export default function ScanGraphic() {
  return (
    <svg viewBox="0 0 480 420" className="h-full w-full">
      <defs>
        <radialGradient id="scanCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#20D9FF" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#2477FF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#030812" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#20D9FF" />
          <stop offset="100%" stopColor="#38E89A" />
        </linearGradient>
      </defs>

      <rect width="480" height="420" fill="#030812" />

      {/* fine background grid */}
      <g stroke="#132038" strokeWidth="1">
        {Array.from({ length: 17 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="420" />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 30} x2="480" y2={i * 30} />
        ))}
      </g>

      <circle cx="240" cy="210" r="150" fill="url(#scanCore)" />

      {/* concentric rings, decreasing opacity outward */}
      {[150, 115, 80, 45].map((r, i) => (
        <circle
          key={r}
          cx="240"
          cy="210"
          r={r}
          fill="none"
          stroke="url(#ringStroke)"
          strokeWidth={i === 3 ? 2 : 1}
          opacity={0.55 - i * 0.1}
        />
      ))}

      {/* radial ticks */}
      <g stroke="#20D9FF" strokeWidth="1.5" opacity="0.5">
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 150;
          const r2 = i % 6 === 0 ? 162 : 156;
          return (
            <line
              key={i}
              x1={240 + Math.cos(a) * r1}
              y1={210 + Math.sin(a) * r1}
              x2={240 + Math.cos(a) * r2}
              y2={210 + Math.sin(a) * r2}
            />
          );
        })}
      </g>

      {/* crosshair frame */}
      <g stroke="#38E89A" strokeWidth="2">
        <path d="M150 130 v-20 h20" fill="none" />
        <path d="M330 130 v-20 h-20" fill="none" />
        <path d="M150 290 v20 h20" fill="none" />
        <path d="M330 290 v20 h-20" fill="none" />
      </g>
      <line x1="60" y1="210" x2="180" y2="210" stroke="#20D9FF" strokeWidth="1" opacity="0.6" />
      <line x1="300" y1="210" x2="420" y2="210" stroke="#20D9FF" strokeWidth="1" opacity="0.6" />
      <circle cx="60" cy="210" r="3" fill="#20D9FF" />
      <circle cx="420" cy="210" r="3" fill="#20D9FF" />

      {/* animated sweep */}
      <motion.g
        style={{ transformOrigin: "240px 210px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      >
        <path
          d="M240 210 L240 60 A150 150 0 0 1 346 96 Z"
          fill="url(#scanCore)"
          opacity="0.5"
        />
      </motion.g>

      {/* core dot */}
      <circle cx="240" cy="210" r="5" fill="#38E89A">
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* telemetry text */}
      <text x="20" y="28" fontFamily="monospace" fontSize="11" fill="#5c6370">
        FRAME 0256
      </text>
      <text x="20" y="400" fontFamily="monospace" fontSize="11" fill="#5c6370">
        ZOOM 4.2X
      </text>
    </svg>
  );
}
