-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('User', 'Admin', 'Root');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private');

-- CreateEnum
CREATE TYPE "Reactions" AS ENUM ('Love', 'Laugh', 'Hurted', 'Good');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('Component', 'Script', 'Page', 'Snippet');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "message" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "keys" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostSection" (
    "id" SERIAL NOT NULL,
    "postId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "indedx" INTEGER NOT NULL,
    "header" BOOLEAN NOT NULL DEFAULT false,
    "meta" TEXT,

    CONSTRAINT "PostSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "file" TEXT,
    "reactions" "Reactions"[],
    "postId" INTEGER,
    "content" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commentId" INTEGER,
    "signaled" INTEGER NOT NULL DEFAULT 0,
    "referred" TEXT,
    "meta" TEXT,
    "isAnActu" BOOLEAN NOT NULL DEFAULT false,
    "isForumPost" BOOLEAN NOT NULL DEFAULT false,
    "promoted" BOOLEAN NOT NULL DEFAULT false,
    "safe" BOOLEAN NOT NULL DEFAULT false,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "visitors" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT,
    "indexerId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "postFile" (
    "id" SERIAL NOT NULL,
    "filePath" TEXT NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "postId" INTEGER NOT NULL,

    CONSTRAINT "postFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "safe" BOOLEAN NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inMemory" BOOLEAN NOT NULL DEFAULT true,
    "toUpdate" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT,
    "categoryId" INTEGER,
    "visibility" "Visibility" NOT NULL,
    "visites" INTEGER NOT NULL DEFAULT 0,
    "fromApi" BOOLEAN NOT NULL DEFAULT false,
    "parsedContent" TEXT,
    "indexerId" INTEGER,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indexer" (
    "id" SERIAL NOT NULL,
    "keys" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Indexer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamerStat" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "url" TEXT,
    "gamingDay" TIMESTAMP(3) NOT NULL,
    "gameId" INTEGER,
    "gamerStats" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "GamerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameData" (
    "id" SERIAL NOT NULL,
    "gameUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT true,
    "logo" TEXT NOT NULL,
    "data" TEXT,
    "indexerId" INTEGER NOT NULL,

    CONSTRAINT "GameData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "github" TEXT NOT NULL,
    "gitLab" TEXT NOT NULL,
    "bitbucket" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "license" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "participation" TEXT NOT NULL,
    "participationType" TEXT NOT NULL,
    "indexerId" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratorData" (
    "name" TEXT NOT NULL,
    "email" TEXT,
    "url" TEXT,

    CONSTRAINT "GeneratorData_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "visit" INTEGER NOT NULL DEFAULT 0,
    "name" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "health" BOOLEAN NOT NULL DEFAULT false,
    "indexerId" INTEGER,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "registration" TIMESTAMP(3),
    "permission" "Permission" NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 300,
    "meta" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assets" (
    "id" SERIAL NOT NULL,
    "type" "AssetType" NOT NULL,
    "uid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "indexerId" INTEGER,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "activities" TEXT,
    "connection" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- CreateIndex
CREATE INDEX "posts_published_createdAt_id_userId_idx" ON "posts"("published", "createdAt", "id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Indexer_type_key" ON "Indexer"("type");

-- CreateIndex
CREATE UNIQUE INDEX "GamerStat_url_key" ON "GamerStat"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Assets_uid_key" ON "Assets"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_login_key" ON "Admin"("login");

-- AddForeignKey
ALTER TABLE "PostSection" ADD CONSTRAINT "PostSection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postFile" ADD CONSTRAINT "postFile_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamerStat" ADD CONSTRAINT "GamerStat_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "GameData"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamerStat" ADD CONSTRAINT "GamerStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameData" ADD CONSTRAINT "GameData_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assets" ADD CONSTRAINT "Assets_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
