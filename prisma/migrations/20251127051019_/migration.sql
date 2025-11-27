-- DropForeignKey
ALTER TABLE `chatsession` DROP FOREIGN KEY `ChatSession_userId_fkey`;

-- DropIndex
DROP INDEX `ChatSession_userId_fkey` ON `chatsession`;

-- AlterTable
ALTER TABLE `chatsession` MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `ChatSession` ADD CONSTRAINT `ChatSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
