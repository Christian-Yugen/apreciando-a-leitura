CREATE TABLE `books` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`synopsis` text NOT NULL,
	`coverImageUrl` varchar(512),
	`purchaseLink` varchar(512),
	`series` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `books_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`genre` varchar(255),
	`reviewDate` timestamp NOT NULL,
	`content` text NOT NULL,
	`coverImageUrl` varchar(512),
	`purchaseLink` varchar(512),
	`excerpt` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
