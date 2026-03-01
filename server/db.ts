import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, modules, lessons, quizQuestions, 
  lessonProgress, moduleProgress, quizAttempts, certificates, projectSubmissions,
  Module, Lesson, QuizQuestion, LessonProgress, ModuleProgress, QuizAttempt, Certificate, ProjectSubmission
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Course content queries
export async function getAllModules(courseId?: number): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (courseId !== undefined) {
    return await db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(modules.order);
  }
  return await db.select().from(modules).orderBy(modules.order);
}

export async function getModuleById(moduleId: number): Promise<Module | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  return result[0];
}

export async function getLessonsByModuleId(moduleId: number): Promise<Lesson[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(lessons).where(eq(lessons.moduleId, moduleId)).orderBy(lessons.order);
}

export async function getLessonById(lessonId: number): Promise<Lesson | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
  return result[0];
}

export async function getQuizQuestionsByModuleId(moduleId: number): Promise<QuizQuestion[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(quizQuestions).where(eq(quizQuestions.moduleId, moduleId)).orderBy(quizQuestions.order);
}

// Progress tracking queries
export async function getUserLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))
    .limit(1);
  return result[0];
}

export async function upsertLessonProgress(userId: number, lessonId: number, data: Partial<LessonProgress>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  // Check if record exists
  const existing = await getUserLessonProgress(userId, lessonId);
  
  if (existing) {
    // Update existing record - only update fields that are explicitly provided
    const updateFields: any = {
      lastAccessedAt: new Date(),
    };
    
    if (data.completed !== undefined) {
      updateFields.completed = data.completed;
      if (data.completed) {
        updateFields.completedAt = new Date();
      }
    }
    
    if (data.timeSpentMinutes !== undefined && data.timeSpentMinutes !== null) {
      // Add to existing time instead of replacing
      updateFields.timeSpentMinutes = (existing.timeSpentMinutes || 0) + data.timeSpentMinutes;
    }
    
    if (data.completedAt !== undefined) {
      updateFields.completedAt = data.completedAt;
    }
    
    await db.update(lessonProgress)
      .set(updateFields)
      .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)));
  } else {
    // Insert new record
    await db.insert(lessonProgress).values({
      userId,
      lessonId,
      completed: data.completed ?? false,
      timeSpentMinutes: data.timeSpentMinutes ?? 0,
      lastAccessedAt: new Date(),
      completedAt: data.completedAt,
    });
  }
}

export async function getUserModuleProgress(userId: number, moduleId: number): Promise<ModuleProgress | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(moduleProgress)
    .where(and(eq(moduleProgress.userId, userId), eq(moduleProgress.moduleId, moduleId)))
    .limit(1);
  return result[0];
}

export async function upsertModuleProgress(userId: number, moduleId: number, data: Partial<ModuleProgress>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(moduleProgress).values({
    userId,
    moduleId,
    completed: data.completed ?? false,
    completionPercentage: data.completionPercentage ?? 0,
    timeSpentMinutes: data.timeSpentMinutes ?? 0,
    lastAccessedAt: new Date(),
    completedAt: data.completedAt,
  }).onDuplicateKeyUpdate({
    set: {
      completed: data.completed,
      completionPercentage: data.completionPercentage,
      timeSpentMinutes: data.timeSpentMinutes,
      lastAccessedAt: new Date(),
      completedAt: data.completedAt,
    }
  });
}

export async function getAllUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return { modules: [], lessons: [] };
  
  const lessonProgressData = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  
  // Get all modules and their lessons to calculate progress
  const allModules = await db.select().from(modules);
  const allLessons = await db.select().from(lessons);
  
  // Calculate module progress based on completed lessons
  const calculatedModuleProgress = allModules.map(module => {
    const moduleLessons = allLessons.filter(l => l.moduleId === module.id);
    const completedLessons = moduleLessons.filter(ml => 
      lessonProgressData.some(lp => lp.lessonId === ml.id && lp.completed)
    );
    
    const completionPercentage = moduleLessons.length > 0 
      ? Math.round((completedLessons.length / moduleLessons.length) * 100)
      : 0;
    
    const completed = completionPercentage === 100;
    
    // Calculate time spent from lesson progress
    const timeSpentMinutes = moduleLessons.reduce((total, ml) => {
      const lessonProg = lessonProgressData.find(lp => lp.lessonId === ml.id);
      return total + (lessonProg?.timeSpentMinutes || 0);
    }, 0);
    
    return {
      id: 0, // Not stored in DB
      userId,
      moduleId: module.id,
      completed,
      completionPercentage,
      timeSpentMinutes,
      lastAccessedAt: new Date(),
      completedAt: completed ? new Date() : null,
      createdAt: new Date(),
    };
  });
  
  return { modules: calculatedModuleProgress, lessons: lessonProgressData };
}

// Quiz queries
export async function saveQuizAttempt(userId: number, moduleId: number, score: number, totalQuestions: number, answers: any[]): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(quizAttempts).values({
    userId,
    moduleId,
    score,
    totalQuestions,
    answersJson: answers,
    completedAt: new Date(),
  });
}

