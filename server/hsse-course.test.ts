import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const curriculum = readFileSync(
  resolve(projectRoot, "content/oilfield-security-safety-course-company-ready.md"),
  "utf8",
);
const seedScript = readFileSync(resolve(projectRoot, "scripts/seed-hsse-course.mjs"), "utf8");
const lessonProfiles = JSON.parse(
  readFileSync(resolve(projectRoot, "content/hsse-lesson-profiles.json"), "utf8"),
) as Array<{
  moduleNumber: number;
  lessonNumber: number;
  titleAr: string;
  overview: string;
  fieldScenario: string;
  practicalActivity: string;
  takeaway: string;
}>;

function countMatches(value: string, pattern: RegExp) {
  return [...value.matchAll(pattern)].length;
}

function normalizedTokens(value: string) {
  return new Set(
    value
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function jaccardSimilarity(left: string, right: string) {
  const leftTokens = normalizedTokens(left);
  const rightTokens = normalizedTokens(right);
  let intersection = 0;
  for (const token of leftTokens) if (rightTokens.has(token)) intersection += 1;
  return intersection / (leftTokens.size + rightTokens.size - intersection);
}

describe("HSSE independent course", () => {
  it("contains the approved 18 modules and 91 lessons", () => {
    expect(countMatches(curriculum, /^# الوحدة /gm)).toBe(18);
    expect(countMatches(curriculum, /^\|\s*\d+\.\d+\s*\|/gm)).toBe(91);
  });

  it("keeps all 91 lesson profiles distinct and avoids high-similarity lesson bodies", () => {
    expect(lessonProfiles).toHaveLength(91);
    expect(new Set(lessonProfiles.map((profile) => `${profile.moduleNumber}.${profile.lessonNumber}`)).size).toBe(91);
    expect(new Set(lessonProfiles.map((profile) => profile.titleAr)).size).toBe(91);
    expect(new Set(lessonProfiles.map((profile) => profile.overview)).size).toBe(91);
    expect(new Set(lessonProfiles.map((profile) => profile.fieldScenario)).size).toBe(91);
    expect(new Set(lessonProfiles.map((profile) => profile.practicalActivity)).size).toBe(91);
    expect(new Set(lessonProfiles.map((profile) => profile.takeaway)).size).toBe(91);

    const highlySimilarPairs: string[] = [];
    for (let index = 0; index < lessonProfiles.length; index += 1) {
      for (let next = index + 1; next < lessonProfiles.length; next += 1) {
        const left = lessonProfiles[index];
        const right = lessonProfiles[next];
        const leftBody = `${left.overview} ${left.fieldScenario} ${left.practicalActivity} ${left.takeaway}`;
        const rightBody = `${right.overview} ${right.fieldScenario} ${right.practicalActivity} ${right.takeaway}`;
        if (jaccardSimilarity(leftBody, rightBody) >= 0.72) {
          highlySimilarPairs.push(`${left.moduleNumber}.${left.lessonNumber}-${right.moduleNumber}.${right.lessonNumber}`);
        }
      }
    }
    expect(highlySimilarPairs).toEqual([]);
  });

  it("seeds exactly ten module questions and one hundred final-exam questions", () => {
    expect(seedScript).toContain("Array.from({ length: 10 }");
    expect(seedScript).toContain("Array.from({ length: 100 }");
    expect(seedScript).toContain("const COURSE_ID = 3");
    expect(seedScript).toContain("MODULE_ID_BASE = 40000");
  });

  it("wires every HSSE module and lesson to verified visual assets", () => {
    expect(countMatches(seedScript, /verifiedVisuals\./g)).toBeGreaterThanOrEqual(18);
    expect(seedScript).toContain("lessonMarkdown(module, lesson)");
    expect(seedScript).toContain("imageUrl: moduleImageUrls[index]");
    expect(seedScript).toContain("module.imageUrl]");
    expect(seedScript).toContain("image_url) VALUES");
    const storageProxy = readFileSync(resolve(projectRoot, "server/_core/storageProxy.ts"), "utf8");
    const serverIndex = readFileSync(resolve(projectRoot, "server/_core/index.ts"), "utf8");
    expect(storageProxy).toContain('app.get("/manus-storage/*"');
    expect(serverIndex).toContain("registerStorageProxy(app)");
  });

  it("keeps the HSSE course reachable from all course-level UI surfaces", () => {
    const coursesPage = readFileSync(resolve(projectRoot, "client/src/pages/Courses.tsx"), "utf8");
    const homePage = readFileSync(resolve(projectRoot, "client/src/pages/Home.tsx"), "utf8");
    const modulesPage = readFileSync(resolve(projectRoot, "client/src/pages/Modules.tsx"), "utf8");
    const examPage = readFileSync(resolve(projectRoot, "client/src/pages/CourseExam.tsx"), "utf8");
    const courseCertificatePage = readFileSync(resolve(projectRoot, "client/src/pages/CourseCertificate.tsx"), "utf8");
    const moduleCertificatePage = readFileSync(resolve(projectRoot, "client/src/pages/Certificate.tsx"), "utf8");
    const verificationPage = readFileSync(resolve(projectRoot, "client/src/pages/CertificateVerify.tsx"), "utf8");
    const databaseHelpers = readFileSync(resolve(projectRoot, "server/db.ts"), "utf8");
    const router = readFileSync(resolve(projectRoot, "server/routers.ts"), "utf8");
    const loginPage = readFileSync(resolve(projectRoot, "client/src/pages/Login.tsx"), "utf8");
    const registerPage = readFileSync(resolve(projectRoot, "client/src/pages/Register.tsx"), "utf8");

    expect(coursesPage).toContain('id: 3');
    expect(homePage).toContain('id: 3');
    expect(modulesPage).toContain('3: { titleAr: "الأمن والسلامة في الحقول النفطية"');
    expect(examPage).toContain('3: "الأمن والسلامة في الحقول النفطية (Oilfield HSSE)"');
    expect(courseCertificatePage).toContain('3: { ar: "الأمن والسلامة في الحقول النفطية"');
    expect(moduleCertificatePage).toContain("Oilfield HSSE and Security Fundamentals");
    expect(verificationPage).toContain("الأمن والسلامة في الحقول النفطية (Oilfield HSSE)");
    expect(verificationPage).toContain('data.certificateType === "course"');
    expect(homePage).toContain("trpc.course.getPlatformStats.useQuery");
    expect(databaseHelpers).toContain("export async function getPlatformStats");
    expect(router).toContain("getPlatformStats: publicProcedure");
    expect(databaseHelpers).toContain("const { courseCertificates } = await import(\"../drizzle/schema\")");
    expect(databaseHelpers).toContain("certificateType: sql<string>`'course'`");
    expect(modulesPage).toContain('setLocation("/login")');
    expect(loginPage).toContain("Oilfield HSSE");
    expect(registerPage).toContain("Oilfield HSSE");
  });
});
