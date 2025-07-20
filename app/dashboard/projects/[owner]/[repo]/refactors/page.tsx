import { getRepoRefactors } from "@/app/lib/actions/code";
import React from "react";

const RepoRefactorsPage = async ({
  params,
}: {
  params: { owner: string; repo: string };
}) => {
  const { owner, repo } =await params;
  const refactors = await getRepoRefactors(owner, repo);
  if (!refactors) {
    return <div>No refactors found for this repository.</div>;
  }
//   console.log(`Refactors for ${owner}/${repo}:`, refactors);

  return (
    <div>
      RepoRefactorsPage for {owner}/{repo}
    </div>
  );
};

export default RepoRefactorsPage;
