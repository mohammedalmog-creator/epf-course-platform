import { eq, and, desc } from "drizzle-orm";
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
export async function getAllModules(): Promise<Module[]> {
  const db = await getDb();
  if (!db) return [];
  
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
  
  await db.insert(lessonProgress).values({
    userId,
    lessonId,
    completed: data.completed ?? false,
    timeSpentMinutes: data.timeSpentMinutes ?? 0,
    lastAccessedAt: new Date(),
    completedAt: data.completedAt,
  }).onDuplicateKeyUpdate({
    set: {
      completed: data.completed,
      timeSpentMinutes: data.timeSpentMinutes,
      lastAccessedAt: new Date(),
      completedAt: data.completedAt,
    }
  });
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
  
  const moduleProgressData = await db.select().from(moduleProgress).where(eq(moduleProgress.userId, userId));
  const lessonProgressData = await db.select().from(lessonProgress).where(eq(lessonProgress.userId, userId));
  
  return { modules: moduleProgressData, lessons: lessonProgressData };
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
export async function saveCertificate(userId: number, moduleId: number, certificateUrl: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(certificates).values({
    userId,
    moduleId,
    certificateUrl,
    issuedAt: new Date(),
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
