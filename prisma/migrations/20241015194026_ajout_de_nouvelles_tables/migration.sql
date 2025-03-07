-- CreateEnum
CREATE TYPE "ApiModuleType" AS ENUM ('Api', 'Module', 'Ressource', 'Snippet');

-- CreateTable
CREATE TABLE "ApiModule" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "ApiModuleType" NOT NULL,
    "scripts" TEXT[],
    "testHook" TEXT,
    "indexed" BOOLEAN NOT NULL DEFAULT false,
    "indexerId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ApiModule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApiModule" ADD CONSTRAINT "ApiModule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiModule" ADD CONSTRAINT "ApiModule_indexerId_fkey" FOREIGN KEY ("indexerId") REFERENCES "Indexer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
