"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Adapted from openbackgrounds' SombreroDunes.vue (MIT), which is real,
 * production code using: a genuine PerspectiveCamera + wireframe
 * PlaneGeometry (perspective comes from real 3D projection, not a 2D
 * approximation), vertex-shader Perlin noise displacement, THREE.Fog for
 * real distance-based atmospheric fade, and three stacked planes (wireframe
 * dunes + a faint base + a radial-gradient halo) for volume instead of
 * manually-computed alpha bands.
 *
 * Changes from the original:
 *   - The radial "sombrero" ripple term is replaced with an anisotropic
 *     dune-ridge term (wide horizontally) to match flowing dunes rather
 *     than concentric rings.
 *   - Recolored to the site palette (#2477FF / #20D9FF / #38E89A) instead
 *     of the original's violet.
 *   - Camera/plane repositioned for a bottom-anchored full-bleed hero
 *     composition instead of a centered "planet" framing.
 *   - Vue Composition API -> React hooks; otherwise the mesh/shader/fog
 *     architecture is intentionally left close to the proven original to
 *     minimize the risk of introducing WebGL bugs I can't see rendered.
 *
 * IMPORTANT: unlike SandTerrain.tsx (Canvas 2D), this has NOT been
 * screenshot-verified — this sandbox has no network access to load `three`
 * in a browser, so I can't render and inspect it the way I did the Canvas
 * version. Treat this as a reasoned-but-unverified draft. Run it locally
 * and send a screenshot back so it can go through the same iteration loop.
 *
 * Requires: `npm install three` (not currently a dependency of this project).
 */
export default function SandTerrainGL() {
  const holderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const holder = holderRef.current;
    const canvas = canvasRef.current;
    if (!holder || !canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lookTarget = new THREE.Vector3(0, -1.2, -2);

    const uniforms = {
      uTime: { value: 0 },
      uSpeed: { value: 0.14 },
      uElevation: { value: 0.85 },
      uLineColor: { value: new THREE.Color("#20D9FF") },
      uGlowColor: { value: new THREE.Color("#040a16") },
      uAccentColor: { value: new THREE.Color("#38E89A") },
    };

    // Vertex shader: classic Perlin noise (verbatim from the reference —
    // this implementation is well-tested, not something to improvise on)
    // plus a hand-rolled anisotropic dune term replacing the sombrero ripple.
    const vertexShader = `
      varying vec2 vUv;
      varying float vHeight;

      uniform float uTime;
      uniform float uSpeed;
      uniform float uElevation;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float cnoise(vec3 P) {
        vec3 Pi0 = floor(P);
        vec3 Pi1 = Pi0 + vec3(1.0);
        Pi0 = mod289(Pi0);
        Pi1 = mod289(Pi1);
        vec3 Pf0 = fract(P);
        vec3 Pf1 = Pf0 - vec3(1.0);
        vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
        vec4 iy = vec4(Pi0.yy, Pi1.yy);
        vec4 iz0 = Pi0.zzzz;
        vec4 iz1 = Pi1.zzzz;

        vec4 ixy = permute(permute(ix) + iy);
        vec4 ixy0 = permute(ixy + iz0);
        vec4 ixy1 = permute(ixy + iz1);

        vec4 gx0 = ixy0 * (1.0 / 7.0);
        vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
        gx0 = fract(gx0);
        vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
        vec4 sz0 = step(gz0, vec4(0.0));
        gx0 -= sz0 * (step(0.0, gx0) - 0.5);
        gy0 -= sz0 * (step(0.0, gy0) - 0.5);

        vec4 gx1 = ixy1 * (1.0 / 7.0);
        vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
        gx1 = fract(gx1);
        vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
        vec4 sz1 = step(gz1, vec4(0.0));
        gx1 -= sz1 * (step(0.0, gx1) - 0.5);
        gy1 -= sz1 * (step(0.0, gy1) - 0.5);

        vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
        vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
        vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
        vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
        vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
        vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
        vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
        vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

        vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
        g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
        vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
        g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;

        float n000 = dot(g000, Pf0);
        float n100 = dot(g100, vec3(Pf1.x, Pf0.y, Pf0.z));
        float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
        float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
        float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
        float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
        float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
        float n111 = dot(g111, Pf1);

        vec3 fade_xyz = Pf0 * Pf0 * Pf0 * (Pf0 * (Pf0 * 6.0 - 15.0) + 10.0);
        vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
        vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
        return mix(n_yz.x, n_yz.y, fade_xyz.x);
      }

      void main() {
        vUv = uv;
        float t = uTime * uSpeed;
        vec2 p = position.xz;

        // Anisotropic: much lower frequency across x than z, so formations
        // read as wide flowing dunes instead of the original's circular
        // "sombrero" ripple rings.
        float large = cnoise(vec3(p.x * 0.10, p.y * 0.24, t * 0.5));
        float medium = cnoise(vec3(p.x * 0.34, p.y * 0.55, t * 0.8)) * 0.24;
        float fine = cnoise(vec3(p.x * 1.1, p.y * 1.5, t * 1.1)) * 0.05;

        float height = large + medium + fine;
        // Broad dark valleys, narrower raised crests (matches the
        // reference's mostly-flat-with-selective-peaks read).
        height = height > 0.0 ? pow(height, 1.4) : height * 0.55;
        height *= uElevation;
        vHeight = height;

        vec3 displaced = vec3(position.x, position.y, height);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
      }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      varying float vHeight;

      uniform vec3 uLineColor;
      uniform vec3 uGlowColor;
      uniform vec3 uAccentColor;

      void main() {
        // Depth fade (uv.y = distance into the scene along the plane).
        float depthFade = smoothstep(0.0, 1.0, vUv.y);
        float heightGlow = smoothstep(-2.0, 1.6, vHeight);

        // Wide elliptical edge fade (not circular) — dissolves all four
        // plane edges, including left/right, without a visible rectangle,
        // while staying wide enough to read as a broad horizontal band.
        vec2 centered = vUv - 0.5;
        float ellipse = length(vec2(centered.x / 0.9, centered.y / 0.42));
        float rim = smoothstep(0.62, 0.15, ellipse);

        vec3 base = mix(uGlowColor, uLineColor, heightGlow * 0.75);
        // Left-to-right blue -> green drift, matching the site palette.
        base = mix(base, uAccentColor, smoothstep(0.55, 1.0, vUv.x) * 0.35);

        float alpha = 0.05 + (1.0 - depthFade) * 0.24;
        alpha *= rim;
        alpha = clamp(alpha, 0.0, 0.34);

        gl_FragColor = vec4(base, alpha);
      }
    `;

    const scene = new THREE.Scene();
    // Fog color matches the page background (--cv-bg: #030812) so distant
    // geometry blends into the page instead of a visible far edge.
    scene.fog = new THREE.Fog(0x030812, 10, 34);

    const width = holder.clientWidth || window.innerWidth;
    const height = holder.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    // Lower, more downward-angled camera than the original's centered
    // "planet" framing — bottom-anchored, foreground large, receding into
    // fog toward the top, matching the verified Canvas composition.
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 60);
    camera.position.set(0, 2.1, 7.2);
    camera.lookAt(lookTarget);

    const hemiLight = new THREE.HemisphereLight(0x3a6fff, 0x040a16, 0.4);
    scene.add(hemiLight);

    const geometry = new THREE.PlaneGeometry(44, 26, 300, 180);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      wireframe: true,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dunesMesh = new THREE.Mesh(geometry, material);
    dunesMesh.rotation.x = -Math.PI / 2;
    dunesMesh.position.y = -1.4;
    dunesMesh.position.z = -3;
    scene.add(dunesMesh);

    const baseGeometry = new THREE.PlaneGeometry(60, 34, 1, 1);
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0x050b16,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
    });
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    baseMesh.rotation.x = -Math.PI / 2;
    baseMesh.position.y = -2.0;
    baseMesh.position.z = -3;
    scene.add(baseMesh);

    const haloGeometry = new THREE.PlaneGeometry(90, 50, 1, 1);
    const haloMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uInner: { value: new THREE.Color("#0a1830") },
        uOuter: { value: new THREE.Color("#020508") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uInner;
        uniform vec3 uOuter;
        void main() {
          vec2 centered = vUv - 0.5;
          float dist = length(vec2(centered.x / 1.3, centered.y / 0.6));
          float falloff = smoothstep(0.7, 0.15, dist);
          vec3 col = mix(uOuter, uInner, falloff);
          float alpha = smoothstep(1.0, 0.15, dist) * 0.4;
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMesh.rotation.x = -Math.PI / 2;
    haloMesh.position.y = -2.6;
    haloMesh.position.z = -3;
    scene.add(haloMesh);

    const handleResize = () => {
      const w = holder.clientWidth || window.innerWidth;
      const h = holder.clientHeight || window.innerHeight;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize, { passive: true });

    const clock = new THREE.Clock();
    let disposed = false;

    const renderFrame = () => {
      if (disposed) return;
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;
      dunesMesh.rotation.z = Math.sin(elapsed * 0.06) * 0.02;
      camera.position.x = Math.sin(elapsed * 0.02) * 0.15;
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      if (!reduceMotion) frameIdRef.current = requestAnimationFrame(renderFrame);
    };
    renderFrame();

    return () => {
      disposed = true;
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameIdRef.current);
      geometry.dispose();
      material.dispose();
      baseGeometry.dispose();
      baseMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={holderRef} className="absolute inset-x-0 bottom-0 h-[55vh] min-h-[380px] max-h-[640px] pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
