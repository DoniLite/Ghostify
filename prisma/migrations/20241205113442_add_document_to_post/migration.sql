-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "postId" INTEGER;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
