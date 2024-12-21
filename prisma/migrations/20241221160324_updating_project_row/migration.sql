/*
  Warnings:

  - You are about to drop the column `gitLab` on the `Project` table. All the data in the column will be lost.
  - Changed the type of `participationType` on the `Project` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ProjectParticipationType" AS ENUM ('Collaboration', 'Free', 'Subscription');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "gitLab",
ADD COLUMN     "gitlab" TEXT,
ALTER COLUMN "github" DROP NOT NULL,
ALTER COLUMN "bitbucket" DROP NOT NULL,
DROP COLUMN "participationType",
ADD COLUMN     "participationType" "ProjectParticipationType" NOT NULL;
