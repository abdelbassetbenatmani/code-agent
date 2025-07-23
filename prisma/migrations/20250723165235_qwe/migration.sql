/*
  Warnings:

  - Added the required column `invitedBy` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "invitedBy" TEXT NOT NULL,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';
