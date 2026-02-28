ALTER TABLE `lessons` MODIFY COLUMN `order` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `lessons` ADD `image_url` text;