export async function getUserQuizAttempts(userId: number, moduleId?: number): Promise<QuizAttempt[]> {
  const db = await getDb();
  if (!db) return [];
  
  if (moduleId) {
    return await db.select().from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.moduleId, moduleId)))
      .orderBy(desc(quizAttempts.completedAt));
  }
  
  return await db.select().from(quizAttempts)
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.completedAt));
}

// Certificate queries
export async function saveCertificate(
  userId: number,
  moduleId: number,
  certificateUrl: string,
  attemptCount: number = 1,
  scorePercent: number = 0,
  verificationCode: string = ''
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(certificates).values({
    userId,
    moduleId,
    certificateUrl,
    issuedAt: new Date(),
    attemptCount,
    scorePercent,
    verificationCode,
  });
}

export async function getUserCertificates(userId: number): Promise<Certificate[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(certificates)
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));
}

// Project submission queries
export async function saveProjectSubmission(userId: number, reportFileUrl: string, reportFileName: string, notes?: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(projectSubmissions).values({
    userId,
    reportFileUrl,
    reportFileName,
    notes,
    submittedAt: new Date(),
  });
}

export async function getUserProjectSubmissions(userId: number): Promise<ProjectSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(projectSubmissions)
    .where(eq(projectSubmissions.userId, userId))
    .orderBy(desc(projectSubmissions.submittedAt));
}

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export async function adminGetAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: users.id,
    name: users.name,
    openId: users.openId,
    role: users.role,
    email: users.email,
    phone: users.phone,
    profileCompleted: users.profileCompleted,
    createdAt: users.createdAt,
  }).from(users).orderBy(desc(users.createdAt));
}

export async function adminGetPlatformStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalCertificates: 0, totalQuizAttempts: 0, totalLessonsCompleted: 0 };

  const [userCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
  const [certCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(certificates);
  const [attemptCount] = await db.select({ count: sql<number>`COUNT(*)` }).from(quizAttempts);
  const [lessonCount] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(lessonProgress).where(eq(lessonProgress.completed, true));

  return {
    totalUsers: Number(userCount?.count ?? 0),
    totalCertificates: Number(certCount?.count ?? 0),
    totalQuizAttempts: Number(attemptCount?.count ?? 0),
    totalLessonsCompleted: Number(lessonCount?.count ?? 0),
  };
}

export async function adminGetAllQuizAttempts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: quizAttempts.id,
    userId: quizAttempts.userId,
    moduleId: quizAttempts.moduleId,
    score: quizAttempts.score,
    totalQuestions: quizAttempts.totalQuestions,
    completedAt: quizAttempts.completedAt,
    userName: users.name,
    moduleTitleAr: modules.titleAr,
    moduleTitleEn: modules.titleEn,
  })
  .from(quizAttempts)
  .leftJoin(users, eq(quizAttempts.userId, users.id))
  .leftJoin(modules, eq(quizAttempts.moduleId, modules.id))
  .orderBy(desc(quizAttempts.completedAt));
}

export async function adminGetAllCertificates() {
  const db = await getDb();
  if (!db) return [];
  return await db.select({
    id: certificates.id,
    userId: certificates.userId,
    moduleId: certificates.moduleId,
    issuedAt: certificates.issuedAt,
    attemptCount: certificates.attemptCount,
    scorePercent: certificates.scorePercent,
    verificationCode: certificates.verificationCode,
    userName: users.name,
    moduleTitleAr: modules.titleAr,
    moduleTitleEn: modules.titleEn,
  })
  .from(certificates)
  .leftJoin(users, eq(certificates.userId, users.id))
  .leftJoin(modules, eq(certificates.moduleId, modules.id))
  .orderBy(desc(certificates.issuedAt));
}

export async function adminGetUserDetail(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return null;

  const userCerts = await db.select({
    id: certificates.id,
    moduleId: certificates.moduleId,
    issuedAt: certificates.issuedAt,
    attemptCount: certificates.attemptCount,
    scorePercent: certificates.scorePercent,
    verificationCode: certificates.verificationCode,
    moduleTitleAr: modules.titleAr,
  })
  .from(certificates)
  .leftJoin(modules, eq(certificates.moduleId, modules.id))
  .where(eq(certificates.userId, userId))
  .orderBy(desc(certificates.issuedAt));

  const userAttempts = await db.select({
    id: quizAttempts.id,
    moduleId: quizAttempts.moduleId,
    score: quizAttempts.score,
    totalQuestions: quizAttempts.totalQuestions,
    completedAt: quizAttempts.completedAt,
    moduleTitleAr: modules.titleAr,
  })
  .from(quizAttempts)
  .leftJoin(modules, eq(quizAttempts.moduleId, modules.id))
  .where(eq(quizAttempts.userId, userId))
  .orderBy(desc(quizAttempts.completedAt));

  const completedLessons = await db.select({ count: sql<number>`COUNT(*)` })
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.completed, true)));

  return {
    user,
    certificates: userCerts,
    quizAttempts: userAttempts,
    completedLessonsCount: Number(completedLessons[0]?.count ?? 0),
  };
}

