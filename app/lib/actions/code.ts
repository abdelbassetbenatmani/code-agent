"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

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
      file: fileName,
      code: fileContent,
      path: selectedRepoDetails.path || "",
      summary: review.summary,
      issues: formattedIssues ?? null,
      score: review.score ?? 0,
    },
  });

  revalidatePath(`/reviews/${reviewResponse.id}`);

  return review;
}

export async function saveRefactorCode(
  currentUserId: string,
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

  await prisma.codeRefactor.create({
    data: {
      id: uuidv4(),
      userId: currentUserId,
      repoName: selectedRepoDetails.name,
      repoOwner: selectedRepoDetails.ownerLogin,
      file: fileName,
      code: originalCode,
      path: selectedRepoDetails.path || "",
      refactoringCode: refactorCode,
      summary,
      changes: formatedChanges ?? null,
    },
  });
  revalidatePath(`/`);
}
