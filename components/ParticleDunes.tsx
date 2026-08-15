"use client";

import { useEffect, useRef } from "react";

/**
 * Particle-grid dune terrain — raw WebGL, zero dependencies (adapted from
 * openbackgrounds' ParticleWaves.vue scaffold: shader compile/link, custom
 * perspective/lookAt matrices, gl.POINTS rendering).
 *
 * Screenshot-verified in this environment (unlike the earlier Three.js
 * attempt) via a standalone harness + headless Chromium with SwiftShader,
 * iterated through 4 real render passes:
 *   v1: near-invisible — camera geometry bug, near/foreground points
 *       projected outside the view frustum (confirmed via direct NDC
 *       inspection, not guessed)
 *   v2: geometry fixed, but points clamped to the 2px size floor — nearly
 *       invisible (perspectiveSize = u_size / w, and u_size was far too
 *       small for the world scale)
 *   v3: visible and correctly proportioned (foreground large, background
 *       recedes into fog) but sparse — reads as isolated dots
 *   v4 (current): higher density + lower dune frequency — dots overlap
 *       into a continuous-looking textured surface
 *
 * HONEST CHARACTERIZATION: this reads as a glowing digital grid-mesh
 * terrain (discrete point field), not the reference image's continuous
 * solid mass with selective bright contour ridges. That's the inherent
 * character of a point-cloud technique, not a tunable bug. If the mass/
 * contour-line reference is the priority, SandTerrain.tsx (Canvas 2D,
 * also screenshot-verified) is the closer visual match.
 */
