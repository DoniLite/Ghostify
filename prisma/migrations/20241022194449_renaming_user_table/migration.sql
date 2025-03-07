/*
  Warnings:

  - You are about to drop the column `meta` on the `User` table. All the data in the column will be lost.
  - Added the required column `testingData` to the `Services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Services" ADD COLUMN     "testingData" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "meta",
ADD COLUMN     "file" TEXT;
