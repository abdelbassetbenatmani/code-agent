"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { RefactoringType, ReviewType } from "@/prisma/types";

interface RepoDetails {
  name: string;
  ownerLogin: string;
  path?: string;
  [key: string]: unknown;
}

interface Review {
  summary: string;
  issues?: string | null;
  score?: number;
}

export async function saveReviewCode(
  currentUserId: string,
  reviewer: string,
  selectedRepoDetails: RepoDetails,
  fileName: string,
  review: Review,
  fileContent: string
): Promise<Review> {
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  let formattedIssues = review.issues;

  // If issues is an array or object, stringify it
  if (Array.isArray(formattedIssues) || typeof formattedIssues === "object") {
    formattedIssues = JSON.stringify(formattedIssues);
  }

  const reviewResponse = await prisma.codeReview.create({
    data: {
      id: uuidv4(),
      userId: currentUserId,
      repoName: selectedRepoDetails.name,
      repoOwner: selectedRepoDetails.ownerLogin,
      reviewer: reviewer,
      file: fileName,
      code: fileContent,
      path: selectedRepoDetails.path || "",
      summary: review.summary,
      issues: formattedIssues ?? null,
      score: review.score ?? 0,
    },
  });

  if (reviewResponse) {
    // Increment the review count for the repository
    await prisma.repo.update({
      where: {
        ownerLogin_name: {
          ownerLogin: selectedRepoDetails.ownerLogin,
          name: selectedRepoDetails.name,
        },
      },
      data: {
        reviewCount: {
          increment: 1,
        },
      },
    });
  }

  revalidatePath(`/dashboard`);

  return reviewResponse;
}

export async function saveRefactorCode(
  currentUserId: string,
  refactorer: string,
  selectedRepoDetails: RepoDetails,
  fileName: string,
  refactorCode: string,
  originalCode: string,
  summary: string,
  changes?: string | null
): Promise<void> {
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }
  let formatedChanges = changes;

  // If changes is an array or object, stringify it
  if (Array.isArray(formatedChanges) || typeof formatedChanges === "object") {
    formatedChanges = JSON.stringify(formatedChanges);
  }

  const refactorResponse = await prisma.codeRefactor.create({
    data: {
      id: uuidv4(),
      userId: currentUserId,
      repoName: selectedRepoDetails.name,
      repoOwner: selectedRepoDetails.ownerLogin,
      refactorer: refactorer,
      file: fileName,
      code: originalCode,
      path: selectedRepoDetails.path || "",
      refactoringCode: refactorCode,
      summary,
      changes: formatedChanges ?? null,
    },
  });

  if (refactorResponse) {
    // Increment the refactor count for the repository
    await prisma.repo.update({
      where: {
        ownerLogin_name: {
          ownerLogin: selectedRepoDetails.ownerLogin,
          name: selectedRepoDetails.name,
        },
      },
      data: {
        refactorCount: {
          increment: 1,
        },
      },
    });
  }

  revalidatePath(`/dashboard`);
}

export async function getRepoReviews(
  ownerLogin: string,
  repoName: string,
  page: number = 1,
  limit: number = 10
): Promise<{ reviews: ReviewType[]; totalCount: number }> {
  const skip = (page - 1) * limit;

  

  const [reviews, totalCount] = await Promise.all([
    prisma.codeReview.findMany({
      where: {
        repoOwner: ownerLogin,
        repoName: repoName,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.codeReview.count({
      where: {
        repoOwner: ownerLogin,
        repoName: repoName,
      },
    }),
  ]);

  return {
    reviews,
    totalCount,
  };
}

export async function getRepoRefactors(
  ownerLogin: string,
  repoName: string,
  page: number = 1,
  limit: number = 10
): Promise<{ refactors: RefactoringType[]; totalCount: number }> {
  const skip = (page - 1) * limit;

  const [refactors, totalCount] = await Promise.all([
    prisma.codeRefactor.findMany({
      where: {
        repoOwner: ownerLogin,
        repoName: repoName,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.codeRefactor.count({
      where: {
        repoOwner: ownerLogin,
        repoName: repoName,
      },
    }),
  ]);

  return {
    refactors,
    totalCount,
  };
}
