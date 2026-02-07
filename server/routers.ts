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

    // Generate and issue certificate
    generateCertificate: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const PDFDocument = (await import('pdfkit')).default;
        const { storagePut } = await import('./storage');
        
        // Get module info
        const module = await db.getModuleById(input.moduleId);
        if (!module) throw new Error('Module not found');
        
        // Get quiz score
        const quizAttempts = await db.getUserQuizAttempts(ctx.user.id, input.moduleId);
        const latestAttempt = quizAttempts[0];
        
        // Create PDF
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 50,
        });
        
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        
        await new Promise<void>((resolve, reject) => {
          doc.on('end', () => resolve());
          doc.on('error', reject);
          
          const pageWidth = doc.page.width;
          const pageHeight = doc.page.height;
          
          // Background color
          doc.rect(0, 0, pageWidth, pageHeight).fill('#f0f8ff');
          
          // Border
          doc.rect(20, 20, pageWidth - 40, pageHeight - 40)
             .lineWidth(3)
             .stroke('#228B22');
          
          // Title
          doc.fontSize(40)
             .fillColor('#228B22')
             .text('Certificate of Completion', 0, 80, { align: 'center' });
          
          // Subtitle
          doc.fontSize(16)
             .fillColor('#666666')
             .text('This certifies that', 0, 140, { align: 'center' });
          
          // User name
          doc.fontSize(32)
             .fillColor('#000000')
             .text(ctx.user.name || 'Student', 0, 170, { align: 'center' });
          
          // Description
          doc.fontSize(16)
             .fillColor('#666666')
             .text('has successfully completed', 0, 220, { align: 'center' });
          
          // Module name
          doc.fontSize(24)
             .fillColor('#228B22')
             .text(module.titleEn || module.titleAr, 0, 250, { align: 'center' });
          
          // Course name
          doc.fontSize(18)
             .fillColor('#000000')
             .text('Early Production Facilities (EPF) Course', 0, 290, { align: 'center' });
          
          // Date
          doc.fontSize(14)
             .fillColor('#666666');
          const completionDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          doc.text(`Date of Completion: ${completionDate}`, 0, 330, { align: 'center' });
          
          // Score
          if (latestAttempt) {
            const score = Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100);
            doc.text(`Quiz Score: ${score}%`, 0, 350, { align: 'center' });
          }
          
          // Footer
          doc.fontSize(12)
             .fillColor('#999999')
             .text('ALMOG Oil Services Company', 0, pageHeight - 80, { align: 'center' });
          
          doc.end();
        });
        
        const pdfBuffer = Buffer.concat(chunks);
        
        // Upload to S3
        const fileName = `certificates/${ctx.user.id}/module-${input.moduleId}-${Date.now()}.pdf`;
        const { url } = await storagePut(fileName, pdfBuffer, 'application/pdf');
        
        // Save to database
        await db.saveCertificate(ctx.user.id, input.moduleId, url);
        
        return { success: true, certificateUrl: url };
      }),

    // Download certificate (proxy to avoid CORS issues)
    downloadCertificate: protectedProcedure
      .input(z.object({
        certificateId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        const certificates = await db.getUserCertificates(ctx.user.id);
        const certificate = certificates.find(c => c.id === input.certificateId);
        
        if (!certificate) {
          throw new Error('Certificate not found');
        }

        // Fetch from S3
        const response = await fetch(certificate.certificateUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch certificate');
        }

        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        
        return { 
          success: true, 
          pdfBase64: base64,
          filename: `EPF_Certificate_Module_${certificate.moduleId}.pdf`
        };
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
