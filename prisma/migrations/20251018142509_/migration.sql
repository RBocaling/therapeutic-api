/*
  Warnings:

  - A unique constraint covering the columns `[surveyFormId,orderQuestion]` on the table `SurveyQuestion` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ADMIN', 'MODERATOR', 'COUNSELOR', 'USER') NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE `CounselorProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `specialization` VARCHAR(191) NULL,
    `licenseNumber` VARCHAR(191) NULL,
    `experienceYears` INTEGER NULL,
    `bio` VARCHAR(191) NULL,
    `availabilitySchedule` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CounselorProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SurveyQuestion_surveyFormId_orderQuestion_key` ON `SurveyQuestion`(`surveyFormId`, `orderQuestion`);

-- AddForeignKey
ALTER TABLE `CounselorProfile` ADD CONSTRAINT `CounselorProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
