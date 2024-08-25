/*
  Warnings:

  - Added the required column `keys` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `indedx` to the `PostSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `postFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Actu" ADD COLUMN "ip" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "meta" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "keys" TEXT NOT NULL
);
INSERT INTO "new_Category" ("id", "title") SELECT "id", "title" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");
CREATE TABLE "new_PostSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "indedx" INTEGER NOT NULL,
    "header" BOOLEAN NOT NULL DEFAULT false,
    "meta" TEXT,
    CONSTRAINT "PostSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostSection" ("content", "header", "id", "meta", "postId", "title") SELECT "content", "header", "id", "meta", "postId", "title" FROM "PostSection";
DROP TABLE "PostSection";
ALTER TABLE "new_PostSection" RENAME TO "PostSection";
CREATE TABLE "new_postFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "postFile_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_postFile" ("filePath", "id", "postId", "sectionId") SELECT "filePath", "id", "postId", "sectionId" FROM "postFile";
DROP TABLE "postFile";
ALTER TABLE "new_postFile" RENAME TO "postFile";
CREATE TABLE "new_posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "safe" BOOLEAN NOT NULL,
    "date" DATETIME NOT NULL,
    "inMemory" BOOLEAN NOT NULL DEFAULT true,
    "toUpdate" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "categoryId" INTEGER,
    "visites" BIGINT NOT NULL DEFAULT 0,
    "user" TEXT,
    "fromApi" BOOLEAN NOT NULL DEFAULT false,
    "parser" TEXT,
    "indexerId" INTEGER,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "posts_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "date", "description", "fromApi", "id", "inMemory", "indexed", "indexerId", "published", "safe", "slug", "title", "toUpdate", "user", "visites") SELECT "categoryId", "content", "date", "description", "fromApi", "id", "inMemory", "indexed", "indexerId", "published", "safe", "slug", "title", "toUpdate", "user", "visites" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
