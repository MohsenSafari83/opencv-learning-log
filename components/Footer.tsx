"use client";

import { Github, Twitter, Linkedin, Heart } from "lucide-react";

function OpenCVLogoSmall({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="28" r="24" fill="#FF4444" />
      <circle cx="28" cy="72" r="24" fill="#4ADE80" />
      <circle cx="72" cy="72" r="24" fill="#3B82F6" />
      <circle cx="50" cy="28" r="10" fill="white" />
      <circle cx="28" cy="72" r="10" fill="white" />
      <circle cx="72" cy="72" r="10" fill="white" />
      <circle cx="50" cy="28" r="6" fill="#FF6B6B" />
      <circle cx="28" cy="72" r="6" fill="#86EFAC" />
      <circle cx="72" cy="72" r="6" fill="#60A5FA" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[rgba(3,8,18,0.8)] py-12 backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <OpenCVLogoSmall size={32} />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              OpenCV{" "}
              <span className="bg-gradient-to-r from-[#2477FF] to-[#38E89A] bg-clip-text text-transparent">
                Learning Log
              </span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 dark:text-[#64748b] transition-colors hover:text-[#20D9FF]">
              <Github size={18} />
            </a>
            <a href="#" className="text-slate-400 dark:text-[#64748b] transition-colors hover:text-[#20D9FF]">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-slate-400 dark:text-[#64748b] transition-colors hover:text-[#20D9FF]">
              <Linkedin size={18} />
            </a>
          </div>

          <p className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-[#475569]">
            Built with <Heart size={12} className="text-[#f472b6]" /> for the CV community
          </p>
        </div>
      </div>
    </footer>
  );
}
