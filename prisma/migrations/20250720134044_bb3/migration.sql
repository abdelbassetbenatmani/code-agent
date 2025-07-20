/*
  Warnings:

  - Added the required column `userId` to the `CodeRefactor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CodeReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeRefactor" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CodeReview" ADD COLUMN     "userId" TEXT NOT NULL;
