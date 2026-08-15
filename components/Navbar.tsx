"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, ArrowRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

const navLinks = [
  { label: "Knowledge", href: "#modules" },
  { label: "Cheat Sheets", href: "#" },
  { label: "Projects", href: "/projects" },
  { label: "Exercises", href: "/exercises" },
  { label: "Modules", href: "#modules" },
  { label: "Home", href: "#" },
];

function OpenCVLogo({ size = 36 }: { size?: number }) {
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

/**
 * Which nav label should show the active dot right now.
 *  - On routed pages (/projects, /exercises, ...) it's a plain pathname
 *    match — no scrolling involved.
 *  - On the homepage, hash-linked sections (#modules) are tracked with an
 *    IntersectionObserver so the dot actually follows scroll position;
 *    "Home" is the fallback while no tracked section is in view.
 */
function useActiveNavLabel() {
  const pathname = usePathname();
  const [activeLabel, setActiveLabel] = useState("Home");

  useEffect(() => {
    if (pathname !== "/") {
      const match = navLinks.find((l) => l.href === pathname);
      setActiveLabel(match ? match.label : "");
      return;
    }

    const hashLinks = navLinks.filter(
      (l) => l.href.startsWith("#") && l.href.length > 1
    );
    const sections = hashLinks
      .map((l) => ({ label: l.label, el: document.getElementById(l.href.slice(1)) }))
      .filter((s): s is { label: string; el: HTMLElement } => !!s.el);

    if (sections.length === 0) {
      setActiveLabel("Home");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = sections.find((s) => s.el === visible.target);
          if (match) setActiveLabel(match.label);
        } else if (window.scrollY < 200) {
          setActiveLabel("Home");
        }
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s.el));
    return () => observer.disconnect();
  }, [pathname]);

  return activeLabel;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const activeLabel = useActiveNavLabel();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <nav className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.06] bg-[rgba(3,8,18,0.7)] px-6 py-3.5 backdrop-blur-xl dark:bg-[rgba(3,8,18,0.7)] dark:border-white/[0.06] bg-white/80 border-slate-200/60">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <OpenCVLogo size={36} />
            <span className="text-lg font-bold tracking-tight dark:text-white text-slate-900">
              opencv-learning-log
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const active = link.label === activeLabel;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors duration-300",
                    active
                      ? "dark:text-white text-slate-900"
                      : "dark:text-[#8C9AAF] text-slate-500 hover:dark:text-white hover:text-slate-900"
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute -bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#20D9FF] shadow-[0_0_8px_#20D9FF]"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.dispatchEvent(new Event("toggle-palette"))}
              className="hidden h-10 items-center gap-2 rounded-full border dark:border-white/10 dark:bg-white/5 dark:text-[#8C9AAF] border-slate-200 bg-slate-100 px-4 text-xs text-slate-500 transition-all hover:dark:border-[#20D9FF]/50 hover:dark:text-white hover:border-[#20D9FF]/30 hover:text-[#20D9FF] sm:flex"
              aria-label="Search (Ctrl+K)"
            >
              <Search size={14} />
              <span>Search</span>
              <span className="rounded border dark:border-white/10 border-slate-300 px-1.5 py-0.5 text-[10px]">⌘K</span>
            </button>
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-full border dark:border-white/10 dark:bg-white/5 dark:text-[#8C9AAF] border-slate-200 bg-slate-100 text-slate-600 transition-all hover:dark:border-[#20D9FF]/50 hover:dark:text-white hover:dark:shadow-[0_0_15px_rgba(32,217,255,0.2)] hover:border-[#20D9FF]/30 hover:text-[#20D9FF]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border dark:border-white/10 dark:bg-white/5 dark:text-white border-slate-200 bg-slate-100 text-slate-700 lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-6 mt-2 rounded-2xl border dark:border-white/[0.06] dark:bg-[rgba(3,8,18,0.95)] border-slate-200/80 bg-white/95 p-6 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-base font-medium transition-colors",
                    link.label === activeLabel
                      ? "dark:text-white text-slate-900"
                      : "dark:text-[#8C9AAF] text-slate-500"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#modules"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2477FF] to-[#38E89A] px-5 py-3 text-sm font-bold text-white"
              >
                Start Learning <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
