import { describe, expect, it } from "vitest";
import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { vi } from "vitest";
import { appRouter } from "./routers";
import { issueCourseExamCertificate, saveCourseExamAttempt, verifyCertificate } from "./db";
import { sdk } from "./_core/sdk";
import { createContext } from "./_core/context";
import { COOKIE_NAME } from "@shared/const";

const databaseUrl = process.env.DATABASE_URL;

describe("HSSE seeded database integrity", () => {
  it.skipIf(!databaseUrl)("contains the complete independent course dataset", async () => {
    const connection = await mysql.createConnection(databaseUrl!);
    try {
      const [moduleRows] = await connection.query<Array<{ count: string }>>(
        "SELECT COUNT(*) AS count FROM modules WHERE course_id = 3",
      );
      const [lessonRows] = await connection.query<Array<{ count: string }>>(
        "SELECT COUNT(*) AS count FROM lessons l INNER JOIN modules m ON m.id = l.module_id WHERE m.course_id = 3",
      );
      const [quizRows] = await connection.query<Array<{ count: string }>>(
        "SELECT COUNT(*) AS count FROM quiz_questions q INNER JOIN modules m ON m.id = q.module_id WHERE m.course_id = 3",
      );
      const [examRows] = await connection.query<Array<{ count: string }>>(
        "SELECT COUNT(*) AS count FROM course_exam_questions WHERE course_id = 3",
      );

      expect(Number(moduleRows[0].count)).toBe(18);
      expect(Number(lessonRows[0].count)).toBe(91);
      expect(Number(quizRows[0].count)).toBe(180);
      expect(Number(examRows[0].count)).toBe(100);

      const [quizDistribution] = await connection.query<Array<{ module_id: number; count: string }>>(
        "SELECT q.module_id, COUNT(*) AS count FROM quiz_questions q INNER JOIN modules m ON m.id = q.module_id WHERE m.course_id = 3 GROUP BY q.module_id ORDER BY q.module_id",
      );
      expect(quizDistribution).toHaveLength(18);
      expect(quizDistribution.every((row) => Number(row.count) === 10)).toBe(true);

      const [lessonContentRows] = await connection.query<Array<{ distinct_content: string }>>(
        "SELECT COUNT(DISTINCT l.content_markdown) AS distinct_content FROM lessons l INNER JOIN modules m ON m.id = l.module_id WHERE m.course_id = 3",
      );
      expect(Number(lessonContentRows[0].distinct_content)).toBe(91);

      const [examTypeRows] = await connection.query<Array<{ question_type: string; count: string }>>(
        "SELECT question_type, COUNT(*) AS count FROM course_exam_questions WHERE course_id = 3 GROUP BY question_type",
      );
      expect(examTypeRows.some((row) => row.question_type === "mcq")).toBe(true);
      expect(examTypeRows.some((row) => row.question_type === "true_false")).toBe(true);
    } finally {
      await connection.end();
    }
  });
});


