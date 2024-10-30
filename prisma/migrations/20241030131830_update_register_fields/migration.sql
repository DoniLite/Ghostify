/*
  Warnings:

  - You are about to drop the column `registred` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "registred",
ADD COLUMN     "registered" BOOLEAN NOT NULL DEFAULT false;
