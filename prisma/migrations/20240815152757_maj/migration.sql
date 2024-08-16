/*
  Warnings:

  - Added the required column `sectionId` to the `postFile` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PostSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "header" BOOLEAN NOT NULL DEFAULT false,
    "meta" TEXT,
    CONSTRAINT "PostSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PostSection" ("content", "id", "meta", "postId", "title") SELECT "content", "id", "meta", "postId", "title" FROM "PostSection";
DROP TABLE "PostSection";
ALTER TABLE "new_PostSection" RENAME TO "PostSection";
CREATE TABLE "new_postFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filePath" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    CONSTRAINT "postFile_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_postFile" ("filePath", "id", "postId") SELECT "filePath", "id", "postId" FROM "postFile";
DROP TABLE "postFile";
ALTER TABLE "new_postFile" RENAME TO "postFile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
