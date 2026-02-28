import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
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
    // Get all modules (optionally filtered by courseId)
    getModules: publicProcedure
      .input(z.object({ courseId: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllModules(input?.courseId);
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
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Get module info
        const module = await db.getModuleById(input.moduleId);
        if (!module) throw new Error('Module not found');
        
        // Get quiz attempts and count
        const quizAttempts = await db.getUserQuizAttempts(ctx.user.id, input.moduleId);
        const latestAttempt = quizAttempts[0];
        const attemptCount = quizAttempts.length;
        const scorePercent = latestAttempt
          ? Math.round((latestAttempt.score / latestAttempt.totalQuestions) * 100)
          : 0;
        
        // Generate unique verification code
        const verificationCode = `ALM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        
        // Determine course name
        const courseName = (module as any).courseId === 2
          ? 'Oil & Gas Wellhead Maintenance — Onshore & Offshore'
          : 'Early Production Facilities (EPF) Course';
        
        // Create PDF
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'landscape',
          margin: 0,
        });
        
        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        
        await new Promise<void>((resolve, reject) => {
          doc.on('end', () => resolve());
          doc.on('error', reject);
          
          const W = doc.page.width;   // 841.89
          const H = doc.page.height;  // 595.28
          
          // ── Background ──────────────────────────────────────────────
          doc.rect(0, 0, W, H).fill('#FAFDF7');
          
          // ── Diagonal watermark pattern ───────────────────────────────
          doc.save();
          doc.opacity(0.04);
          for (let x = -H; x < W + H; x += 60) {
            doc.moveTo(x, 0).lineTo(x + H, H)
               .lineWidth(18).strokeColor('#1a6b3c').stroke();
          }
          doc.restore();
          
          // ── Outer border (double line) ───────────────────────────────
          doc.rect(14, 14, W - 28, H - 28).lineWidth(4).strokeColor('#1a6b3c').stroke();
          doc.rect(20, 20, W - 40, H - 40).lineWidth(1.5).strokeColor('#4caf7d').stroke();
          
          // ── Top gold bar ─────────────────────────────────────────────
          doc.rect(14, 14, W - 28, 8).fill('#c8a84b');
          doc.rect(14, H - 22, W - 28, 8).fill('#c8a84b');
          
          // ── Corner ornaments ─────────────────────────────────────────
          const corners = [[30, 30], [W - 30, 30], [30, H - 30], [W - 30, H - 30]];
          corners.forEach(([cx, cy]) => {
            doc.circle(cx, cy, 6).fill('#c8a84b');
            doc.circle(cx, cy, 10).lineWidth(1).strokeColor('#c8a84b').stroke();
          });
          
          // ── Logo (large, centered, prominent) ────────────────────────
          const logoPath = path.join(__dirname, 'almog-logo.png');
          if (fs.existsSync(logoPath)) {
            // Large logo: 180px wide, centered
            doc.image(logoPath, W / 2 - 90, 28, { width: 180, height: 90, fit: [180, 90] });
          }
          
          // ── Company name ─────────────────────────────────────────────
          doc.fontSize(10).fillColor('#1a6b3c')
             .text('ALMOG OIL SERVICES  |  شركة المُق للخدمات النفطية', 0, 122, { align: 'center', characterSpacing: 2 });
          
          // ── Divider line ─────────────────────────────────────────────
          doc.moveTo(W * 0.2, 138).lineTo(W * 0.8, 138)
             .lineWidth(1.5).strokeColor('#c8a84b').stroke();
          
          // ── Certificate title ─────────────────────────────────────────
          doc.fontSize(32).fillColor('#1a6b3c')
             .font('Helvetica-Bold')
             .text('CERTIFICATE OF COMPLETION', 0, 148, { align: 'center', characterSpacing: 1.5 });
          
          // ── Subtitle ─────────────────────────────────────────────────
          doc.fontSize(11).fillColor('#555555').font('Helvetica')
             .text('This is to certify that', 0, 178, { align: 'center' });
          
          // ── Recipient name ────────────────────────────────────────────
          doc.fontSize(28).fillColor('#1a1a1a').font('Helvetica-Bold')
             .text(ctx.user.name || 'Student', 0, 196, { align: 'center' });
          
          // ── Name underline ────────────────────────────────────────────
          const nameWidth = Math.min(doc.widthOfString(ctx.user.name || 'Student') + 40, 400);
          const nameX = (W - nameWidth) / 2;
          doc.moveTo(nameX, 232).lineTo(nameX + nameWidth, 232)
             .lineWidth(1.5).strokeColor('#1a6b3c').stroke();
          
          // ── Completion text ───────────────────────────────────────────
          doc.fontSize(11).fillColor('#555555').font('Helvetica')
             .text('has successfully completed the following module:', 0, 242, { align: 'center' });
          
          // ── Module name ───────────────────────────────────────────────
          doc.fontSize(16).fillColor('#1a6b3c').font('Helvetica-Bold')
             .text(module.titleEn || module.titleAr, 60, 262, { align: 'center', width: W - 120 });
          
          // ── Course name ───────────────────────────────────────────────
          doc.fontSize(10).fillColor('#777777').font('Helvetica')
             .text(courseName, 60, 288, { align: 'center', width: W - 120 });
          
          // ── Stats row ─────────────────────────────────────────────────
          const statsY = 318;
          const statW = 130;
          const gap = 30;
          const totalW = statW * 3 + gap * 2;
          const startX = (W - totalW) / 2;
          
          // Score box
          doc.roundedRect(startX, statsY, statW, 52, 6).fill('#e8f5ee');
          doc.fontSize(22).fillColor('#1a6b3c').font('Helvetica-Bold')
             .text(`${scorePercent}%`, startX, statsY + 6, { width: statW, align: 'center' });
          doc.fontSize(8).fillColor('#555').font('Helvetica')
             .text('QUIZ SCORE', startX, statsY + 34, { width: statW, align: 'center', characterSpacing: 1 });
          
          // Attempts box
          const attX = startX + statW + gap;
          doc.roundedRect(attX, statsY, statW, 52, 6).fill('#fff8e7');
          doc.fontSize(22).fillColor('#c8a84b').font('Helvetica-Bold')
             .text(`${attemptCount}`, attX, statsY + 6, { width: statW, align: 'center' });
          doc.fontSize(8).fillColor('#555').font('Helvetica')
             .text(attemptCount === 1 ? 'ATTEMPT' : 'ATTEMPTS', attX, statsY + 34, { width: statW, align: 'center', characterSpacing: 1 });
          
          // Date box
          const dateX = attX + statW + gap;
          const completionDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
          doc.roundedRect(dateX, statsY, statW, 52, 6).fill('#e8f5ee');
          doc.fontSize(12).fillColor('#1a6b3c').font('Helvetica-Bold')
             .text(completionDate, dateX, statsY + 12, { width: statW, align: 'center' });
          doc.fontSize(8).fillColor('#555').font('Helvetica')
             .text('DATE OF ISSUE', dateX, statsY + 34, { width: statW, align: 'center', characterSpacing: 1 });
          
          // ── Signature lines ────────────────────────────────────────────
          const sigY = statsY + 68;
          const sig1X = W * 0.25;
          const sig2X = W * 0.65;
          
          doc.moveTo(sig1X - 60, sigY).lineTo(sig1X + 60, sigY)
             .lineWidth(1).strokeColor('#aaa').stroke();
          doc.fontSize(8).fillColor('#777').font('Helvetica')
             .text('Training Director', sig1X - 60, sigY + 4, { width: 120, align: 'center' });
          doc.text('ALMOG Oil Services', sig1X - 60, sigY + 14, { width: 120, align: 'center' });
          
          doc.moveTo(sig2X - 60, sigY).lineTo(sig2X + 60, sigY)
             .lineWidth(1).strokeColor('#aaa').stroke();
          doc.fontSize(8).fillColor('#777').font('Helvetica')
             .text('Course Coordinator', sig2X - 60, sigY + 4, { width: 120, align: 'center' });
          doc.text('EPF Training Division', sig2X - 60, sigY + 14, { width: 120, align: 'center' });
          
          // ── Verification footer ───────────────────────────────────────
          doc.rect(14, H - 50, W - 28, 28).fill('#1a6b3c');
          doc.fontSize(8).fillColor('#ffffff').font('Helvetica')
             .text(`Verification Code: ${verificationCode}   |   This certificate is issued by ALMOG Oil Services and is valid for professional use.   |   Issued: ${completionDate}`,
               20, H - 44, { width: W - 40, align: 'center' });
          
          doc.end();
        });
        
        const pdfBuffer = Buffer.concat(chunks);
        
        // Upload to S3
        const fileName = `certificates/${ctx.user.id}/module-${input.moduleId}-${Date.now()}.pdf`;
        const { url } = await storagePut(fileName, pdfBuffer, 'application/pdf');
        
        // Save to database with new fields
        await db.saveCertificate(ctx.user.id, input.moduleId, url, attemptCount, scorePercent, verificationCode);
        
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

  // ─── Certificate Verification (Public) ───────────────────────────────────────
  certificates: router({
    verify: publicProcedure
      .input(z.object({ code: z.string().min(1) }))
      .query(async ({ input }) => {
        return await db.verifyCertificate(input.code);
      }),
  }),

  // ─── Admin Router ───────────────────────────────────────────────────────────
  admin: router({
    // Guard: all admin procedures require admin role
    getStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      return await db.adminGetPlatformStats();
    }),

    getUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      return await db.adminGetAllUsers();
    }),

    getQuizAttempts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      return await db.adminGetAllQuizAttempts();
    }),

    getCertificates: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      return await db.adminGetAllCertificates();
    }),

    getUserDetail: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        return await db.adminGetUserDetail(input.userId);
      }),

    promoteUser: protectedProcedure
      .input(z.object({ userId: z.number(), role: z.enum(['user', 'admin']) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
        const dbConn = await db.getDb();
        if (!dbConn) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        const { users } = await import('../drizzle/schema');
        const { eq } = await import('drizzle-orm');
        await dbConn.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
