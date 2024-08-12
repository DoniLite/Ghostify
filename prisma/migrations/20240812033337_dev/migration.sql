-- CreateTable
CREATE TABLE "Contact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "message" TEXT
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PostSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "PostSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actuId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_actuId_fkey" FOREIGN KEY ("actuId") REFERENCES "Actu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "safe" BOOLEAN NOT NULL,
    "date" DATETIME NOT NULL,
    "toUpdate" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER,
    "visites" BIGINT NOT NULL,
    "user" TEXT,
    "fromApi" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GamerStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "url" TEXT,
    "gamingDay" DATETIME NOT NULL,
    "gameId" INTEGER,
    "gamerStats" TEXT NOT NULL,
    CONSTRAINT "GamerStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "GameData" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "data" TEXT
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "gitLab" TEXT NOT NULL,
    "bitbucket" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "participation" TEXT NOT NULL,
    "participationType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GeneratorData" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "url" TEXT
);

-- CreateTable
CREATE TABLE "Url" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "visit" BIGINT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Actu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT,
    "content" TEXT NOT NULL,
    "rawLink" TEXT NOT NULL,
    "promoted" BOOLEAN NOT NULL,
    "expirationDate" DATETIME
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "registrtoken" DATETIME NOT NULL,
    "credits" BIGINT
);

-- CreateTable
CREATE TABLE "Assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- CreateIndex
CREATE UNIQUE INDEX "GamerStat_url_key" ON "GamerStat"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Url_url_key" ON "Url"("url");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Assets_type_key" ON "Assets"("type");