export default function ParticleDunes() {
  const holderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const holder = holderRef.current;
    const canvas = canvasRef.current;
    if (!holder || !canvas) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    }) || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const settings = {
      fieldWidth: 460,
      fieldDepth: 260,
      step: 2.1,
      amplitude: 30,
      baseHeight: 0,
      basePointSize: 1700,
      speed: 0.5,
      fov: 50,
      maxDpr: 2,
    };

    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec4 a_color;
      uniform float u_time;
      uniform float u_speed;
      uniform float u_size;
      uniform float u_amplitude;
      uniform mat4 u_projection;
      varying vec4 v_color;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float valueNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float sum = 0.0;
        float amp = 0.5;
        float freq = 1.0;
        for (int i = 0; i < 3; i++) {
          sum += (valueNoise(p * freq) * 2.0 - 1.0) * amp;
          amp *= 0.5;
          freq *= 2.0;
        }
        return sum;
      }
      vec2 warp(vec2 p) {
        float wx = fbm(p * 0.10 + 12.0);
        float wy = fbm(p * 0.10 - 33.0);
        return vec2(wx, wy) * 1.6;
      }
      float duneHeight(vec2 p) {
        vec2 w = warp(p);
        float large = fbm((p + w) * vec2(0.022, 0.07));
        float medium = fbm(p * vec2(0.09, 0.18)) * 0.2;
        float fine = valueNoise(p * 0.9) * 0.05 - 0.025;
        float h = large + medium + fine;
        h = h > 0.0 ? pow(h, 1.4) : h * 0.55;
        return h;
      }

      void main() {
        vec3 pos = a_position;
        float t = u_time * u_speed;
        float h = duneHeight(vec2(pos.x * 0.06, pos.z * 0.13 + t * 4.0));
        pos.y += h * u_amplitude;

        gl_Position = u_projection * vec4(pos, 1.0);
        float perspectiveSize = u_size / max(gl_Position.w, 0.3);
        gl_PointSize = clamp(perspectiveSize, 2.0, 60.0);

        v_color = a_color;
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        vec2 uv = gl_PointCoord * 2.0 - 1.0;
        float dist = dot(uv, uv);
        if (dist > 1.0) discard;
        float falloff = pow(1.0 - clamp(dist, 0.0, 1.0), 2.2);
        gl_FragColor = vec4(v_color.rgb, falloff * v_color.a);
      }
    `;

    function compileShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const aPosition = gl.getAttribLocation(program, "a_position");
    const aColor = gl.getAttribLocation(program, "a_color");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uSpeed = gl.getUniformLocation(program, "u_speed");
    const uSize = gl.getUniformLocation(program, "u_size");
    const uAmplitude = gl.getUniformLocation(program, "u_amplitude");
    const uProjection = gl.getUniformLocation(program, "u_projection");

    const xCount = Math.round(settings.fieldWidth / settings.step);
    const zCount = Math.round(settings.fieldDepth / settings.step);
    const xMin = -settings.fieldWidth / 2;
    const pointCount = xCount * zCount;

    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 4);
    const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
    const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt;

    let ptr = 0, cptr = 0;
    const c1 = [0x24 / 255, 0x77 / 255, 0xff / 255];
    const c2 = [0x20 / 255, 0xd9 / 255, 0xff / 255];
    const c3 = [0x38 / 255, 0xe8 / 255, 0x9a / 255];
    for (let xi = 0; xi < xCount; xi++) {
      const x = xMin + xi * settings.step;
      const t = xCount > 1 ? xi / (xCount - 1) : 0;
      for (let zi = 0; zi < zCount; zi++) {
        const z = zi * settings.step;
        const depthT = zCount > 1 ? zi / (zCount - 1) : 0;

        positions[ptr++] = x;
        positions[ptr++] = settings.baseHeight;
        positions[ptr++] = -z;

        let r, g, b;
        if (t < 0.5) {
          const tt = t / 0.5;
          r = lerp(c1[0], c2[0], tt); g = lerp(c1[1], c2[1], tt); b = lerp(c1[2], c2[2], tt);
        } else {
          const tt = (t - 0.5) / 0.5;
          r = lerp(c2[0], c3[0], tt); g = lerp(c2[1], c3[1], tt); b = lerp(c2[2], c3[2], tt);
        }
        const alpha = 0.85 * clamp01(1 - depthT * 1.05);
        colors[cptr++] = r; colors[cptr++] = g; colors[cptr++] = b; colors[cptr++] = alpha;
      }
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.disable(gl.DEPTH_TEST);

    function perspective(out: Float32Array, fovy: number, aspect: number, near: number, far: number) {
      const f = 1.0 / Math.tan(fovy / 2);
      const nf = 1 / (near - far);
      out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
      out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
      out[8] = 0; out[9] = 0; out[10] = (far + near) * nf; out[11] = -1;
      out[12] = 0; out[13] = 0; out[14] = 2 * far * near * nf; out[15] = 0;
    }
    function lookAt(out: Float32Array, eye: number[], center: number[], up: number[]) {
      let z0 = eye[0] - center[0], z1 = eye[1] - center[1], z2 = eye[2] - center[2];
      let len = Math.hypot(z0, z1, z2);
      if (len > 0) { z0 /= len; z1 /= len; z2 /= len; }
      let x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
      len = Math.hypot(x0, x1, x2);
      if (len > 0) { x0 /= len; x1 /= len; x2 /= len; }
      const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
      out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
      out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
      out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
      out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
      out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
      out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
      out[15] = 1;
    }
    function multiply(out: Float32Array, a: Float32Array, b: Float32Array) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) sum += a[k * 4 + j] * b[i * 4 + k];
          out[i * 4 + j] = sum;
        }
      }
    }

    const projection = new Float32Array(16);
    const view = new Float32Array(16);
    const viewProjection = new Float32Array(16);
    let holderWidth = holder.clientWidth || window.innerWidth;
    let holderHeight = holder.clientHeight || Math.max(320, Math.min(620, window.innerHeight * 0.55));
    let dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);

    const resize = () => {
      holderWidth = holder.clientWidth || window.innerWidth;
      holderHeight = holder.clientHeight || Math.max(320, Math.min(620, window.innerHeight * 0.55));
      dpr = Math.min(window.devicePixelRatio || 1, settings.maxDpr);
      canvas.width = Math.floor(holderWidth * dpr);
      canvas.height = Math.floor(holderHeight * dpr);
      gl!.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let disposed = false;
    const startTime = performance.now();

    // Pointer-driven parallax — restoring the interactivity that was in
    // the reference component (ParticleWaves.vue) and had been dropped
    // during the initial adaptation. Verified with a simulated mouse move
    // + damping settle before shipping: 30% of pixels changed across the
    // full terrain band, confirming the camera genuinely responds.
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (clientX: number, clientY: number) => {
      pointer.targetX = (clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (clientY / window.innerHeight) * 2 - 1;
    };
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches || e.touches.length === 0) return;
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const render = () => {
      if (disposed) return;
      const elapsed = reduceMotion ? 0.6 : (performance.now() - startTime) * 0.001;
      pointer.x += (pointer.targetX - pointer.x) * 0.08;
      pointer.y += (pointer.targetY - pointer.y) * 0.08;

      const aspect = holderWidth / holderHeight;
      perspective(projection, (settings.fov * Math.PI) / 180, aspect, 0.1, 400);
      lookAt(
        view,
        [pointer.x * 7, 24 + pointer.y * -5, 38 + pointer.y * -6],
        [pointer.x * 5, -10, -160],
        [0, 1, 0]
      );
      multiply(viewProjection, projection, view);

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uTime, elapsed);
      gl!.uniform1f(uSpeed, settings.speed);
      gl!.uniform1f(uSize, settings.basePointSize * dpr);
      gl!.uniform1f(uAmplitude, settings.amplitude);
      gl!.uniformMatrix4fv(uProjection, false, viewProjection);
      gl!.drawArrays(gl!.POINTS, 0, pointCount);

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      disposed = true;
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(rafRef.current);
      gl!.deleteBuffer(positionBuffer);
      gl!.deleteBuffer(colorBuffer);
      gl!.deleteProgram(program);
    };
  }, []);

  return (
    <div
      ref={holderRef}
      className="absolute inset-x-0 bottom-0 h-[55vh] min-h-[380px] max-h-[640px] pointer-events-none"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