export async function verifyCertificate(verificationCode: string) {
  const db = await getDb();
  if (!db) return null;

  const rows = await db.select({
    certId: certificates.id,
    issuedAt: certificates.issuedAt,
    attemptCount: certificates.attemptCount,
    scorePercent: certificates.scorePercent,
    verificationCode: certificates.verificationCode,
    userName: users.name,
    moduleTitleAr: modules.titleAr,
    moduleTitleEn: modules.titleEn,
    courseId: modules.courseId,
  })
  .from(certificates)
  .leftJoin(users, eq(certificates.userId, users.id))
  .leftJoin(modules, eq(certificates.moduleId, modules.id))
  .where(eq(certificates.verificationCode, verificationCode))
  .limit(1);

  return rows[0] ?? null;
}

export async function getCourseStats(courseId: number) {
  const db = await getDb();
  if (!db) return { moduleCount: 0, lessonCount: 0, questionCount: 0 };
  const [modRow] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(modules).where(eq(modules.courseId, courseId));
  const [lessonRow] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(lessons).innerJoin(modules, eq(lessons.moduleId, modules.id))
    .where(eq(modules.courseId, courseId));
  const [questionRow] = await db.select({ count: sql<number>`COUNT(*)` })
    .from(quizQuestions).innerJoin(modules, eq(quizQuestions.moduleId, modules.id))
    .where(eq(modules.courseId, courseId));
  return {
    moduleCount: Number(modRow?.count ?? 0),
    lessonCount: Number(lessonRow?.count ?? 0),
    questionCount: Number(questionRow?.count ?? 0),
  };
}

// ─── Course Final Exam Helpers ────────────────────────────────────────────────

export async function getCourseExamQuestions(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  // Import the new tables
  const { courseExamQuestions } = await import("../drizzle/schema");
  const rows = await db.select().from(courseExamQuestions)
    .where(eq(courseExamQuestions.courseId, courseId))
    .orderBy(courseExamQuestions.order);
  return rows;
}

export async function getCourseExamStatus(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;
  const { courseExamAttempts, courseCertificates } = await import("../drizzle/schema");
  // Get last attempt
  const [lastAttempt] = await db.select().from(courseExamAttempts)
    .where(and(eq(courseExamAttempts.userId, userId), eq(courseExamAttempts.courseId, courseId)))
    .orderBy(desc(courseExamAttempts.startedAt))
    .limit(1);
  // Get certificate if any
  const [cert] = await db.select().from(courseCertificates)
    .where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseId, courseId)))
    .limit(1);
  return {
    lastAttempt: lastAttempt ?? null,
    certificate: cert ?? null,
    lockedUntil: lastAttempt?.nextAllowedAt ?? null,
    hasPassed: cert != null,
  };
}

export async function saveCourseExamAttempt(data: {
  userId: number;
  courseId: number;
  scorePercent: number;
  passed: boolean;
  answers: Record<string, string>;
  timeTakenSeconds: number;
  nextAllowedAt: Date | null;
}) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  const { courseExamAttempts } = await import("../drizzle/schema");
  const [result] = await db.insert(courseExamAttempts).values({
    userId: data.userId,
    courseId: data.courseId,
    scorePercent: String(data.scorePercent),
    passed: data.passed ? 1 : 0,
    answers: data.answers as unknown as null,
    timeTakenSeconds: data.timeTakenSeconds,
    startedAt: new Date(),
    completedAt: new Date(),
    nextAllowedAt: data.nextAllowedAt,
  });
  return { id: (result as any).insertId as number };
}

export async function issueCourseExamCertificate(data: {
  userId: number;
  courseId: number;
  attemptId: number;
  scorePercent: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  const { courseCertificates } = await import("../drizzle/schema");
  // Check if certificate already exists
  const [existing] = await db.select().from(courseCertificates)
    .where(and(eq(courseCertificates.userId, data.userId), eq(courseCertificates.courseId, data.courseId)))
    .limit(1);
  if (existing) return existing;
  // Generate verification code
  const code = `CE-${data.courseId}-${data.userId}-${Date.now().toString(36).toUpperCase()}`;
  await db.insert(courseCertificates).values({
    userId: data.userId,
    courseId: data.courseId,
    attemptId: data.attemptId,
    scorePercent: String(data.scorePercent),
    verificationCode: code,
  });
  const [cert] = await db.select().from(courseCertificates)
    .where(eq(courseCertificates.verificationCode, code))
    .limit(1);
  return cert;
}

export async function getCourseCertificate(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;
  const { courseCertificates } = await import("../drizzle/schema");
  const [cert] = await db.select().from(courseCertificates)
    .where(and(eq(courseCertificates.userId, userId), eq(courseCertificates.courseId, courseId)))
    .limit(1);
  return cert ?? null;
}
