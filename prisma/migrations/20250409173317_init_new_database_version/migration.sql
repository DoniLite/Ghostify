/*
  Warnings:

  - You are about to drop the `ApiModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Assets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GameData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GamerStat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneratorData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Indexer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Promotion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Topic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Url` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postFile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `uid` on table `Document` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ApiModule" DROP CONSTRAINT "ApiModule_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "ApiModule" DROP CONSTRAINT "ApiModule_userId_fkey";

-- DropForeignKey
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_topicId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_postId_fkey";

-- DropForeignKey
ALTER TABLE "GameData" DROP CONSTRAINT "GameData_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "GamerStat" DROP CONSTRAINT "GamerStat_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GamerStat" DROP CONSTRAINT "GamerStat_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostSection" DROP CONSTRAINT "PostSection_postId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "Promotion" DROP CONSTRAINT "Promotion_userId_fkey";

-- DropForeignKey
ALTER TABLE "Url" DROP CONSTRAINT "Url_indexerId_fkey";

-- DropForeignKey
ALTER TABLE "Vote" DROP CONSTRAINT "Vote_topicId_fkey";

-- DropForeignKey
ALTER TABLE "postFile" DROP CONSTRAINT "postFile_postId_fkey";

-- AlterTable
ALTER TABLE "Document" ALTER COLUMN "uid" SET NOT NULL;

-- DropTable
DROP TABLE "ApiModule";

-- DropTable
DROP TABLE "Assets";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "GameData";

-- DropTable
DROP TABLE "GamerStat";

-- DropTable
DROP TABLE "GeneratorData";

-- DropTable
DROP TABLE "Indexer";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "PostSection";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Promotion";

-- DropTable
DROP TABLE "Services";

-- DropTable
DROP TABLE "Topic";

-- DropTable
DROP TABLE "Url";

-- DropTable
DROP TABLE "Vote";

-- DropTable
DROP TABLE "postFile";

-- DropEnum
DROP TYPE "ApiModuleType";

-- DropEnum
DROP TYPE "AssetType";

-- DropEnum
DROP TYPE "Class";

-- DropEnum
DROP TYPE "ProjectParticipationType";

-- DropEnum
DROP TYPE "Reactions";

-- DropEnum
DROP TYPE "Visibility";
