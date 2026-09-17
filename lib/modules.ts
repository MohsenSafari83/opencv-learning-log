// Reads the manifest that scripts/generate-modules.mjs derives from the
// real files in /content — this file itself is never hand-edited for
// status/counts/summaries anymore. It only defines types + small lookup
// helpers on top of the generated data.
//
// If lib/modules-data.generated.json is missing, run:
//   node scripts/generate-modules.mjs
// (this happens automatically via the "predev"/"prebuild" npm scripts)

import generated from "./modules-data.generated.json";

export type SectionType =
  | "notes"
  | "cheatsheet"
  | "practical"
  | "applications";

export interface ModuleSection {
  type: SectionType;
  file?: string; // relative to /content — present when real content exists
  placeholder?: true; // renders the "coming soon" card instead of fetching
}

export interface ModuleMeta {
  id: string;
  label: string;
  status: "complete" | "placeholder";
  desc: string;
  exercises?: { file: string; count: number; titles: string[] };
  project?: { file: string; summary: string };
  // Only file + count here — the actual questions/answers are read
  // on-demand by the quiz page (lib/content.ts::readQuizJson), not
  // embedded in this manifest.
  quiz?: { file: string; count: number };
  sections: ModuleSection[];
}

export const MODULES: ModuleMeta[] = generated as ModuleMeta[];

// Shape of a single question inside a module's quiz.json — used by
// readQuizJson() and the QuizRunner component.
export interface QuizQuestion {
  question: string;
  options: string[]; // always 4
  correct: number; // index into options, 0-3
  explanation?: string;
}

export interface SectionTypeMeta {
  type: SectionType | "exercises" | "project" | "quiz";
  label: string;
  labelFa: string;
  desc: string;
}

export const SECTION_TYPES: SectionTypeMeta[] = [
  { type: "notes", label: "Learning", labelFa: "آموزش", desc: "نوت‌ها و توضیح کامل مباحث ماژول" },
  { type: "exercises", label: "Exercises", labelFa: "تمرین‌ها", desc: "تمرین‌های عملی — هدف، ورودی/خروجی و راه‌حل" },
  { type: "cheatsheet", label: "Cheat Sheet", labelFa: "برگه‌ی تقلب", desc: "مرجع سریع توابع، سینتکس، الگوها و اشتباهات رایج" },
  { type: "practical", label: "Practical Notes", labelFa: "یادداشت‌های عملی", desc: "نکات عملی که در یادگیری معمولی گفته نمی‌شوند" },
  { type: "applications", label: "Applications", labelFa: "کاربردها", desc: "جایگاه مبحث این ماژول در دنیای واقعی" },
  { type: "project", label: "Project", labelFa: "پروژه", desc: "پروژه‌ی واقعی این ماژول" },
  { type: "quiz", label: "Quiz", labelFa: "آزمون", desc: "تست ۴ گزینه‌ای برای سنجش یادگیری این ماژول" },
];

export function sectionTypeMeta(type: string): SectionTypeMeta | undefined {
  return SECTION_TYPES.find((s) => s.type === type);
}

export function getModule(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getSection(
  moduleId: string,
  sectionType: string
): ModuleSection | undefined {
  const mod = getModule(moduleId);
  return mod?.sections.find((s) => s.type === sectionType);
}
