-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Admin" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "activities" TEXT,
    "connection" DATETIME
);
INSERT INTO "new_Admin" ("activities", "connection", "id", "login", "password", "role", "token") SELECT "activities", "connection", "id", "login", "password", "role", "token" FROM "Admin";
DROP TABLE "Admin";
ALTER TABLE "new_Admin" RENAME TO "Admin";
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
