/*
  Warnings:

  - You are about to drop the column `registrtoken` on the `User` table. All the data in the column will be lost.
  - Added the required column `registration` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "registration" DATETIME NOT NULL,
    "credits" BIGINT
);
INSERT INTO "new_User" ("credits", "email", "id", "name", "password", "token") SELECT "credits", "email", "id", "name", "password", "token" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
