"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import CodePanel from "./CodePanel";
import FeatureDetectionCard from "./FeatureDetectionCard";
import ImageProcessingCard from "./ImageProcessingCard";
import { MODULES } from "@/lib/modules";

// Soft radial fade so the artwork's edges blend into the dark page
// background instead of showing as a visible rectangle — the photo's own
// edge color is dark but not an exact match for the page background, so
// without this a faint box outline is visible (that's the bug being fixed
// here). This only fades opacity/visibility, it never crops the photo.
const EYE_MASK: React.CSSProperties = {
  maskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, black 55%, transparent 92%)",
  WebkitMaskImage:
    "radial-gradient(ellipse 72% 68% at 50% 46%, black 55%, transparent 92%)",
};

// Plain artwork, edges mask-faded (see EYE_MASK). The box uses the source
// image's real aspect ratio (1672x941, ~16:9) so object-cover never has
// to crop it.
function EyeArtwork() {
  return (
    <div className="pointer-events-none absolute inset-0" style={EYE_MASK}>
      <Image
        src="/images/eye-scan-hero.png"
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
      {/* Desktop / tablet: eye artwork at its native ~16:9 aspect ratio,
          sized by its own width, next to the code/feature/processing
          column, which is free to run taller. */}
      <div className="hidden gap-4 sm:flex sm:items-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="relative aspect-[1672/941] w-[70%] shrink-0"
        >
          <EyeArtwork />
        </motion.div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
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
