-- CreateTable
CREATE TABLE "CodeReview" (
    "id" INTEGER NOT NULL,
    "repoId" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "issues" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeRefactor" (
    "id" INTEGER NOT NULL,
    "repoId" INTEGER NOT NULL,
    "file" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "refactoringCode" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "changes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeRefactor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CodeReview" ADD CONSTRAINT "CodeReview_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CodeRefactor" ADD CONSTRAINT "CodeRefactor_repoId_fkey" FOREIGN KEY ("repoId") REFERENCES "Repo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
