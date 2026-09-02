import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const resultsPath = "/home/ubuntu/rewrite_hsse_lesson_profiles.json";
const outputDirectory = resolve(projectRoot, "content/hsse-lesson-profiles");
const combinedPath = resolve(projectRoot, "content/hsse-lesson-profiles.json");
const requiredFields = [
  "moduleNumber",
  "lessonNumber",
  "titleAr",
  "outcome",
  "overview",
  "keyTerms",
  "hazards",
  "controls",
  "verificationEvidence",
  "fieldScenario",
  "decisionSteps",
  "practicalActivity",
  "comparisonTable",
  "knowledgeCheck",
  "takeaway",
];

function assertProfile(profile, moduleNumber) {
  for (const field of requiredFields) {
    if (!(field in profile)) throw new Error(`Module ${moduleNumber}: missing ${field}`);
  }
  if (profile.moduleNumber !== moduleNumber) {
    throw new Error(`Module ${moduleNumber}: mismatched module number ${profile.moduleNumber}`);
  }
  if (!Array.isArray(profile.hazards) || profile.hazards.length < 3) {
    throw new Error(`Module ${moduleNumber}, lesson ${profile.lessonNumber}: invalid hazards`);
  }
  if (!Array.isArray(profile.controls) || profile.controls.length < 4) {
    throw new Error(`Module ${moduleNumber}, lesson ${profile.lessonNumber}: invalid controls`);
  }
  if (!Array.isArray(profile.comparisonTable) || profile.comparisonTable.length < 3) {
    throw new Error(`Module ${moduleNumber}, lesson ${profile.lessonNumber}: invalid comparison table`);
  }
}

await mkdir(outputDirectory, { recursive: true });
const results = JSON.parse(await readFile(resultsPath, "utf8")).results;
const combined = [];

for (const result of results) {
  const moduleNumber = Number(result.output.module_number);
  const response = await fetch(result.output.profiles_file);
  if (!response.ok) throw new Error(`Module ${moduleNumber}: download failed ${response.status}`);
  const text = await response.text();
  const parsed = JSON.parse(text);
  const profiles = Array.isArray(parsed)
    ? parsed
    : parsed.profiles ?? parsed.lessons ?? Object.values(parsed).find((value) => Array.isArray(value));
  if (!Array.isArray(profiles)) throw new Error(`Module ${moduleNumber}: expected an array`);
  if (profiles.length !== Number(result.output.lesson_count)) {
    throw new Error(`Module ${moduleNumber}: expected ${result.output.lesson_count} lessons, got ${profiles.length}`);
  }
  profiles.forEach((profile) => assertProfile(profile, moduleNumber));
  profiles.sort((a, b) => a.lessonNumber - b.lessonNumber);
  await writeFile(
    resolve(outputDirectory, `module-${String(moduleNumber).padStart(2, "0")}.json`),
    `${JSON.stringify(profiles, null, 2)}\n`,
    "utf8",
  );
  combined.push(...profiles);
}

combined.sort((a, b) => a.moduleNumber - b.moduleNumber || a.lessonNumber - b.lessonNumber);
if (combined.length !== 91) throw new Error(`Expected 91 profiles, got ${combined.length}`);
const uniqueKeys = new Set(combined.map((profile) => `${profile.moduleNumber}.${profile.lessonNumber}`));
if (uniqueKeys.size !== 91) throw new Error(`Expected 91 unique lesson keys, got ${uniqueKeys.size}`);
await writeFile(combinedPath, `${JSON.stringify(combined, null, 2)}\n`, "utf8");
console.log(`Collected ${combined.length} distinct HSSE lesson profiles into ${combinedPath}`);
