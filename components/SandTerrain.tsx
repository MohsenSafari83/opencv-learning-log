"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural sand/wave terrain.
 *
 * Visually verified via headless-browser screenshots at 1440x900 and
 * 1920x1080 against the reference image (not just "compiles"). Rendering
 * priority, in order:
 *   1. ONE continuous filled terrain mass (real volume, no banding seams)
 *   2. A clipped, blurred "relief" pass for internal shape/light — gated by
 *      real local crest height, so valleys stay dark and only genuinely
 *      raised ground gets any light
 *   3. Marching-squares isoline contours over a coarse height grid, sampled
 *      from the SAME field + perspective mapping as the mass/relief. Unlike
 *      a per-row stroked path, these segments genuinely fork, merge, and
 *      close into loops around summits — verified visually (a closed ring
 *      around a peak is visible in the reference screenshots). Thresholds
 *      are concentrated at high height-percentiles so lines trace peak
 *      outlines rather than valley floors, keeping the mass dominant.
 *
 * Researched but not adopted:
 *   - WebGL/shader terrain (dynamic lighting/shadow) — not needed; the
 *     reference's lighting is a baked color/opacity gradient, not physically
 *     simulated, so Canvas 2D remains the right tool.
 *   - The `marchingsquares` npm package (RaumZeit/MarchingSquares.js) is
 *     AGPL-3.0; the isoline algorithm below is a small hand-rolled
 *     implementation instead, to avoid license entanglement in the app.
 */

