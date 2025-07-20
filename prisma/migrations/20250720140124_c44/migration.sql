/*
  Warnings:

  - The primary key for the `CodeRefactor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `CodeReview` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CodeRefactor" DROP CONSTRAINT "CodeRefactor_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CodeRefactor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CodeReview" DROP CONSTRAINT "CodeReview_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CodeReview_pkey" PRIMARY KEY ("id");
