// Scans /content/module-N/ and derives the MODULES manifest from what's
// actually there — no more hand-maintained counts/status/summaries that can
// drift from (or be guessed ahead of) the real files.
//
// Run automatically via the "predev"/"prebuild" npm scripts, or manually:
//   node scripts/generate-modules.mjs
//
// Output: lib/modules-data.generated.json — imported by lib/modules.ts.
// This file is regenerated every run; don't hand-edit it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUT_FILE = path.join(ROOT, "lib", "modules-data.generated.json");

const SECTION_TYPES = ["notes", "cheatsheet", "practical", "applications"];

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : null;
}

// Pulls the module's one-line description straight from notes.html's own
// intro paragraph (<p class="ci-intro">...</p>) — no separate manual copy
// to keep in sync.
function extractDesc(notesHtml) {
  const m = notesHtml.match(/<p class="ci-intro">([\s\S]*?)<\/p>/);
  return m ? stripHtml(m[1]) : "";
}

// A real notes.html has at least 4 .section-c blocks (intro, checklist,
// topic(s), summary). The "coming soon" placeholder used for unstarted
// modules only has 2 (intro + status card) — that distinction is how we
// avoid counting an empty module as "complete" just because the file exists.
function isRealContent(html) {
  const matches = html.match(/class="section-c/g);
  return (matches?.length ?? 0) >= 3;
}

// Counts exercises + pulls each title directly from the "تمرین N — Title"
// headings already present in exercises.html.
function extractExercises(exercisesHtml) {
  const titleRe = /<h3[^>]*>\s*تمرین\s*\d+\s*(?:—|-)\s*([^<]+)<\/h3>/g;
  const titles = [];
  let match;
  while ((match = titleRe.exec(exercisesHtml)) !== null) {
    titles.push(stripHtml(match[1]));
  }
  return { count: titles.length, titles };
}

// Pulls the project's description from the first <p> in its section-h block
// (right after the <h2>), same pattern used across every module.
function extractProjectSummary(projectHtml) {
  const m = projectHtml.match(/<div class="section-h">[\s\S]*?<h2[^>]*>[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/);
  return m ? stripHtml(m[1]) : "";
}

function buildModule(id) {
  const dir = path.join(CONTENT_DIR, id);
  const n = parseInt(id.replace("module-", ""), 10);

  const notesHtml = readIfExists(path.join(dir, "notes.html"));
  const hasRealNotes = notesHtml ? isRealContent(notesHtml) : false;
  const status = hasRealNotes ? "complete" : "placeholder";
  const desc = hasRealNotes ? extractDesc(notesHtml) : "";

  const sections = SECTION_TYPES.map((type) => {
    const relFile = `${id}/${type}.html`;
    if (type === "notes") {
      return hasRealNotes ? { type, file: relFile } : { type, placeholder: true };
    }
    const exists = fs.existsSync(path.join(CONTENT_DIR, relFile));
    return exists ? { type, file: relFile } : { type, placeholder: true };
  });

  let exercises;
  const exercisesHtml = readIfExists(path.join(dir, "exercises.html"));
  if (exercisesHtml) {
    const { count, titles } = extractExercises(exercisesHtml);
    exercises = { file: `${id}/exercises.html`, count, titles };
  }

  let project;
  const projectHtml = readIfExists(path.join(dir, "project.html"));
  if (projectHtml) {
    project = { file: `${id}/project.html`, summary: extractProjectSummary(projectHtml) };
  }

  return {
    id,
    label: `Module ${n}`,
    status,
    desc,
    sections,
    ...(exercises ? { exercises } : {}),
    ...(project ? { project } : {}),
  };
}

const TOTAL_MODULES = 9; // fixed curriculum size — modules without a content/ folder yet still show as "coming soon"

function discoverModuleIds() {
  return Array.from({ length: TOTAL_MODULES }, (_, i) => `module-${i + 1}`);
}

const ids = discoverModuleIds();
const modules = ids.map(buildModule);

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify(modules, null, 2) + "\n");

const completeCount = modules.filter((m) => m.status === "complete").length;
const exerciseTotal = modules.reduce((sum, m) => sum + (m.exercises?.count ?? 0), 0);
console.log(
  `[generate-modules] ${modules.length} modules found, ${completeCount} complete, ${exerciseTotal} exercises total → lib/modules-data.generated.json`
);
