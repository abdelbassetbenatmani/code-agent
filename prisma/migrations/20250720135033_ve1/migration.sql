/*
  Warnings:

  - Added the required column `score` to the `CodeReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CodeReview" ADD COLUMN     "score" INTEGER NOT NULL;
