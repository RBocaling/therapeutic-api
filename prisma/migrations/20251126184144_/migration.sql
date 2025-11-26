-- AlterTable
ALTER TABLE `casemanagement` ADD COLUMN `intervention` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `chatsession` ADD COLUMN `moderatorId` INTEGER NULL;

-- AlterTable
ALTER TABLE `notification` MODIFY `type` ENUM('KYC_VERIFIED', 'ACCOUNT_VERIFIED', 'MESSAGE', 'SESSION_SCHEDULING', 'REFERRAL', 'ACTIVITY_PROGRESS', 'SECURITY', 'QUOTE', 'MESSAGE_APPROVED') NOT NULL;

-- CreateTable
CREATE TABLE `AwarenessCampaignImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `campaignId` INTEGER NOT NULL,
    `url` TEXT NOT NULL,
    `altText` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaseIntervention` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `intervention` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `CaseIntervention_intervention_key`(`intervention`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `counselorId` INTEGER NULL,
    `message` TEXT NULL,
    `reason` TEXT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChatSession` ADD CONSTRAINT `ChatSession_moderatorId_fkey` FOREIGN KEY (`moderatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AwarenessCampaignImage` ADD CONSTRAINT `AwarenessCampaignImage_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `AwarenessCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRequest` ADD CONSTRAINT `ChatRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChatRequest` ADD CONSTRAINT `ChatRequest_counselorId_fkey` FOREIGN KEY (`counselorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
