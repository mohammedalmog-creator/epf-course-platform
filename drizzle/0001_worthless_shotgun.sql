CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`module_id` int NOT NULL,
	`certificate_url` text NOT NULL,
	`issued_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`lesson_id` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`time_spent_minutes` int DEFAULT 0,
	`last_accessed_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lesson_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lessons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`lesson_number` int NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text,
	`content_markdown` text NOT NULL,
	`estimated_minutes` int,
	`video_url` text,
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lessons_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`module_id` int NOT NULL,
	`completed` boolean NOT NULL DEFAULT false,
	`completion_percentage` int DEFAULT 0,
	`time_spent_minutes` int DEFAULT 0,
	`last_accessed_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `module_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_number` int NOT NULL,
	`title_ar` text NOT NULL,
	`title_en` text,
	`description_ar` text,
	`description_en` text,
	`duration` varchar(50),
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_module_number_unique` UNIQUE(`module_number`)
);
--> statement-breakpoint
CREATE TABLE `project_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`report_file_url` text NOT NULL,
	`report_file_name` varchar(255) NOT NULL,
	`notes` text,
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`module_id` int NOT NULL,
	`score` int NOT NULL,
	`total_questions` int NOT NULL,
	`answers_json` json NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`module_id` int NOT NULL,
	`question_text_ar` text NOT NULL,
	`question_text_en` text,
	`options_json` json NOT NULL,
	`correct_option_id` varchar(10) NOT NULL,
	`explanation_ar` text,
	`explanation_en` text,
	`order` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
