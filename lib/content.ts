import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Reads a section's raw HTML fragment from /content at request/build time.
 * This replaces the old fetch(section.file) + contentCache logic from
 * content-loader.js — Next.js server components read the file directly,
 * so there's no client-side loading state or file:// CORS issue anymore.
 */
export async function readSectionHtml(relativeFile: string): Promise<string | null> {
  try {
    const fullPath = path.join(CONTENT_ROOT, relativeFile);
    return await fs.readFile(fullPath, "utf-8");
  } catch {
    return null; // file missing — caller falls back to a "coming soon" state
  }
}

/** Coming-soon card — direct port of placeholderSectionHtml() from content-loader.js */
export function placeholderSectionHtml(
  moduleId: string,
  sectionType: string,
  labelFa: string,
  desc: string
): string {
  return `<div class="section-c coming-soon" data-section-id="${moduleId}-${sectionType}">
    <div class="rich-card" style="max-width:360px">
      <div class="head">
        <div class="icon" style="color:var(--text-secondary)">⏳</div>
        <div class="info"><div class="title">${labelFa}</div><div class="path">Coming Soon</div></div>
      </div>
      <div class="body">${desc} — این بخش هنوز نوشته نشده؛ به‌زودی تکمیل می‌شود.</div>
      <div class="foot"><span class="tag">به‌زودی</span></div>
    </div>
  </div>`;
}
