import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const curriculum = readFileSync(
  resolve(projectRoot, "content/oilfield-security-safety-course-company-ready.md"),
  "utf8",
);
const seedScript = readFileSync(resolve(projectRoot, "scripts/seed-hsse-course.mjs"), "utf8");

function countMatches(value: string, pattern: RegExp) {
  return [...value.matchAll(pattern)].length;
}

describe("HSSE independent course", () => {
  it("contains the approved 18 modules and 91 lessons", () => {
    expect(countMatches(curriculum, /^# الوحدة /gm)).toBe(18);
    expect(countMatches(curriculum, /^\|\s*\d+\.\d+\s*\|/gm)).toBe(91);
  });

  it("seeds exactly ten module questions and one hundred final-exam questions", () => {
    expect(seedScript).toContain("Array.from({ length: 10 }");
    expect(seedScript).toContain("Array.from({ length: 100 }");
    expect(seedScript).toContain("const COURSE_ID = 3");
    expect(seedScript).toContain("MODULE_ID_BASE = 40000");
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