describe("HSSE real access and certificate flows", () => {
  it.skipIf(!databaseUrl)("issues and publicly verifies a real HSSE course certificate", async () => {
    const connection = await mysql.createConnection(databaseUrl!);
    const openId = `integration_hsse_${randomUUID()}`;
    let userId = 0;

    try {
      const [insertResult] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO users (openId, name, email, phone, password_hash, profile_completed, loginMethod, role, account_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [openId, "HSSE Integration Trainee", `${openId}@example.invalid`, `090${Date.now().toString().slice(-8)}`, null, 1, "local", "user", "approved"],
      );
      userId = Number(insertResult.insertId);

      const attempt = await saveCourseExamAttempt({
        userId,
        courseId: 3,
        scorePercent: 95,
        passed: true,
        answers: { integration: "passed" },
        timeTakenSeconds: 120,
        nextAllowedAt: null,
      });
      const certificate = await issueCourseExamCertificate({
        userId,
        courseId: 3,
        attemptId: attempt.id,
        scorePercent: 95,
      });

      expect(certificate?.verificationCode).toBeTruthy();
      const directResult = await verifyCertificate(certificate!.verificationCode);
      expect(directResult).toMatchObject({
        certificateType: "course",
        courseId: 3,
        userName: "HSSE Integration Trainee",
        scorePercent: "95.00",
      });

      const publicCaller = appRouter.createCaller({
        req: { headers: {} } as any,
        res: { cookie: vi.fn(), clearCookie: vi.fn() } as any,
        user: null,
      } as any);
      const publicResult = await publicCaller.certificates.verify({ code: certificate!.verificationCode });
      expect(publicResult).toMatchObject({
        certificateType: "course",
        courseId: 3,
        userName: "HSSE Integration Trainee",
      });
    } finally {
      if (userId) {
        await connection.execute("DELETE FROM course_certificates WHERE user_id = ?", [userId]);
        await connection.execute("DELETE FROM course_exam_attempts WHERE user_id = ?", [userId]);
        await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
      }
      await connection.end();
    }
  });

  it.skipIf(!databaseUrl)("enforces anonymous, approved, pending, and paused access policies against real users", async () => {
    const connection = await mysql.createConnection(databaseUrl!);
    const openId = `integration_access_${randomUUID()}`;
    let userId = 0;

    try {
      const [insertResult] = await connection.execute<mysql.ResultSetHeader>(
        `INSERT INTO users (openId, name, email, phone, password_hash, profile_completed, loginMethod, role, account_status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [openId, "HSSE Access Integration Trainee", `${openId}@example.invalid`, `091${Date.now().toString().slice(-8)}`, null, 1, "local", "user", "approved"],
      );
      userId = Number(insertResult.insertId);

      await expect(sdk.authenticateRequest({ headers: { cookie: "" } } as any)).rejects.toThrow();

      for (const status of ["approved", "pending", "paused"] as const) {
        await connection.execute("UPDATE users SET account_status = ? WHERE id = ?", [status, userId]);
        const session = await sdk.signSession(
          { openId, appId: "local", name: "HSSE Access Integration Trainee" },
          { expiresInMs: 60_000 },
        );
        const request = { headers: { cookie: `${COOKIE_NAME}=${session}` } } as any;

        if (status === "approved") {
          const authenticated = await sdk.authenticateRequest(request);
          expect(authenticated).toMatchObject({ openId, accountStatus: "approved" });
        } else {
          await expect(sdk.authenticateRequest(request)).rejects.toThrow("Account is not approved");
        }

        const context = await createContext({
          req: { headers: { cookie: `${COOKIE_NAME}=${session}` } } as any,
          res: { cookie: vi.fn(), clearCookie: vi.fn() } as any,
        } as any);
        const caller = appRouter.createCaller(context);

        if (status === "approved") {
          const examQuestions = await caller.courseExam.getQuestions({ courseId: 3 });
          expect(examQuestions).toHaveLength(100);
          await expect(caller.courseExam.getCertificate({ courseId: 3 })).resolves.toBeNull();
        } else {
          await expect(caller.courseExam.getStatus({ courseId: 3 })).rejects.toThrow();
          await expect(caller.courseExam.getCertificate({ courseId: 3 })).rejects.toThrow();
        }
      }

      const anonymousContext = await createContext({
        req: { headers: { cookie: "" } } as any,
        res: { cookie: vi.fn(), clearCookie: vi.fn() } as any,
      } as any);
      const anonymousCaller = appRouter.createCaller(anonymousContext);
      await expect(anonymousCaller.courseExam.getQuestions({ courseId: 3 })).rejects.toThrow();
      await expect(anonymousCaller.courseExam.getCertificate({ courseId: 3 })).rejects.toThrow();
    } finally {
      if (userId) {
        await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
      }
      await connection.end();
    }
  });
});
