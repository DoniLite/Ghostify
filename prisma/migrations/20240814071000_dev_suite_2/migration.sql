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
    "signaled" INTEGER NOT NULL DEFAULT 0,
    "visitors" BIGINT NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL
);
INSERT INTO "new_Actu" ("content", "expirationDate", "file", "id", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors") SELECT "content", "expirationDate", "file", "id", "promoted", "rawLink", "safe", "signaled", "updated", "url", "visitors" FROM "Actu";
DROP TABLE "Actu";
ALTER TABLE "new_Actu" RENAME TO "Actu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
