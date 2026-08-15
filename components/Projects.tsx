"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Cpu } from "lucide-react";

const projectsData = [
  {
    title: "Face Detection System",
    desc: "Real-time face detection using Haar Cascades and DNN",
    tech: ["OpenCV", "Python", "DNN"],
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
  },
  {
    title: "Object Tracker",
    desc: "Multi-object tracking with CSRT and KCF algorithms",
    tech: ["OpenCV", "NumPy", "Tracker"],
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  },
  {
    title: "Edge Detection Pipeline",
    desc: "Canny, Sobel, and Laplacian edge detection comparison",
    tech: ["OpenCV", "Matplotlib"],
    difficulty: "Beginner",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
  },
];

const diffColors: Record<string, string> = {
  Beginner: "text-[#38E89A] border-[rgba(56,232,154,0.3)]",
  Intermediate: "text-[#fbbf24] border-[rgba(251,191,36,0.3)]",
  Advanced: "text-[#f472b6] border-[rgba(244,114,182,0.3)]",
};

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative z-10 py-24" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-block rounded-full border border-[rgba(167,139,250,0.2)] bg-[rgba(167,139,250,0.08)] px-4 py-1.5 text-xs font-semibold text-[#a78bfa]">
            Hands-On
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-[#a78bfa] to-[#f472b6] bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-slate-600 dark:text-[#8C9AAF]">
            Real-world computer vision projects with complete source code and explanations.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projectsData.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="glass-card group cursor-pointer overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030812] via-transparent to-transparent dark:from-[#030812] from-slate-100/80" />
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all group-hover:bg-[#20D9FF]/20">
                  <ArrowUpRight size={14} className="text-white" />
                </div>
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{proj.title}</h3>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${diffColors[proj.difficulty]}`}>
                    {proj.difficulty}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-[#8C9AAF]">{proj.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map((t, j) => (
                    <span
                      key={j}
                      className="flex items-center gap-1 rounded-md bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:text-[#94a3b8]"
                    >
                      <Cpu size={10} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
