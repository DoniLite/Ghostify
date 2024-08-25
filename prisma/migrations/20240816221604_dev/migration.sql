-- CreateTable
CREATE TABLE "Indexer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keys" TEXT NOT NULL,
    "postId" INTEGER,
    "type" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT,
    "content" TEXT NOT NULL,
    "rawLink" TEXT NOT NULL,
    "promoted" BOOLEAN NOT NULL,
    "expirationDate" DATETIME,
    "safe" BOOLEAN NOT NULL DEFAULT false,
    "updated" BOOLEAN NOT NULL DEFAULT false,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "signaled" INTEGER NOT NULL DEFAULT 0,
    "visitors" BIGINT NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "indexerId" INTEGER,
    CONSTRAINT "Actu_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Actu" ("content", "expirationDate", "file", "id", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors") SELECT "content", "expirationDate", "file", "id", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors" FROM "Actu";
DROP TABLE "Actu";
ALTER TABLE "new_Actu" RENAME TO "Actu";
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Assets" ("content", "id", "title", "type") SELECT "content", "id", "title", "type" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
CREATE UNIQUE INDEX "Assets_type_key" ON "Assets"("type");
CREATE TABLE "new_Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actuId" INTEGER,
    "file" TEXT NOT NULL,
    "reactions" TEXT NOT NULL,
    "postId" INTEGER,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "commentId" INTEGER,
    "signaled" BIGINT NOT NULL DEFAULT 0,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_actuId_fkey" FOREIGN KEY ("actuId") REFERENCES "Actu" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("actuId", "commentId", "content", "date", "file", "id", "postId", "reactions", "signaled") SELECT "actuId", "commentId", "content", "date", "file", "id", "postId", "reactions", "signaled" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
CREATE TABLE "new_GameData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT true,
    "logo" TEXT NOT NULL,
    "data" TEXT,
    "indexerId" INTEGER,
    CONSTRAINT "GameData_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GameData" ("data", "description", "gameUrl", "id", "logo", "title") SELECT "data", "description", "gameUrl", "id", "logo", "title" FROM "GameData";
DROP TABLE "GameData";
ALTER TABLE "new_GameData" RENAME TO "GameData";
CREATE TABLE "new_Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "gitLab" TEXT NOT NULL,
    "bitbucket" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT true,
    "license" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "participation" TEXT NOT NULL,
    "participationType" TEXT NOT NULL
);
INSERT INTO "new_Project" ("bitbucket", "description", "gitLab", "github", "id", "license", "link", "participation", "participationType", "title") SELECT "bitbucket", "description", "gitLab", "github", "id", "license", "link", "participation", "participationType", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE TABLE "new_Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "visit" BIGINT NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "indexerId" INTEGER,
    CONSTRAINT "Url_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
    "indexerId" INTEGER,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "posts_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_posts" ("categoryId", "content", "date", "description", "fromApi", "id", "inMemory", "published", "safe", "slug", "title", "toUpdate", "user", "visites") SELECT "categoryId", "content", "date", "description", "fromApi", "id", "inMemory", "published", "safe", "slug", "title", "toUpdate", "user", "visites" FROM "posts";
DROP TABLE "posts";
ALTER TABLE "new_posts" RENAME TO "posts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Indexer_type_key" ON "Indexer"("type");
