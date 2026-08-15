import Link from "next/link";
import { MODULES } from "@/lib/modules";

export default function ModuleReadingNav({ moduleId }: { moduleId: string }) {
  const idx = MODULES.findIndex((m) => m.id === moduleId);
  if (idx === -1) return null;
  const prev = idx > 0 ? MODULES[idx - 1] : null;
  const next = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  return (
    <nav className="reading-nav" aria-label="Module navigation">
      <div className="rn-progress">
        Module {idx + 1} of {MODULES.length}
      </div>
      <div className="rn-links">
        {prev ? (
          <Link href={`/modules/${prev.id}`} className="rn-btn rn-prev">
            <span className="rn-arrow">←</span> {prev.label}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/modules/${next.id}`} className="rn-btn rn-next">
            {next.label} <span className="rn-arrow">→</span>
          </Link>
        ) : (
          <span className="rn-complete">🎉 You&apos;ve reached the last module</span>
        )}
      </div>
    </nav>
  );
}
