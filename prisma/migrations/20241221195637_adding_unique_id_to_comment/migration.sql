/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Comment_token_key" ON "Comment"("token");
