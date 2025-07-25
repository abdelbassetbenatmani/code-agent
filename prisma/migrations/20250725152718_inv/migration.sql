/*
  Warnings:

  - The values [TEAM_MEMBER_ADDED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('CODE_REVIEW', 'CODE_REFACTOR', 'TEAM_INVITATION', 'TEAM_MEMBER_REMOVED', 'TEAM_MEMBER_ROLE_CHANGED', 'TEAM_MEMBER_JOINED', 'TEAM_MEMBER_LEFT', 'TEAM_MEMBER_REMOVED_BY_OWNER', 'TEAM_MEMBER_ACCEPTED_INVITATION', 'TEAM_MEMBER_REJECTED_INVITATION', 'TEAM_DELETE', 'REPO_DELETE', 'REPO_ADD', 'REPO_UPDATE');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;
