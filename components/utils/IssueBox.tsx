import React from "react";
import { Badge } from "../ui/badge";
import { Check, RefreshCcw, X } from "lucide-react";

interface Issue {
  type: "improvement" | "warning" | "error";
  line: number;
  message: string;
}

const IssueBox = ({ issue, index }: { issue: Issue; index: number }) => {
  return (
    <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
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
          <span className="capitalize">{issue.type}</span>
          <Badge variant="outline" className="text-xs">
            Line {issue.line}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{issue.message}</p>
      </div>
    </div>
  );
};

export default IssueBox;
