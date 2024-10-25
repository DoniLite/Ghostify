/*
  Warnings:

  - You are about to drop the column `gameUrl` on the `GameData` table. All the data in the column will be lost.
  - Added the required column `url` to the `GameData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GameData" DROP COLUMN "gameUrl",
ADD COLUMN     "url" TEXT NOT NULL;
