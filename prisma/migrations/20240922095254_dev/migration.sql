/*
  Warnings:

  - You are about to drop the column `logo` on the `GameData` table. All the data in the column will be lost.
  - You are about to drop the column `indedx` on the `PostSection` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `User` table. All the data in the column will be lost.
  - Added the required column `index` to the `PostSection` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('Poster', 'CVMaker', 'APIs');

-- CreateEnum
CREATE TYPE "Class" AS ENUM ('A', 'B', 'S', 'SS', 'D');

-- DropIndex
DROP INDEX "posts_published_createdAt_id_userId_idx";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "topicId" INTEGER;

-- AlterTable
ALTER TABLE "GameData" DROP COLUMN "logo";

-- AlterTable
ALTER TABLE "PostSection" DROP COLUMN "indedx",
ADD COLUMN     "index" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "credits",
ADD COLUMN     "apiAccess" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "apiCredits" INTEGER NOT NULL DEFAULT 300,
ADD COLUMN     "cvCredits" INTEGER NOT NULL DEFAULT 300,
ADD COLUMN     "posterCredits" INTEGER NOT NULL DEFAULT 300;

-- CreateTable
CREATE TABLE "Services" (
    "id" SERIAL NOT NULL,
    "type" "Service" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "poll" TEXT NOT NULL,
    "class" "Class" NOT NULL,
    "topicId" INTEGER,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Services_type_key" ON "Services"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_title_key" ON "Topic"("title");

-- CreateIndex
CREATE INDEX "Comment_id_userId_topicId_postId_commentId_indexerId_idx" ON "Comment"("id", "userId", "topicId", "postId", "commentId", "indexerId");

-- CreateIndex
CREATE INDEX "posts_published_createdAt_id_userId_indexerId_idx" ON "posts"("published", "createdAt", "id", "userId", "indexerId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
