-- AlterEnum
ALTER TYPE "KeyType" ADD VALUE 'PlateformKey';

-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "file" TEXT,
ADD COLUMN     "link" TEXT,
ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Promotion" ADD CONSTRAINT "Promotion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
