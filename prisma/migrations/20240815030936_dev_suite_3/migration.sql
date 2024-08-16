/*
  Warnings:

  - Added the required column `reactions` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostSection" ADD COLUMN "meta" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actuId" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "reactions" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "commentId" INTEGER,
    "signaled" BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_actuId_fkey" FOREIGN KEY ("actuId") REFERENCES "Actu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("actuId", "commentId", "content", "date", "file", "id", "postId") SELECT "actuId", "commentId", "content", "date", "file", "id", "postId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "visit" BIGINT NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Url" ("id", "name", "url", "visit") SELECT "id", "name", "url", "visit" FROM "Url";
DROP TABLE "Url";
ALTER TABLE "new_Url" RENAME TO "Url";
CREATE UNIQUE INDEX "Url_url_key" ON "Url"("url");
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
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "visites" BIGINT NOT NULL,
    "user" TEXT,
    "fromApi" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "date", "description", "fromApi", "id", "published", "safe", "slug", "title", "toUpdate", "user", "visites") SELECT "categoryId", "content", "date", "description", "fromApi", "id", "published", "safe", "slug", "title", "toUpdate", "user", "visites" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
