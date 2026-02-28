ALTER TABLE `users` ADD `phone` varchar(30);--> statement-breakpoint
ALTER TABLE `users` ADD `profile_completed` boolean DEFAULT false NOT NULL;