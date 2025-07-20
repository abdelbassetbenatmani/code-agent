import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCcw } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { getLanguage } from "./getLanguage";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { GitHubFile } from "@/app/lib/actions/github";
import ChangeBox from "@/components/utils/ChangeBox";

interface RefactoredCode {
  refactored: string;
  changes: {
    type: "performance" | "readability" | "structure" | "security" | "other";
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
            <ChangeBox
              key={index}
              change={{
                type: change.type,
                description: change.description,
              }}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
