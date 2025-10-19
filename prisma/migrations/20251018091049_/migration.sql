-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `suffix` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `profilePic` VARCHAR(191) NULL,
    `isTakeSurvey` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserProfile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `gender` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `country` VARCHAR(191) NULL,
    `province` VARCHAR(191) NULL,
    `municipality` VARCHAR(191) NULL,
    `barangay` VARCHAR(191) NULL,
    `contactNo` VARCHAR(191) NULL,
    `guardianName` VARCHAR(191) NULL,
    `guardianContact` VARCHAR(191) NULL,
    `userStatus` ENUM('STUDENT', 'EMPLOYED') NULL,
    `validId` VARCHAR(191) NULL,
    `selfieImage` VARCHAR(191) NULL,
    `isFirstGenerationStudent` BOOLEAN NULL DEFAULT false,
    `indigenousGroup` VARCHAR(191) NULL,
    `isSingleParent` BOOLEAN NULL DEFAULT false,
    `singleParentYears` INTEGER NULL,
    `isPWD` BOOLEAN NULL DEFAULT false,
    `disability` VARCHAR(191) NULL,
    `familyIncomeRange` VARCHAR(191) NULL,
    `school` VARCHAR(191) NULL,
    `course` VARCHAR(191) NULL,
    `yearLevel` VARCHAR(191) NULL,
    `sectionBlock` VARCHAR(191) NULL,
    `office` VARCHAR(191) NULL,
    `jobPosition` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserProfile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `code` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `scoringRules` JSON NULL,
    `category` JSON NULL,
    `surveyInternal` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SurveyForm_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyQuestion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `surveyFormId` INTEGER NOT NULL,
    `questionName` VARCHAR(191) NOT NULL,
    `questionType` VARCHAR(191) NOT NULL,
    `options` JSON NULL,
    `isRequired` BOOLEAN NOT NULL DEFAULT true,
    `orderQuestion` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserResponse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userProfileId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `surveyFormId` INTEGER NOT NULL,
    `attemptNumber` INTEGER NOT NULL DEFAULT 1,
    `score` DOUBLE NULL,
    `resultCategory` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'inprogress',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveyAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userResponseId` INTEGER NOT NULL,
    `surveyQuestionId` INTEGER NOT NULL,
    `value` VARCHAR(191) NULL,
    `numericValue` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyQuestion` ADD CONSTRAINT `SurveyQuestion_surveyFormId_fkey` FOREIGN KEY (`surveyFormId`) REFERENCES `SurveyForm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_userProfileId_fkey` FOREIGN KEY (`userProfileId`) REFERENCES `UserProfile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserResponse` ADD CONSTRAINT `UserResponse_surveyFormId_fkey` FOREIGN KEY (`surveyFormId`) REFERENCES `SurveyForm`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswer` ADD CONSTRAINT `SurveyAnswer_userResponseId_fkey` FOREIGN KEY (`userResponseId`) REFERENCES `UserResponse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveyAnswer` ADD CONSTRAINT `SurveyAnswer_surveyQuestionId_fkey` FOREIGN KEY (`surveyQuestionId`) REFERENCES `SurveyQuestion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
