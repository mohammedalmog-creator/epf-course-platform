CREATE TABLE `course_certificates` (
`id` int AUTO_INCREMENT NOT NULL,
`user_id` int NOT NULL,
`course_id` int NOT NULL,
`certificate_url` text NOT NULL,
`issued_at` timestamp NOT NULL DEFAULT (now()),
`attempt_count` int NOT NULL DEFAULT 1,
`score_percent` int NOT NULL DEFAULT 0,
`verification_code` varchar(20) NOT NULL DEFAULT '',
`created_at` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `course_certificates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_exam_attempts` (
`id` int AUTO_INCREMENT NOT NULL,
`user_id` int NOT NULL,
`course_id` int NOT NULL,
`score` int NOT NULL,
`total_questions` int NOT NULL,
`passed` boolean NOT NULL DEFAULT false,
`answers_json` json NOT NULL,
`completed_at` timestamp NOT NULL DEFAULT (now()),
`created_at` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `course_exam_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `course_exam_questions` (
`id` int AUTO_INCREMENT NOT NULL,
`course_id` int NOT NULL,
`question_type` enum('mcq','true_false') NOT NULL DEFAULT 'mcq',
`question_text_ar` text NOT NULL,
`question_text_en` text,
`options_json` json NOT NULL,
`correct_option_id` varchar(10) NOT NULL,
`explanation_ar` text,
`explanation_en` text,
`difficulty` enum('medium','hard','expert') NOT NULL DEFAULT 'hard',
`time_limit_seconds` int NOT NULL DEFAULT 90,
`order` int NOT NULL,
`created_at` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `course_exam_questions_id` PRIMARY KEY(`id`)
);
