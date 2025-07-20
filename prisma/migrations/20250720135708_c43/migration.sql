/*
  Warnings:

  - You are about to drop the column `repoId` on the `CodeRefactor` table. All the data in the column will be lost.
  - You are about to drop the column `repoId` on the `CodeReview` table. All the data in the column will be lost.
  - Added the required column `repoName` to the `CodeRefactor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoOwner` to the `CodeRefactor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoName` to the `CodeReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `repoOwner` to the `CodeReview` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CodeRefactor" DROP CONSTRAINT "CodeRefactor_repoId_fkey";

-- DropForeignKey
ALTER TABLE "CodeReview" DROP CONSTRAINT "CodeReview_repoId_fkey";

-- AlterTable
ALTER TABLE "CodeRefactor" DROP COLUMN "repoId",
ADD COLUMN     "repoName" TEXT NOT NULL,
ADD COLUMN     "repoOwner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CodeReview" DROP COLUMN "repoId",
ADD COLUMN     "repoName" TEXT NOT NULL,
ADD COLUMN     "repoOwner" TEXT NOT NULL;
