"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CodePanel from "./CodePanel";
import FeatureDetectionCard from "./FeatureDetectionCard";
import ImageProcessingCard from "./ImageProcessingCard";
import { MODULES } from "@/lib/modules";

// Soft radial fade so the artwork's edges blend into the page background
// instead of showing as a visible rectangle. This only fades
// opacity/visibility, it never crops the photo.
const EYE_MASK: React.CSSProperties = {
  maskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, black 55%, transparent 92%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, black 55%, transparent 92%)",
};

/**
 * Reads the real 'dark' class off <html> directly (same source every
 * dark: Tailwind utility in the app uses), kept in sync with a
 * MutationObserver — NOT useTheme(), whose context value has been
 * observed to drift out of sync with the actual class (see
 * HeroBackground.tsx for the same fix, same reasoning).
 * Defaults to true (dark) to match ThemeProvider's own default before
 * mount, avoiding a flash of the wrong asset on first paint.
 */
function useIsDarkMode() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// Two purpose-made transparent PNGs — not one image with a CSS filter —
// because a filter like invert() wrecks a photoreal image's lighting and
// glow. See /public/images/eye-scan-hero.png (dark) and
// eye-scan-hero-light.png (light, same composition, warmer/deeper tones,
// still a transparent RGBA PNG).
const DARK_SRC = "/images/eye-scan-hero.png";
const LIGHT_SRC = "/images/eye-scan-hero-light.png";

function EyeArtwork() {
  const isDark = useIsDarkMode();
  return (
    <div className="pointer-events-none absolute inset-0" style={EYE_MASK}>
      <Image
        src={isDark ? DARK_SRC : LIGHT_SRC}
        alt="Eye-scan HUD illustration for the OpenCV Learning Log hero"
        fill
        priority
        sizes="(min-width: 640px) 65vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export default function HeroScanVisual() {
  // module for the edges/contours code sample + feature-detection card
  const m3 = MODULES[2] ?? MODULES[0];
  // module for the image-processing (thresholding) card
  const m1 = MODULES[0];

  return (
    <div className="relative">
      {/* Desktop / tablet: eye artwork full-width at the top, at its
          native ~16:9 aspect ratio, with the code/feature/processing
          cards laid out in a row underneath it. */}
      <div className="hidden gap-4 sm:flex sm:flex-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative aspect-[1672/941] w-full"
        >
          <EyeArtwork />
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {m3 && (
            <Link
              href={`/modules/${m3.id}`}
              className="group block transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline-none"
            >
              <CodePanel variant="edges" delay={0.3} />
            </Link>
          )}
          {m3 && <FeatureDetectionCard href={`/modules/${m3.id}`} delay={0.5} />}
          {m1 && <ImageProcessingCard href={`/modules/${m1.id}`} delay={0.65} />}
        </div>
      </div>

      {/* Mobile: smaller artwork, same native aspect ratio, cards stacked
          normally below. */}
      <div className="flex flex-col gap-3 sm:hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[1672/941] w-full"
        >
          <EyeArtwork />
        </motion.div>
        {m3 && (
          <Link href={`/modules/${m3.id}`} className="block">
            <CodePanel variant="edges" />
          </Link>
        )}
        <div className="grid grid-cols-2 gap-3">
          {m3 && <FeatureDetectionCard href={`/modules/${m3.id}`} />}
          {m1 && <ImageProcessingCard href={`/modules/${m1.id}`} />}
        </div>
      </div>
    </div>
  );
}