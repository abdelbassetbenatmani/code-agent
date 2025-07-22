-- AlterTable
ALTER TABLE "Repo" ADD COLUMN     "teamId" TEXT;

-- AddForeignKey
ALTER TABLE "Repo" ADD CONSTRAINT "Repo_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
