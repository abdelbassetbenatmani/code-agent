"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

import { useSession } from "next-auth/react";
import {
  fetchGithubFileContent,
  fetchRepoTree,
  GitHubFile,
} from "@/app/lib/actions/github";
import FileTree from "@/components/FileTree";
import { Skeleton } from "@/components/ui/skeleton";
import { saveRefactorCode, saveReviewCode } from "@/app/lib/actions/code";
import ProjectHeader from "./_components/ProjectHeader";
import CodeEditor from "./_components/CodeEditor";
import { ReviewResults } from "./_components/ReviewResult";
import { RefactoredCodeResults } from "./_components/RefactoredCodeResults";

const ProjectDetailsPage = () => {
  const { data } = useSession();
  const { owner, repo } = useParams();
  const [tree, setTree] = useState<GitHubFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    summary: string;
    issues: {
      type: "improvement" | "warning" | "error";
      line: number;
      message: string;
    }[];
    score: number;
  } | null>(null);
  const [refactoredCode, setRefactoredCode] = useState<{
    refactored: string;
    changes: {
      type: "performance" | "readability" | "structure" | "security" | "other";
      description: string;
    }[];
    summary: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"review" | "refactor">("review");

  useEffect(() => {
    const loadTree = async () => {
      setLoading(true); // Show loading state while fetching

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (data?.accessToken) {
        try {
          if (typeof owner === "string" && typeof repo === "string") {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const tree = await fetchRepoTree(data?.accessToken, owner, repo);
            setTree(tree);
          } else {
            console.error("Owner or repo is undefined or not a string");
            setTree([]);
          }
        } catch (error) {
          console.error("Error loading repository tree:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadTree();
  }, [
    owner,
    repo,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data?.accessToken,
  ]);

  const handleFileClick = async (file: GitHubFile) => {
    setSelectedFile(file);
    setLoading(true);
    const content = await fetchGithubFileContent(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      data?.accessToken,
      owner as string,
      repo as string,
      file.path
    );
    setFileContent(content);
    setLoading(false);
  };

  const handleReviewCode = async () => {
    if (!fileContent) {
      console.error("No file content to review");
      return;
    }

    const body = {
      code: fileContent,
    };

    setLoading(true);
    setReviewResult(null);
    setRefactoredCode(null);
    setActiveTab("review");

    try {
      // Method 1: Using axios properly
      const response = await axios.post("/api/review", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setReviewResult(response.data);

      // save the review to the database
      if (data?.user?.id && selectedFile) {
        const review = {
          summary: response.data.summary,
          issues: response.data.issues,
          score: response.data.score,
        };

        await saveReviewCode(
          data.user.id,
          data?.user?.name as string,
          {
            name: repo as string,
            ownerLogin: owner as string,
            path: selectedFile.path || "",
          },
          selectedFile.name,
          review,
          fileContent
        );
      }
    } catch (error) {
      console.error("Error during code review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefactorCode = () => {
    if (!fileContent) {
      console.error("No file content to refactor");
      return;
    }
    const body = {
      code: fileContent,
    };

    setLoading(true);
    setReviewResult(null);
    setRefactoredCode(null);
    setActiveTab("refactor");

    axios
      .post("/api/refactoring", body, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(async (response) => {
        setRefactoredCode(response.data);

        // Save the refactored code to the database
        if (data?.user?.id && selectedFile) {
          const refactorData = {
            refactored: response.data.refactored,
            changes: response.data.changes,
            summary: response.data.summary,
          };

          await saveRefactorCode(
            data.user.id,
            data?.user?.name as string,
            {
              name: repo as string,
              ownerLogin: owner as string,
              path: selectedFile.path || "",
            },
            selectedFile.name,
            refactorData.refactored || "",
            fileContent,
            refactorData.summary,
            refactorData.changes
          );
        }
      })
      .catch((error) => {
        console.error("Error during code refactoring:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (loading && !selectedFile) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading project details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <ProjectHeader owner={owner as string} repo={repo as string} />
      {/* Main content grid - 3 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. GitHub Project Folder */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">Project Files</CardTitle>
            <CardDescription>Browse repository files</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <FileTree tree={tree} onFileClick={handleFileClick} />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* 2 & 3. Code Editor & Results Section */}
        <div className="lg:col-span-9 space-y-6">
          {/* 2. Code Editor with Action Buttons */}
          <CodeEditor
            selectedFile={selectedFile}
            fileContent={fileContent}
            handleReviewCode={handleReviewCode}
            handleRefactorCode={handleRefactorCode}
            activeTab={activeTab}
            loading={loading}
          />

          {/* 3. Results Section: Review or Refactored Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {activeTab === "review"
                  ? "Code Review Results"
                  : "Refactored Code"}
              </CardTitle>
              <CardDescription>
                {activeTab === "review"
                  ? "AI-powered analysis of code quality and suggestions"
                  : "Improved version of your code with better practices"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ) : activeTab === "review" ? (
                <ReviewResults reviewResult={reviewResult} />
              ) : (
                <RefactoredCodeResults
                  refactoredCode={refactoredCode}
                  selectedFile={selectedFile}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
