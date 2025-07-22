/*
  Warnings:

  - Added the required column `refactorer` to the `CodeRefactor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewer` to the `CodeReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeRefactor" ADD COLUMN     "refactorer" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CodeReview" ADD COLUMN     "reviewer" TEXT NOT NULL;
