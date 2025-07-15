-- CreateTable
CREATE TABLE "Repo" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "ownerLogin" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "description" TEXT,
    "cloneUrl" TEXT NOT NULL,
    "sshUrl" TEXT NOT NULL,
    "defaultBranch" TEXT NOT NULL,
    "language" TEXT,
    "visibility" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pushedAt" TIMESTAMP(3) NOT NULL,
    "size" INTEGER NOT NULL,
    "stargazersCount" INTEGER NOT NULL,
    "watchersCount" INTEGER NOT NULL,
    "forksCount" INTEGER NOT NULL,
    "openIssuesCount" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Repo_pkey" PRIMARY KEY ("id")
);
