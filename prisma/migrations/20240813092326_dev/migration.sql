-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actuId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "commentId" INTEGER,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_actuId_fkey" FOREIGN KEY ("actuId") REFERENCES "Actu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("actuId", "content", "date", "id", "postId") SELECT "actuId", "content", "date", "id", "postId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
