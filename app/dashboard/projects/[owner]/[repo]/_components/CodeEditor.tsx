import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Eye, RefreshCcw } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { GitHubFile } from "@/app/lib/actions/github";
import { getLanguage } from "./getLanguage";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CodeEditor = (
    {
        selectedFile,
        fileContent,
        handleReviewCode,
        handleRefactorCode,
        activeTab,
        loading,
    }: {
        selectedFile: GitHubFile | null;
        fileContent: string;
        handleReviewCode: () => void;
        handleRefactorCode: () => void;
        activeTab: "review" | "refactor";
        loading: boolean;
    }
) => {
  return (
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
  );
};

export default CodeEditor;
