import { getRepoRefactors } from "@/app/lib/actions/code";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCcw } from "lucide-react";
import RefactorTable from "./_components/refactor-table";
import { RefactoringType } from "@/prisma/types";

const RepoRefactorsPage = async ({
  params,
}: {
  params: { owner: string; repo: string };
}) => {
  const { owner, repo } = params;
  const refactors: RefactoringType[] = await getRepoRefactors(owner, repo);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <div className="flex items-center flex-wrap gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {repo}
          </h1>
          <span className="text-xl text-muted-foreground">
            /refactors
          </span>
        </div>
        <p className="text-muted-foreground mt-1">
          Repository code refactoring history for {owner}/{repo}
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {refactors && refactors.length > 0 ? (
            <RefactorTable refactors={refactors} />
          ) : (
            <Alert>
              <RefreshCcw className="h-4 w-4" />
              <AlertTitle>No refactorings found</AlertTitle>
              <AlertDescription>
                No code refactorings have been performed on this repository yet.
                Go to the repository explorer to refactor files.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RepoRefactorsPage;