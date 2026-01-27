import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  course: router({
    // Get all modules
    getModules: publicProcedure.query(async () => {
      return await db.getAllModules();
    }),

    // Get module by ID
    getModule: publicProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getModuleById(input.moduleId);
      }),

    // Get lessons for a module
    getLessons: publicProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonsByModuleId(input.moduleId);
      }),

    // Get lesson by ID
    getLesson: publicProcedure
      .input(z.object({ lessonId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLessonById(input.lessonId);
      }),

    // Get quiz questions for a module
    getQuizQuestions: publicProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getQuizQuestionsByModuleId(input.moduleId);
      }),
  }),

  progress: router({
    // Get user's overall progress
    getUserProgress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllUserProgress(ctx.user.id);
    }),

    // Update lesson progress
    updateLessonProgress: protectedProcedure
      .input(z.object({
        lessonId: z.number(),
        completed: z.boolean().optional(),
        timeSpentMinutes: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertLessonProgress(ctx.user.id, input.lessonId, {
          completed: input.completed,
          timeSpentMinutes: input.timeSpentMinutes,
          completedAt: input.completed ? new Date() : undefined,
        });
        return { success: true };
      }),

    // Update module progress
    updateModuleProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        completed: z.boolean().optional(),
        completionPercentage: z.number().optional(),
        timeSpentMinutes: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.upsertModuleProgress(ctx.user.id, input.moduleId, {
          completed: input.completed,
          completionPercentage: input.completionPercentage,
          timeSpentMinutes: input.timeSpentMinutes,
          completedAt: input.completed ? new Date() : undefined,
        });
        return { success: true };
      }),
  }),

  quiz: router({
    // Submit quiz attempt
    submitQuiz: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        answers: z.array(z.object({
          questionId: z.number(),
          selectedOptionId: z.string(),
          correct: z.boolean(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const score = input.answers.filter(a => a.correct).length;
        const totalQuestions = input.answers.length;
        
        await db.saveQuizAttempt(
          ctx.user.id,
          input.moduleId,
          score,
          totalQuestions,
          input.answers
        );
        
        return { score, totalQuestions, percentage: Math.round((score / totalQuestions) * 100) };
      }),

    // Get user's quiz attempts
    getUserAttempts: protectedProcedure
      .input(z.object({ moduleId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserQuizAttempts(ctx.user.id, input.moduleId);
      }),
  }),

  certificate: router({
    // Get user's certificates
    getUserCertificates: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserCertificates(ctx.user.id);
    }),

    // Issue certificate (will be called after generating PDF)
    issueCertificate: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        certificateUrl: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveCertificate(ctx.user.id, input.moduleId, input.certificateUrl);
        return { success: true };
      }),
  }),

  project: router({
    // Submit graduation project
    submitProject: protectedProcedure
      .input(z.object({
        reportFileUrl: z.string(),
        reportFileName: z.string(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.saveProjectSubmission(
          ctx.user.id,
          input.reportFileUrl,
          input.reportFileName,
          input.notes
        );
        return { success: true };
      }),

    // Get user's project submissions
    getUserSubmissions: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProjectSubmissions(ctx.user.id);
    }),
  }),
});

export type AppRouter = typeof appRouter;
