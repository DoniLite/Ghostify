/*
  Warnings:

  - The primary key for the `GeneratorData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `GeneratorData` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratorData" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "url" TEXT
);
INSERT INTO "new_GeneratorData" ("email", "name", "url") SELECT "email", "name", "url" FROM "GeneratorData";
DROP TABLE "GeneratorData";
ALTER TABLE "new_GeneratorData" RENAME TO "GeneratorData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
