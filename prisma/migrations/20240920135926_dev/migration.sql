/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "KeyType" AS ENUM ('Password', 'SecretKey', 'SessionKey', 'ApiKey', 'AccessToken', 'RefreshToken', 'TwoFactorCode', 'GoogleAuthCode', 'AppleAuthCode', 'GitHubAuthCode', 'DiscordAuthCode', 'TwitterAuthCode', 'InstagramAuthCode', 'LinkedInAuthCode', 'FacebookAuthCode', 'RedditAuthCode');

-- CreateTable
CREATE TABLE "Key" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "type" "KeyType" NOT NULL,
    "uid" TEXT NOT NULL,

    CONSTRAINT "Key_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Key_uid_key" ON "Key"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
