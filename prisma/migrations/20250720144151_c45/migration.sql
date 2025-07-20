-- AlterTable
ALTER TABLE "CodeRefactor" ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "CodeReview" ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';
