/*
  Warnings:

  - The values [PlateformKey] on the enum `KeyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [Platform] on the enum `Provider` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uid` on the `Document` table. All the data in the column will be lost.
  - The primary key for the `Key` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `file` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `CV` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `registration` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "FundingProvider" AS ENUM ('Stripe', 'PayPal', 'BankTransfer', 'Crypto', 'Wallet', 'Card');

-- CreateEnum
CREATE TYPE "FundingPriority" AS ENUM ('P1', 'P2', 'P3', 'P4');

-- AlterEnum
BEGIN;
CREATE TYPE "KeyType_new" AS ENUM ('Password', 'SecretKey', 'SessionKey', 'ApiKey', 'AccessToken', 'RefreshToken', 'TwoFactorCode', 'GoogleAuthCode', 'AppleAuthCode', 'GitHubAuthCode', 'DiscordAuthCode', 'TwitterAuthCode', 'InstagramAuthCode', 'LinkedInAuthCode', 'FacebookAuthCode', 'RedditAuthCode', 'PlatformKey');
ALTER TABLE "Key" ALTER COLUMN "type" TYPE "KeyType_new" USING ("type"::text::"KeyType_new");
ALTER TYPE "KeyType" RENAME TO "KeyType_old";
ALTER TYPE "KeyType_new" RENAME TO "KeyType";
DROP TYPE "KeyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Provider_new" AS ENUM ('Google', 'Facebook', 'Twitter', 'Instagram', 'LinkedIn', 'Ghostify');
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Provider_new" USING ("provider"::text::"Provider_new");
ALTER TYPE "Provider" RENAME TO "Provider_old";
ALTER TYPE "Provider_new" RENAME TO "Provider";
DROP TYPE "Provider_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CV" DROP CONSTRAINT "CV_userId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_userId_fkey";

-- DropForeignKey
ALTER TABLE "Key" DROP CONSTRAINT "Key_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_userId_fkey";

-- DropIndex
DROP INDEX "Document_uid_key";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Admin_id_seq";

-- AlterTable
ALTER TABLE "Document" DROP CONSTRAINT "Document_pkey",
DROP COLUMN "uid",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Document_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Document_id_seq";

-- AlterTable
ALTER TABLE "Key" DROP CONSTRAINT "Key_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Key_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Key_id_seq";

-- AlterTable
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Notifications_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "file",
ADD COLUMN     "avatar" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "registration" SET NOT NULL,
ALTER COLUMN "registration" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "provider" SET DEFAULT 'Ghostify',
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- DropTable
DROP TABLE "CV";

-- CreateTable
CREATE TABLE "FundingDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "priority" "FundingPriority" NOT NULL DEFAULT 'P1',
    "type" "FundingProvider" NOT NULL,
    "details" JSONB,

    CONSTRAINT "FundingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "type" TEXT,
    "mode" TEXT,
    "pdf" TEXT,
    "screenshot" TEXT,
    "metaData" TEXT NOT NULL,
    "img" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- AddForeignKey
ALTER TABLE "FundingDetails" ADD CONSTRAINT "FundingDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Key" ADD CONSTRAINT "Key_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
