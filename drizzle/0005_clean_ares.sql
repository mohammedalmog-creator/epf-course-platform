ALTER TABLE `certificates` ADD `attempt_count` int DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD `score_percent` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `certificates` ADD `verification_code` varchar(20) DEFAULT '' NOT NULL;