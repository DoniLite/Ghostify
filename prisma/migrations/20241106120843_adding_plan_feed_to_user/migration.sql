-- CreateEnum
CREATE TYPE "UserPlan" AS ENUM ('Starter', 'Pro', 'Free');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "plan" "UserPlan" NOT NULL DEFAULT 'Free';
