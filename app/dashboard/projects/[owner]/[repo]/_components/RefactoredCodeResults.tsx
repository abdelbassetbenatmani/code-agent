import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { getLanguage } from "./getLanguage";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GitHubFile } from "@/app/lib/actions/github";

interface RefactoredCode {
  refactored: string;
  changes: {
    type: string;
    description: string;
  }[];
  summary: string;
}

// Component for refactored code results
export const RefactoredCodeResults = ({
  refactoredCode,
  selectedFile,
}: {
  refactoredCode: RefactoredCode | null;
  selectedFile: GitHubFile | null;
}) => {
  if (!refactoredCode) {
    return (
      <div className="h-[300px] flex items-center justify-center text-center">
        <div className="text-muted-foreground">
          <RefreshCcw className="h-10 w-10 mb-2 mx-auto" />
          <p>Click the Refactor button to improve your code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Summary</h3>
        <p>{refactoredCode.summary}</p>
      </div>

      <div className="border rounded-md overflow-hidden">
        <ScrollArea className="h-[350px] w-full">
          <SyntaxHighlighter
            language={
              selectedFile ? getLanguage(selectedFile.name) : "typescript"
            }
            style={coldarkDark}
            showLineNumbers
          >
            {refactoredCode.refactored}
          </SyntaxHighlighter>
        </ScrollArea>
      </div>

      <div>
        <h3 className="font-medium mb-3">Changes Made</h3>
        <div className="space-y-2">
          {refactoredCode.changes.map((change, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 border rounded-md"
            >
              <div
                className={`p-1 rounded-full ${
                  change.type === "performance"
                    ? "bg-purple-100 text-purple-600"
                    : change.type === "readability"
                    ? "bg-blue-100 text-blue-600"
                    : change.type === "structure"
                    ? "bg-green-100 text-green-600"
                    : change.type === "security"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <RefreshCcw className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">
                  <span className="capitalize">{change.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {change.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
