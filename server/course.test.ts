import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("course.getModules", () => {
  it("returns all modules from the database", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const modules = await caller.course.getModules();

    expect(modules).toBeDefined();
    expect(Array.isArray(modules)).toBe(true);
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]).toHaveProperty("id");
    expect(modules[0]).toHaveProperty("titleAr");
    expect(modules[0]).toHaveProperty("moduleNumber");
  });
});

describe("course.getModule", () => {
  it("returns a specific module by ID", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const module = await caller.course.getModule({ moduleId: 1 });

    expect(module).toBeDefined();
    expect(module?.id).toBe(1);
    expect(module).toHaveProperty("titleAr");
    expect(module).toHaveProperty("descriptionAr");
  });

  it("returns undefined for non-existent module", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const module = await caller.course.getModule({ moduleId: 9999 });

    expect(module).toBeUndefined();
  });
});

describe("course.getLessons", () => {
  it("returns lessons for a specific module", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const lessons = await caller.course.getLessons({ moduleId: 1 });

    expect(lessons).toBeDefined();
    expect(Array.isArray(lessons)).toBe(true);
    if (lessons.length > 0) {
      expect(lessons[0]).toHaveProperty("id");
      expect(lessons[0]).toHaveProperty("titleAr");
      expect(lessons[0]).toHaveProperty("lessonNumber");
      expect(lessons[0].moduleId).toBe(1);
    }
  });
});

describe("course.getLesson", () => {
  it("returns a specific lesson by ID", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const lesson = await caller.course.getLesson({ lessonId: 1 });

    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe(1);
    expect(lesson).toHaveProperty("titleAr");
    expect(lesson).toHaveProperty("contentMarkdown");
  });
});

describe("course.getQuizQuestions", () => {
  it("returns quiz questions for a module", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const questions = await caller.course.getQuizQuestions({ moduleId: 1 });

    expect(questions).toBeDefined();
    expect(Array.isArray(questions)).toBe(true);
    if (questions.length > 0) {
      expect(questions[0]).toHaveProperty("id");
      expect(questions[0]).toHaveProperty("questionTextAr");
      expect(questions[0]).toHaveProperty("optionsJson");
      expect(questions[0]).toHaveProperty("correctOptionId");
    }
  });
});
