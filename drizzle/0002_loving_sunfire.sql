ALTER TABLE `modules` DROP INDEX `modules_module_number_unique`;--> statement-breakpoint
ALTER TABLE `modules` ADD `course_id` int DEFAULT 1 NOT NULL;