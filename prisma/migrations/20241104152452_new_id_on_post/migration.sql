/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Post_uid_key" ON "Post"("uid");
