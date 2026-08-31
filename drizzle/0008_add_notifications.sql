CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int AUTO_INCREMENT NOT NULL,
  `user_id` int NOT NULL,
  `type` enum('account_approved','account_paused','account_reactivated','account_rejected') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `is_read` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `notifications_id` PRIMARY KEY(`id`),
  KEY `notifications_user_id_idx` (`user_id`)
);
