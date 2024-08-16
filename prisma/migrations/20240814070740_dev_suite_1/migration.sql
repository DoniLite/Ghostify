/*
  Warnings:

  - Added the required column `safe` to the `Actu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signaled` to the `Actu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `Actu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Actu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visitors` to the `Actu` table without a default value. This is not possible if the table is not empty.

*/
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
    "safe" BOOLEAN NOT NULL,
    "updated" BOOLEAN NOT NULL,
    "signaled" INTEGER NOT NULL,
    "visitors" BIGINT NOT NULL,
    "url" TEXT NOT NULL
);
INSERT INTO "new_Actu" ("content", "expirationDate", "file", "id", "promoted", "rawLink") SELECT "content", "expirationDate", "file", "id", "promoted", "rawLink" FROM "Actu";
DROP TABLE "Actu";
ALTER TABLE "new_Actu" RENAME TO "Actu";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
