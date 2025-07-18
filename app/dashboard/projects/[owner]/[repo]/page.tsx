"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Code, Eye, RefreshCcw, Github, X, Check } from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { useSession } from "next-auth/react";
import {
  fetchGithubFileContent,
  fetchRepoTree,
  GitHubFile,
} from "@/app/lib/actions/github";
import FileTree from "@/components/FileTree";
import { Skeleton } from "@/components/ui/skeleton";

function getLanguage(filename: string) {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
    case "cjs":
    case "mjs":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "html":
      return "html";
    case "css":
      return "css";
    default:
      return "text";
  }
}

const ProjectDetailsPage = () => {
  const { data } = useSession();
  const { owner, repo } = useParams();
  const [tree, setTree] = useState<GitHubFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<{
    summary: string;
    issues: { type: string; line: number; message: string }[];
    score: number;
  } | null>(null);
  const [refactoredCode, setRefactoredCode] = useState<string | null>(null);

  const [activeTab] = useState<"review" | "refactor">("review");

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
    const body = {
      code: fileContent,
    };

    setLoading(true);
    setReviewResult(null);
    setRefactoredCode(null);

    try {
      // Method 1: Using axios properly
      const response = await axios.post("/api/review", body, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Review Result:", response.data);
      setReviewResult(response.data);
    } catch (error) {
      console.error("Error during code review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefactorCode = () => {
    // Mock refactoring process
    // setLoading(true);
    // setTimeout(() => {
    //   // Simple mock refactoring by adding types and comments
    //   const refactored = selectedFile.content
    //     .replace("function App()", "function App(): JSX.Element")
    //     .replace(
    //       '<div className="App">',
    //       '// Main app container\n    <div className="App">'
    //     );
    //   setRefactoredCode(refactored);
    //   setLoading(false);
    // }, 2000);
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
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            {/* <h1 className="text-3xl font-bold tracking-tight">
              {projectData?.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {projectData?.description}
            </p> */}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              {/* {projectData?.repository} */}
            </Badge>
            {/* <Badge variant="secondary">{projectData?.language}</Badge> */}
          </div>
        </div>
      </div>

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
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-lg">
                    {selectedFile?.name || "Select a file"}
                  </CardTitle>
                  <CardDescription>
                    {selectedFile
                      ? `Path: ${selectedFile.path}`
                      : "Choose a file from the project tree to view its contents"}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleReviewCode}
                    disabled={!selectedFile || loading}
                    variant={activeTab === "review" ? "default" : "outline"}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button
                    onClick={handleRefactorCode}
                    disabled={!selectedFile || loading}
                    variant={activeTab === "refactor" ? "default" : "outline"}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Refactor
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {selectedFile ? (
                // <div className="border rounded-md overflow-hidden">
                <>
                  <SyntaxHighlighter
                    language={getLanguage(selectedFile.name)}
                    style={coldarkDark}
                    showLineNumbers
                    className="h-[500px] w-full"
                  >
                    {fileContent}
                  </SyntaxHighlighter>
                </>
              ) : (
                // </div>
                <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/50">
                  <div className="text-center text-muted-foreground">
                    <Code className="h-10 w-10 mb-2 mx-auto" />
                    <p>Select a file to view and analyze its code</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

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
                // Review Results
                reviewResult ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Summary</h3>
                      <p>{reviewResult.summary}</p>

                      <div className="mt-4 flex items-center gap-2">
                        <div className="text-sm font-medium">
                          Quality Score:
                        </div>
                        <Badge
                          variant="outline"
                          className={`${
                            reviewResult.score > 80
                              ? "bg-green-500/10 text-green-600"
                              : reviewResult.score > 60
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {reviewResult.score}/100
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3">Issues & Suggestions</h3>
                      <div className="space-y-2">
                         {reviewResult.issues.map(
                          (
                            issue: {
                              type:
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | Promise<
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactPortal
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                  >
                                | null
                                | undefined;
                              line:
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | Promise<
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactPortal
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                  >
                                | null
                                | undefined;
                              message:
                                | string
                                | number
                                | bigint
                                | boolean
                                | React.ReactElement<
                                    unknown,
                                    string | React.JSXElementConstructor<any>
                                  >
                                | Iterable<React.ReactNode>
                                | React.ReactPortal
                                | Promise<
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactPortal
                                    | React.ReactElement<
                                        unknown,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | null
                                    | undefined
                                  >
                                | null
                                | undefined;
                            },
                            index: React.Key | null | undefined
                          ) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-3 border rounded-md"
                            >
                              <div
                                className={`p-1 rounded-full ${
                                  issue.type === "improvement"
                                    ? "bg-blue-100 text-blue-600"
                                    : issue.type === "warning"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {issue.type === "improvement" ? (
                                  <RefreshCcw className="h-4 w-4" />
                                ) : issue.type === "warning" ? (
                                  <X className="h-4 w-4" />
                                ) : (
                                  <Check className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium flex items-center gap-2">
                                  <span className="capitalize">
                                    {issue.type}
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    Line {issue.line}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {issue.message}
                                </p>
                              </div>
                            </div>
                          )
                        )}{" "}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-center">
                    <div className="text-muted-foreground">
                      <Eye className="h-10 w-10 mb-2 mx-auto" />
                      <p>Click the Review button to analyze your code</p>
                    </div>
                  </div>
                )
              ) : // Refactored Code
              refactoredCode ? (
                <div className="border rounded-md overflow-hidden">
                  <ScrollArea className="h-[350px] w-full">
                    <>{refactoredCode}</>
                  </ScrollArea>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-center">
                  <div className="text-muted-foreground">
                    <RefreshCcw className="h-10 w-10 mb-2 mx-auto" />
                    <p>Click the Refactor button to improve your code</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
