import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Course modules (9 units)
 */
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  moduleNumber: int("module_number").notNull().unique(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  descriptionAr: text("description_ar"),
  descriptionEn: text("description_en"),
  duration: varchar("duration", { length: 50 }), // e.g., "2 weeks"
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

/**
 * Lessons within each module
 */
export const lessons = mysqlTable("lessons", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull(),
  lessonNumber: int("lesson_number").notNull(),
  titleAr: text("title_ar").notNull(),
  titleEn: text("title_en"),
  contentMarkdown: text("content_markdown").notNull(),
  estimatedMinutes: int("estimated_minutes"),
  videoUrl: text("video_url"),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = typeof lessons.$inferInsert;

/**
 * Quiz questions for each module
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("module_id").notNull(),
  questionTextAr: text("question_text_ar").notNull(),
  questionTextEn: text("question_text_en"),
  optionsJson: json("options_json").notNull(), // Array of {id: string, textAr: string, textEn: string}
  correctOptionId: varchar("correct_option_id", { length: 10 }).notNull(),
  explanationAr: text("explanation_ar"),
  explanationEn: text("explanation_en"),
  order: int("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * User progress on lessons
 */
export const lessonProgress = mysqlTable("lesson_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  lessonId: int("lesson_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  timeSpentMinutes: int("time_spent_minutes").default(0),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LessonProgress = typeof lessonProgress.$inferSelect;
export type InsertLessonProgress = typeof lessonProgress.$inferInsert;

/**
 * User progress on modules
 */
export const moduleProgress = mysqlTable("module_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moduleId: int("module_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completionPercentage: int("completion_percentage").default(0),
  timeSpentMinutes: int("time_spent_minutes").default(0),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = typeof moduleProgress.$inferInsert;

/**
 * Quiz attempts and results
 */
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moduleId: int("module_id").notNull(),
  score: int("score").notNull(), // Number of correct answers
  totalQuestions: int("total_questions").notNull(),
  answersJson: json("answers_json").notNull(), // Array of {questionId: number, selectedOptionId: string, correct: boolean}
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

/**
 * Certificates issued to users
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  moduleId: int("module_id").notNull(),
  certificateUrl: text("certificate_url").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Graduation project submissions
 */
export const projectSubmissions = mysqlTable("project_submissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  reportFileUrl: text("report_file_url").notNull(),
  reportFileName: varchar("report_file_name", { length: 255 }).notNull(),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ProjectSubmission = typeof projectSubmissions.$inferSelect;
export type InsertProjectSubmission = typeof projectSubmissions.$inferInsert;
