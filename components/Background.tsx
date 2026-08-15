"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 40 : 80;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? "0, 242, 254" : "16, 185, 129",
    }));

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouse);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.x -= dx * 0.005;
          p.y -= dy * 0.005;
        }

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Glow Orbs - only visible in dark mode */}
      <div className="absolute -top-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,242,254,0.12),transparent_70%)] blur-[120px] animate-pulse-glow hidden dark:block" />
      <div className="absolute bottom-[10%] -left-[5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(56,232,154,0.1),transparent_70%)] blur-[120px] animate-pulse-glow hidden dark:block" style={{ animationDelay: "-4s" }} />
      <div className="absolute top-[40%] -right-[5%] h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.08),transparent_70%)] blur-[120px] animate-pulse-glow hidden dark:block" style={{ animationDelay: "-8s" }} />

      {/* Light mode subtle gradient orbs */}
      <div className="absolute -top-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(36,119,255,0.06),transparent_70%)] blur-[120px] dark:hidden" />
      <div className="absolute bottom-[10%] -left-[5%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(56,232,154,0.05),transparent_70%)] blur-[120px] dark:hidden" />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 dark:opacity-100 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,242,254,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,254,0.03)_1px,transparent_1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse_at_50%_50%,black_30%,transparent_70%)",
          WebkitMaskImage: "radial-gradient(ellipse_at_50%_50%,black_30%,transparent_70%)",
        }}
      />

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 dark:opacity-100 opacity-40" />

      {/* Animated Bottom Wave SVG */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-[200%] h-full opacity-[0.12] dark:opacity-[0.12] opacity-[0.06]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ animation: "wave 20s linear infinite" }}
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#20D9FF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38E89A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#20D9FF" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGrad1)"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg
          className="absolute bottom-0 left-0 w-[200%] h-full opacity-[0.08] dark:opacity-[0.08] opacity-[0.04]"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ animation: "wave 25s linear infinite reverse" }}
        >
          <defs>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38E89A" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#20D9FF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#38E89A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGrad2)"
            d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,261.3C672,277,768,267,864,245.3C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
}
