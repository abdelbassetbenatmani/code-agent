import { getRepoReviews } from "@/app/lib/actions/code";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import ReviewsTable from "./_components/review-table";
import Pagination from "@/components/utils/Pagination";
import Link from "next/link";

type RepoReviewsPageProps = {
  params: { owner: string; repo: string };
  searchParams?: {
    query?: string;
    page?: string;
  };
};

const REVIEWS_PER_PAGE = 10;

const RepoReviewsPage = async ({
  params,
  searchParams,
}: RepoReviewsPageProps) => {
  const { owner, repo } = await params;
  const { page } = (await searchParams) || {};
  const currentPage = Number(page) || 1;

  const { reviews, totalCount } = await getRepoReviews(
    owner,
    repo,
    currentPage,
    REVIEWS_PER_PAGE
  );

  const totalPages = Math.ceil(totalCount / REVIEWS_PER_PAGE);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{repo}</h1>
            <span className="text-xl text-muted-foreground">/reviews</span>
          </div>
          <Link
            href="/dashboard"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
        <p className="text-muted-foreground mt-1">
          Repository code review history for {owner}/{repo}
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {reviews && reviews.length > 0 ? (
            <>
              <ReviewsTable reviews={reviews} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalCount}
                itemsPerPage={REVIEWS_PER_PAGE}
              />
            </>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No reviews found</AlertTitle>
              <AlertDescription>
                No code reviews have been performed on this repository yet. Go
                to the repository explorer to review files.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepoReviewsPage;
