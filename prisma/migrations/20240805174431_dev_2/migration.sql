/*
  Warnings:

  - You are about to alter the column `date` on the `posts` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - Added the required column `link` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participation` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participationType` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Actu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT,
    "content" TEXT NOT NULL,
    "rawLink" TEXT NOT NULL,
    "promoted" BOOLEAN NOT NULL,
    "expirationDate" DATETIME
);

-- CreateTable
CREATE TABLE "Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "gitLab" TEXT NOT NULL,
    "bitbucket" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "participation" TEXT NOT NULL,
    "participationType" TEXT NOT NULL
);
INSERT INTO "new_Project" ("bitbucket", "description", "gitLab", "github", "id", "license", "title") SELECT "bitbucket", "description", "gitLab", "github", "id", "license", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "date", "id", "published", "slug", "title") SELECT "categoryId", "content", "date", "id", "published", "slug", "title" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
