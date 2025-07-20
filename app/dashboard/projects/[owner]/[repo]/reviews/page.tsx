import { getRepoReviews } from "@/app/lib/actions/code";
import React from "react";

const RepoReviewsPage = async ({ params }: { params: { owner: string; repo: string } }) => {
  const { owner, repo } = await params;
  const reviews = await getRepoReviews(owner, repo);
    if (!reviews) {
        return <div>No reviews found for this repository.</div>;
    }
    console.log(`Reviews for ${owner}/${repo}:`, reviews);
    
  return <div>RepoReviewsPage for {owner}/{repo}</div>;
};

export default RepoReviewsPage;
