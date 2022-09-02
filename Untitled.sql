CREATE TABLE `users` (
  `id` integer,
  `firstName` varchar(255),
  `lastName` varchar(255),
  `email` varchar(255),
  `username` varchar(255) UNIQUE
);

CREATE TABLE `spots` (
  `id` integer,
  `ownerId` integer,
  `address` varchar(255),
  `city` varchar(255),
  `state` varchar(255),
  `country` varchar(255),
  `lat` decimal,
  `lng` decimal,
  `name` varchar(255),
  `description` varchar(255),
  `pricePerNight` integer,
  `previewImage` imageurl
);

CREATE TABLE `reviews` (
  `id` integer,
  `userId` integer,
  `spotId` integer,
  `reviews` varchar(255),
  `stars` integer
);

CREATE TABLE `Images` (
  `id` integer,
  `url` imageurl,
  `reviewImageId` integer,
  `sportImageId` integer
);

CREATE TABLE `bookings` (
  `userId` integer,
  `spotId` integer,
  `startDate` timestamp,
  `endDate` timestamp,
  `createdAt` timestamp,
  `updatedAt` timestamp
);

ALTER TABLE `reviews` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`spotId`) REFERENCES `spots` (`id`);

ALTER TABLE `Images` ADD FOREIGN KEY (`reviewImageId`) REFERENCES `reviews` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `bookings` ADD FOREIGN KEY (`spotId`) REFERENCES `spots` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`id`) REFERENCES `spots` (`ownerId`);

ALTER TABLE `Images` ADD FOREIGN KEY (`sportImageId`) REFERENCES `spots` (`id`);
