-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Actu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT,
    "content" TEXT NOT NULL,
    "rawLink" TEXT,
    "promoted" BOOLEAN NOT NULL,
    "ip" TEXT,
    "expirationDate" DATETIME,
    "safe" BOOLEAN NOT NULL DEFAULT false,
    "updated" BOOLEAN NOT NULL DEFAULT false,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "signaled" INTEGER NOT NULL DEFAULT 0,
    "visitors" BIGINT NOT NULL DEFAULT 0,
    "url" TEXT,
    "indexerId" INTEGER,
    CONSTRAINT "Actu_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Actu" ("content", "expirationDate", "file", "id", "indexed", "indexerId", "ip", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors") SELECT "content", "expirationDate", "file", "id", "indexed", "indexerId", "ip", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors" FROM "Actu";
DROP TABLE "Actu";
ALTER TABLE "new_Actu" RENAME TO "Actu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