// ---- tiny hash-based value noise (no deps) ----
function hash(x: number, y: number): number {
  let n = x * 374761393 + y * 668265263;
  n = (n ^ (n >> 13)) * 1274126177;
  n = n ^ (n >> 16);
  return ((n & 0xfffffff) / 0xfffffff) * 2 - 1;
}
function smooth(t: number) {
  return t * t * (3 - 2 * t);
}
function valueNoise2D(x: number, y: number): number {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const tl = hash(xi, yi), tr = hash(xi + 1, yi);
  const bl = hash(xi, yi + 1), br = hash(xi + 1, yi + 1);
  const u = smooth(xf), v = smooth(yf);
  const top = tl + u * (tr - tl);
  const bottom = bl + u * (br - bl);
  return top + v * (bottom - top);
}
function fbm(x: number, y: number, octaves: number): number {
  let amp = 1, freq = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise2D(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}
function warp(x: number, y: number): [number, number] {
  const wx = fbm(x * 0.14 + 12, y * 0.14 + 12, 2);
  const wy = fbm(x * 0.14 - 33, y * 0.14 - 33, 2);
  return [wx * 1.6, wy * 1.6];
}
function terrainHeight(x: number, y: number): number {
  const [wx, wy] = warp(x, y);
  const large = fbm((x + wx) * 0.17, (y + wy) * 0.5, 2); // dominant dunes
  const medium = fbm(x * 0.55, y * 1.1, 2) * 0.22; // secondary deformation
  const fine = valueNoise2D(x * 3.2, y * 3.2) * 0.03; // grain, barely visible
  let h = large + medium + fine;
  h = h > 0 ? Math.pow(h, 1.4) : h * 0.55; // broad dark valleys, narrow raised crests
  return h;
}

type Row = { pts: { x: number; y: number }[]; fade: number; maxH: number };
type Pt = { x: number; y: number };
type Seg = { p0: Pt; p1: Pt; r: number };

// Standard 16-case marching-squares table with linear interpolation, run
// directly in screen space (the edge crossing is interpolated the same
// fraction for both height and screen position, keeping segments glued to
// the actual perspective-projected surface).
function marchingSquaresSegments(
  heightGrid: Float32Array,
  screenGrid: Pt[],
  gRows: number,
  gCols: number,
  threshold: number
): Seg[] {
  const h = (r: number, c: number) => heightGrid[r * gCols + c];
  const s = (r: number, c: number) => screenGrid[r * gCols + c];
  const interp = (r0: number, c0: number, r1: number, c1: number): Pt => {
    const v0 = h(r0, c0), v1 = h(r1, c1);
    const tt = Math.abs(v1 - v0) < 1e-6 ? 0.5 : (threshold - v0) / (v1 - v0);
    const p0 = s(r0, c0), p1 = s(r1, c1);
    return { x: p0.x + (p1.x - p0.x) * tt, y: p0.y + (p1.y - p0.y) * tt };
  };
  const segs: Seg[] = [];
  for (let r = 0; r < gRows - 1; r++) {
    for (let c = 0; c < gCols - 1; c++) {
      const tl = h(r, c) > threshold ? 1 : 0;
      const tr = h(r, c + 1) > threshold ? 1 : 0;
      const br = h(r + 1, c + 1) > threshold ? 1 : 0;
      const bl = h(r + 1, c) > threshold ? 1 : 0;
      const idx = tl * 8 + tr * 4 + br * 2 + bl;
      if (idx === 0 || idx === 15) continue;
      const top = () => interp(r, c, r, c + 1);
      const right = () => interp(r, c + 1, r + 1, c + 1);
      const bottom = () => interp(r + 1, c, r + 1, c + 1);
      const left = () => interp(r, c, r + 1, c);
      if (idx === 5) {
        segs.push({ p0: top(), p1: left(), r });
        segs.push({ p0: bottom(), p1: right(), r });
        continue;
      }
      if (idx === 10) {
        segs.push({ p0: top(), p1: right(), r });
        segs.push({ p0: bottom(), p1: left(), r });
        continue;
      }
      const pairs: Record<number, [() => Pt, () => Pt]> = {
        1: [left, bottom], 2: [bottom, right], 3: [left, right],
        4: [top, right], 6: [top, bottom], 7: [top, left],
        8: [top, left], 9: [top, bottom],
        11: [top, right], 12: [left, right],
        13: [bottom, right], 14: [left, bottom],
      };
      const p = pairs[idx];
      if (!p) continue;
      segs.push({ p0: p[0](), p1: p[1](), r });
    }
  }
  return segs;
}

export default function SandTerrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let cssHeight = 0;
    let ROWS = 56;
    let XS = 140;
    let zValues: number[] = [];
    let strokeGrad: CanvasGradient | null = null;

    const buildRows = () => {
      const mobile = window.innerWidth < 768;
      ROWS = mobile ? 34 : 56;
      XS = mobile ? 80 : 140;
      const weights: number[] = [];
      for (let i = 0; i < ROWS; i++) weights.push(1 / (1 + i * 0.1));
      const total = weights.reduce((a, b) => a + b, 0);
      let acc = 0;
      zValues = weights.map((w) => (acc += w) / total);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      cssHeight = Math.max(320, Math.min(620, window.innerHeight * 0.5));
      canvas.style.width = "100%";
      canvas.style.height = `${cssHeight}px`;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, "#2477FF");
      grad.addColorStop(0.55, "#20D9FF");
      grad.addColorStop(1, "#38E89A");
      strokeGrad = grad;

      buildRows();
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    let accMs = 0;
    let t = 0.6;

    const buildRow = (i: number, centerX: number): Row => {
      const z = zValues[i];
      const screenY = cssHeight - cssHeight * 0.92 * z;
      const ampPx = 230 * (1 - z * 0.6);
      const xScale = 1 - z * 0.15;
      const fade = 1 - smooth(Math.max(0, Math.min(1, (z - 0.8) / 0.2)));
      const pts: Pt[] = [];
      let maxH = -Infinity;
      for (let j = 0; j < XS; j++) {
        const u = j / (XS - 1);
        const worldX = u * 20;
        const worldY = z * 3.5 + t;
        const h = terrainHeight(worldX, worldY);
        if (h > maxH) maxH = h;
        const px = centerX + (u * width - centerX) * xScale;
        const py = screenY - h * ampPx;
        pts.push({ x: px, y: py });
      }
      return { pts, fade, maxH };
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, cssHeight);
      const centerX = width / 2;

      const rows: Row[] = [];
      for (let i = ROWS - 1; i >= 0; i--) rows.push(buildRow(i, centerX));
      // rows[0] = furthest back (skyline), rows[last] = closest (foreground)

      // ---- 1. ONE continuous terrain mass ----
      const sky = rows[0];
      const massPath = new Path2D();
      massPath.moveTo(sky.pts[0].x, sky.pts[0].y);
      for (const p of sky.pts) massPath.lineTo(p.x, p.y);
      massPath.lineTo(width, cssHeight);
      massPath.lineTo(0, cssHeight);
      massPath.closePath();
      const topY = Math.min(...sky.pts.map((p) => p.y));
      const skyGrad = ctx.createLinearGradient(0, topY, 0, cssHeight);
      skyGrad.addColorStop(0, "rgba(5,8,16,0)");
      skyGrad.addColorStop(0.18, "rgba(5,9,17,0.4)");
      skyGrad.addColorStop(0.55, "rgba(7,12,22,0.68)");
      skyGrad.addColorStop(1, "rgba(9,15,28,0.88)");
      ctx.fillStyle = skyGrad;
      ctx.fill(massPath);

      // ---- 2. Clipped relief pass — real volume, gated by real height ----
      ctx.save();
      ctx.clip(massPath);
      ctx.globalCompositeOperation = "lighter";
      const reliefDepths = [0.06, 0.16, 0.28, 0.42, 0.58, 0.75, 0.92];

      // Real per-row crest height (from the noise field, not screen
      // position) drives the gate: valleys stay dark, only genuinely
      // raised ground gets any light.
      let rowMaxMin = Infinity, rowMaxMax = -Infinity;
      for (const row of rows) {
        if (row.maxH < rowMaxMin) rowMaxMin = row.maxH;
        if (row.maxH > rowMaxMax) rowMaxMax = row.maxH;
      }
      const rowMaxRange = Math.max(rowMaxMax - rowMaxMin, 1e-4);

      for (const dt of reliefDepths) {
        const k = Math.min(rows.length - 1, Math.round(dt * rows.length));
        const row = rows[k];
        const liftRaw = (row.maxH - rowMaxMin) / rowMaxRange;
        if (liftRaw < 0.3) continue;
        const liftT = (liftRaw - 0.3) / 0.7;
        ctx.beginPath();
        ctx.moveTo(row.pts[0].x, row.pts[0].y);
        for (const p of row.pts) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(28, 105, 195, ${liftT * 0.11})`;
        ctx.lineWidth = 55 * (1 - dt * 0.5);
        ctx.stroke();
      }
      ctx.restore();

      // ---- soft crest glow — a light cue, not a line ----
      const glowRow = rows[Math.floor(rows.length * 0.32)];
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let j = 8; j < XS - 8; j += 6) {
        const p = glowRow.pts[j], pPrev = glowRow.pts[j - 6], pNext = glowRow.pts[j + 6];
        if (!(p.y < pPrev.y && p.y < pNext.y)) continue;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 100);
        g.addColorStop(0, "rgba(32,140,220,0.09)");
        g.addColorStop(1, "rgba(32,140,220,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 100, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ---- 3. Marching-squares isolines: genuine forking/merging contours ----
      const GR = 22, GC = 64;
      const gRowIdx = Array.from({ length: GR }, (_, i) =>
        Math.round((i * (rows.length - 1)) / (GR - 1))
      );
      const heightGrid = new Float32Array(GR * GC);
      const screenGrid: Pt[] = new Array(GR * GC);
      const rowFadeArr: number[] = new Array(GR);
      let gMin = Infinity, gMax = -Infinity;
      for (let gr = 0; gr < GR; gr++) {
        rowFadeArr[gr] = rows[gRowIdx[gr]].fade;
        const originalI = ROWS - 1 - gRowIdx[gr];
        const z = zValues[Math.max(0, Math.min(ROWS - 1, originalI))];
        const screenY = cssHeight - cssHeight * 0.92 * z;
        const ampPx = 230 * (1 - z * 0.6);
        const xScale = 1 - z * 0.15;
        for (let gc = 0; gc < GC; gc++) {
          const u = gc / (GC - 1);
          const worldX = u * 20;
          const worldY = z * 3.5 + t;
          const hgt = terrainHeight(worldX, worldY);
          heightGrid[gr * GC + gc] = hgt;
          if (hgt < gMin) gMin = hgt;
          if (hgt > gMax) gMax = hgt;
          const px = centerX + (u * width - centerX) * xScale;
          const py = screenY - hgt * ampPx;
          screenGrid[gr * GC + gc] = { x: px, y: py };
        }
      }
      const gRange = Math.max(gMax - gMin, 1e-4);
      const thresholds = [0.55, 0.68, 0.8, 0.92].map((p) => gMin + p * gRange);

      if (strokeGrad) {
        for (const threshold of thresholds) {
          const thresholdT = (threshold - gMin) / gRange;
          const segs = marchingSquaresSegments(heightGrid, screenGrid, GR, GC, threshold);
          for (const seg of segs) {
            const fade = rowFadeArr[seg.r] ?? 0;
            const alpha = fade * Math.pow(thresholdT, 1.6) * 0.85;
            if (alpha <= 0.025) continue;
            ctx.beginPath();
            ctx.moveTo(seg.p0.x, seg.p0.y);
            ctx.lineTo(seg.p1.x, seg.p1.y);
            ctx.strokeStyle = strokeGrad;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1 + thresholdT * 1.3;
            if (thresholdT > 0.75) {
              ctx.shadowColor = "#20D9FF";
              ctx.shadowBlur = 8;
            } else {
              ctx.shadowBlur = 0;
            }
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    if (reduceMotion) {
      drawFrame();
    } else {
      const animate = (now: number) => {
        const dt = now - last;
        last = now;
        accMs += dt;
        if (accMs > 1000 / 24) {
          t += accMs * 0.0000075; // very slow evolution, not a loop
          drawFrame();
          accMs = 0;
        }
        rafRef.current = requestAnimationFrame(animate);
      };
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Full-bleed: no container, no max-width, no rounding/border. The mask
  // fades the extreme left/right edges so the perspective-converged
  // silhouette dissolves instead of hard-cutting against the background.
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-x-0 bottom-0 w-full dark:opacity-100 opacity-50"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
        maskImage:
          "linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)",
      }}
    />
  );
}
