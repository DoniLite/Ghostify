/*
  Warnings:

  - Added the required column `endpoint` to the `Services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Key" ADD COLUMN     "token" TEXT,
ADD COLUMN     "userId" INTEGER,
ALTER COLUMN "key" DROP NOT NULL,
ALTER COLUMN "iv" DROP NOT NULL,
ALTER COLUMN "uid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "docs" TEXT,
ADD COLUMN     "endpoint" TEXT NOT NULL,
ADD COLUMN     "isSecure" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
