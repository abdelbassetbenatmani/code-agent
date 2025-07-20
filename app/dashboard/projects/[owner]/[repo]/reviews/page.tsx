import { getRepoReviews } from "@/app/lib/actions/code";
import { ReviewType } from "@/prisma/types";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ReviewsTable from "./_components/review-table";

const RepoReviewsPage = async ({
  params,
}: {
  params: { owner: string; repo: string };
}) => {
  const { owner, repo } = await params;
  const reviews: ReviewType[] = await getRepoReviews(owner, repo);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex items-center flex-wrap gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {repo}
          </h1>
          <span className="text-xl text-muted-foreground">
            /reviews
          </span>
        </div>
        <p className="text-muted-foreground mt-1">
          Repository code review history for {owner}/{repo}
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {reviews && reviews.length > 0 ? (
            <ReviewsTable reviews={reviews} />
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No reviews found</AlertTitle>
              <AlertDescription>
                No code reviews have been performed on this repository yet.
                Go to the repository explorer to review files.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepoReviewsPage;