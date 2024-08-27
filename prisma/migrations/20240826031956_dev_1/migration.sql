-- CreateTable
CREATE TABLE "Admin" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "role" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "activities" TEXT,
    "connection" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");
