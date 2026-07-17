ALTER TABLE `reviews` ADD COLUMN `legacyId` varchar(255);
ALTER TABLE `reviews` ADD COLUMN `slug` varchar(190);
ALTER TABLE `reviews` ADD COLUMN `labels` text;
ALTER TABLE `reviews` ADD COLUMN `sourceUrl` varchar(512);
CREATE UNIQUE INDEX `reviews_legacyId_unique` ON `reviews` (`legacyId`);
CREATE UNIQUE INDEX `reviews_slug_unique` ON `reviews` (`slug`);
