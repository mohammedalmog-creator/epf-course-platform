import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {} as any,
    res: {
      cookie: () => {},
      clearCookie: () => {},
    } as any,
  };
  return { ctx };
}

describe("Lesson content tests", () => {
  it("should retrieve lesson 60015 with valve content", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const lesson = await caller.course.getLesson({ lessonId: 60015 });
    
    expect(lesson).toBeDefined();
    expect(lesson?.titleAr).toContain("صمامات");
    expect(lesson?.contentMarkdown).toContain("Gate Valve");
    expect(lesson?.contentMarkdown).toContain("Ball Valve");
    expect(lesson?.contentMarkdown).toContain("Choke Valve");
    expect(lesson?.contentMarkdown).toContain("Check Valve");
    // Check that valve images are embedded in content
    expect(lesson?.contentMarkdown).toContain("valve-gate-valve");
    expect(lesson?.contentMarkdown).toContain("valve-ball-valve");
    expect(lesson?.contentMarkdown).toContain("valve-choke-valve");
    expect(lesson?.contentMarkdown).toContain("valve-check-valve");
  });

  it("should retrieve lesson 60023 with expanded content", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const lesson = await caller.course.getLesson({ lessonId: 60023 });
    
    expect(lesson).toBeDefined();
    expect(lesson?.contentMarkdown?.length).toBeGreaterThan(2000);
    expect(lesson?.contentMarkdown).toContain("Packing Leaks");
  });

  it("should retrieve lesson 60025 with case studies", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const lesson = await caller.course.getLesson({ lessonId: 60025 });
    
    expect(lesson).toBeDefined();
    expect(lesson?.contentMarkdown?.length).toBeGreaterThan(2000);
    expect(lesson?.contentMarkdown).toContain("دراسة الحالة");
  });

  it("should have 60 lessons total in the wellhead course", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    // Get modules for course 2 (Wellhead)
    const modules = await caller.course.getModules({ courseId: 2 });
    expect(modules.length).toBeGreaterThan(0);
    
    // Get lessons for first module
    const firstModule = modules[0];
    const lessons = await caller.course.getLessons({ moduleId: firstModule.id });
    expect(lessons.length).toBeGreaterThan(0);
  });
});
