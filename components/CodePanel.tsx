"use client";

import { motion } from "framer-motion";

type Token = { text: string; className: string };
type Line = { text?: string; className?: string; tokens?: Token[] };

const detectionLines: Line[] = [
  { text: "# import cv2", className: "text-[#5c6370]" },
  { text: "import numpy as np", tokens: [
    { text: "import ", className: "text-[#c678dd]" },
    { text: "numpy ", className: "text-[#e06c75]" },
    { text: "as ", className: "text-[#c678dd]" },
    { text: "np", className: "text-[#e06c75]" },
  ]},
  { text: "img = cv2.imread('image.jpg')", tokens: [
    { text: "img ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.imread", className: "text-[#61afef]" },
    { text: "('image.jpg')", className: "text-[#98c379]" },
  ]},
  { text: "gray = cv2.cvtColor(img, COLOR_BGR2GRAY)", tokens: [
    { text: "gray ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.cvtColor", className: "text-[#61afef]" },
    { text: "(img, COLOR_BGR2GRAY)", className: "text-[#98c379]" },
  ]},
  { text: "faces = cv2.CascadeClassifier(", tokens: [
    { text: "faces ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.CascadeClassifier", className: "text-[#61afef]" },
    { text: "(", className: "text-white" },
  ]},
  { text: "  'haarcascade_frontalface_default.xml')", tokens: [
    { text: "  'haarcascade_frontalface_default.xml'", className: "text-[#98c379]" },
    { text: ")", className: "text-white" },
  ]},
  { text: "result = faces.detectMultiScale(", tokens: [
    { text: "result ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "faces.detectMultiScale", className: "text-[#61afef]" },
    { text: "(", className: "text-white" },
  ]},
  { text: "  gray, 1.1, 4)", tokens: [
    { text: "  gray, ", className: "text-[#e06c75]" },
    { text: "1.1", className: "text-[#d19a66]" },
    { text: ", ", className: "text-white" },
    { text: "4", className: "text-[#d19a66]" },
    { text: ")", className: "text-white" },
  ]},
  { text: "for (x, y, w, h) in result:", tokens: [
    { text: "for ", className: "text-[#c678dd]" },
    { text: "(x, y, w, h) ", className: "text-[#e06c75]" },
    { text: "in ", className: "text-[#c678dd]" },
    { text: "result", className: "text-[#e06c75]" },
    { text: ":", className: "text-white" },
  ]},
  { text: "  cv2.rectangle(img, (x,y),", tokens: [
    { text: "  cv2.rectangle", className: "text-[#61afef]" },
    { text: "(img, (x,y),", className: "text-white" },
  ]},
  { text: "    (x+w, y+h), (0,255,0), 2)", tokens: [
    { text: "    (x+w, y+h), ", className: "text-white" },
    { text: "(0,255,0)", className: "text-[#d19a66]" },
    { text: ", ", className: "text-white" },
    { text: "2", className: "text-[#d19a66]" },
    { text: ")", className: "text-white" },
  ]},
  { text: "cv2.imshow('result', img)", tokens: [
    { text: "cv2.imshow", className: "text-[#61afef]" },
    { text: "('result', img)", className: "text-[#98c379]" },
  ]},
  { text: "cv2.waitKey(0)", tokens: [
    { text: "cv2.waitKey", className: "text-[#61afef]" },
    { text: "(0)", className: "text-[#d19a66]" },
  ]},
];

// Matches module 3 content (edge detection + contours) instead of the
// face-detection sample, for panels that sit next to contour/edge visuals.
const edgesLines: Line[] = [
  { text: "import cv2", tokens: [
    { text: "import ", className: "text-[#c678dd]" },
    { text: "cv2", className: "text-[#e06c75]" },
  ]},
  { text: "import numpy as np", tokens: [
    { text: "import ", className: "text-[#c678dd]" },
    { text: "numpy ", className: "text-[#e06c75]" },
    { text: "as ", className: "text-[#c678dd]" },
    { text: "np", className: "text-[#e06c75]" },
  ]},
  { text: "" },
  { text: "# Read image", className: "text-[#5c6370]" },
  { text: "img = cv2.imread('image.jpg')", tokens: [
    { text: "img ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.imread", className: "text-[#61afef]" },
    { text: "('image.jpg')", className: "text-[#98c379]" },
  ]},
  { text: "" },
  { text: "# Convert to grayscale", className: "text-[#5c6370]" },
  { text: "gray = cv2.cvtColor(img,", tokens: [
    { text: "gray ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.cvtColor", className: "text-[#61afef]" },
    { text: "(img,", className: "text-white" },
  ]},
  { text: "    cv2.COLOR_BGR2GRAY)", tokens: [
    { text: "    cv2.COLOR_BGR2GRAY", className: "text-[#98c379]" },
    { text: ")", className: "text-white" },
  ]},
  { text: "" },
  { text: "# Detect edges", className: "text-[#5c6370]" },
  { text: "edges = cv2.Canny(gray, 100, 200)", tokens: [
    { text: "edges ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.Canny", className: "text-[#61afef]" },
    { text: "(gray, ", className: "text-white" },
    { text: "100", className: "text-[#d19a66]" },
    { text: ", ", className: "text-white" },
    { text: "200", className: "text-[#d19a66]" },
    { text: ")", className: "text-white" },
  ]},
  { text: "" },
  { text: "# Find contours", className: "text-[#5c6370]" },
  { text: "contours, _ = cv2.findContours(", tokens: [
    { text: "contours, _ ", className: "text-[#e06c75]" },
    { text: "= ", className: "text-white" },
    { text: "cv2.findContours", className: "text-[#61afef]" },
    { text: "(", className: "text-white" },
  ]},
  { text: "    edges, cv2.RETR_EXTERNAL,", tokens: [
    { text: "    edges, cv2.RETR_EXTERNAL,", className: "text-white" },
  ]},
  { text: "    cv2.CHAIN_APPROX_SIMPLE)", tokens: [
    { text: "    cv2.CHAIN_APPROX_SIMPLE", className: "text-white" },
    { text: ")", className: "text-white" },
  ]},
];

interface CodePanelProps {
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  variant?: "detection" | "edges";
  filename?: string;
}

export default function CodePanel({
  className,
  style,
  delay = 0,
  variant = "detection",
  filename,
}: CodePanelProps) {
  const codeLines = variant === "edges" ? edgesLines : detectionLines;
  const label = filename ?? (variant === "edges" ? "edges.py" : "detection.py");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className={`glass-card overflow-hidden ${className || ""}`}
      style={style}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-black/30 px-3.5 py-2.5">
        <div className="flex gap-1.5">
          <span className="traffic-light red" />
          <span className="traffic-light yellow" />
          <span className="traffic-light green" />
        </div>
        <span className="mr-auto text-[11px] font-medium text-[#64748b]">
          {label}
        </span>
      </div>
      {/* Code Body */}
      <div className="overflow-x-auto p-3">
        <pre className="w-max min-w-full font-mono text-[10px] leading-[1.7] text-[#a0aec0] sm:text-[11px]">
          {codeLines.map((line, i) => (
            <div key={i}>
              {line.tokens ? (
                line.tokens.map((t, j) => (
                  <span key={j} className={t.className}>{t.text}</span>
                ))
              ) : line.text ? (
                <span className={line.className}>{line.text}</span>
              ) : (
                <>&nbsp;</>
              )}
            </div>
          ))}
        </pre>
      </div>
    </motion.div>
  );
}
