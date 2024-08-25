-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "indexerId" INTEGER,
    CONSTRAINT "Assets_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Assets" ("content", "id", "indexed", "title", "type") SELECT "content", "id", "indexed", "title", "type" FROM "Assets";
DROP TABLE "Assets";
ALTER TABLE "new_Assets" RENAME TO "Assets";
CREATE UNIQUE INDEX "Assets_type_key" ON "Assets"("type");
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
    "participationType" TEXT NOT NULL,
    "indexerId" INTEGER,
    CONSTRAINT "Project_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("bitbucket", "description", "gitLab", "github", "id", "indexed", "license", "link", "participation", "participationType", "title") SELECT "bitbucket", "description", "gitLab", "github", "id", "indexed", "license", "link", "participation", "participationType", "title" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
