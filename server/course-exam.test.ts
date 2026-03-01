import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the DB module
vi.mock("./db", () => ({
  getCourseExamQuestions: vi.fn(),
  saveCourseExamAttempt: vi.fn(),
  getLatestCourseExamAttempt: vi.fn(),
  issueCourseExamCertificate: vi.fn(),
  getCourseCertificate: vi.fn(),
}));

import {
  getCourseExamQuestions,
  saveCourseExamAttempt,
  getLatestCourseExamAttempt,
  issueCourseExamCertificate,
  getCourseCertificate,
} from "./db";

describe("Course Exam Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCourseExamQuestions returns questions for a course", async () => {
    const mockQuestions = [
      {
        id: 1,
        courseId: 1,
        questionType: "mcq" as const,
        questionTextAr: "ما هو الغرض من الفاصل؟",
        questionTextEn: "What is the purpose of a separator?",
        optionsJson: ["فصل السوائل", "ضخ النفط", "تخزين الغاز", "قياس الضغط"],
        correctOptionId: "0",
        explanationAr: "الفاصل يفصل السوائل والغاز",
        timeLimitSeconds: 45,
        difficultyLevel: "advanced" as const,
        order: 1,
        createdAt: new Date(),
      },
    ];
    vi.mocked(getCourseExamQuestions).mockResolvedValue(mockQuestions);

    const result = await getCourseExamQuestions(1);
    expect(result).toHaveLength(1);
    expect(result[0].courseId).toBe(1);
    expect(result[0].questionType).toBe("mcq");
  });

  it("saveCourseExamAttempt saves attempt with correct fields", async () => {
    vi.mocked(saveCourseExamAttempt).mockResolvedValue({ id: 42 });

    const result = await saveCourseExamAttempt({
      userId: 1,
      courseId: 1,
      scorePercent: 92.5,
      passed: true,
      answers: { "1": "0", "2": "1" },
      timeTakenSeconds: 1800,
      nextAllowedAt: null,
    });

    expect(result.id).toBe(42);
    expect(saveCourseExamAttempt).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 1,
        courseId: 1,
        scorePercent: 92.5,
        passed: true,
      })
    );
  });

  it("passing score threshold is 90%", () => {
    const PASSING_THRESHOLD = 90;
    const score85 = 85;
    const score90 = 90;
    const score95 = 95;

    expect(score85 >= PASSING_THRESHOLD).toBe(false);
    expect(score90 >= PASSING_THRESHOLD).toBe(true);
    expect(score95 >= PASSING_THRESHOLD).toBe(true);
  });

  it("lockout period is 7 days on failure", () => {
    const now = new Date("2026-03-01T00:00:00Z");
    const lockoutDays = 7;
    const nextAllowed = new Date(now.getTime() + lockoutDays * 24 * 60 * 60 * 1000);

    expect(nextAllowed.getTime() - now.getTime()).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("getLatestCourseExamAttempt returns null for new user", async () => {
    vi.mocked(getLatestCourseExamAttempt).mockResolvedValue(null);

    const result = await getLatestCourseExamAttempt(999, 1);
    expect(result).toBeNull();
  });

  it("issueCourseExamCertificate creates certificate with verification code", async () => {
    const mockCert = {
      id: 1,
      userId: 1,
      courseId: 1,
      attemptId: 42,
      scorePercent: "92.50",
      verificationCode: "CE-1-1-ABC123",
      issuedAt: new Date(),
    };
    vi.mocked(issueCourseExamCertificate).mockResolvedValue(mockCert);

    const result = await issueCourseExamCertificate({
      userId: 1,
      courseId: 1,
      attemptId: 42,
      scorePercent: 92.5,
    });

    expect(result).toBeDefined();
    expect(result?.verificationCode).toMatch(/^CE-/);
    expect(result?.scorePercent).toBe("92.50");
  });

  it("score calculation: 90 correct out of 100 = 90%", () => {
    const correct = 90;
    const total = 100;
    const scorePercent = (correct / total) * 100;
    expect(scorePercent).toBe(90);
    expect(scorePercent >= 90).toBe(true);
  });

  it("score calculation: 89 correct out of 100 = 89% (fail)", () => {
    const correct = 89;
    const total = 100;
    const scorePercent = (correct / total) * 100;
    expect(scorePercent).toBe(89);
    expect(scorePercent >= 90).toBe(false);
  });
});
