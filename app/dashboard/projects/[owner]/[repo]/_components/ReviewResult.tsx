import { Badge } from "@/components/ui/badge";
import IssueCard from "@/components/utils/IssueCard";
// import IssueBox from "@/components/utils/issueBox";
import { Eye } from "lucide-react";


interface ReviewResult {
  summary: string;
  issues: {
    type: "improvement" | "warning" | "error";
    line: number;
    message: string;
  }[];
  score: number;
}

export const ReviewResults = ({
  reviewResult,
}: {
  reviewResult: ReviewResult | null;
}) => {
  if (!reviewResult) {
    return (
      <div className="h-[300px] flex items-center justify-center text-center">
        <div className="text-muted-foreground">
          <Eye className="h-10 w-10 mb-2 mx-auto" />
          <p>Click the Review button to analyze your code</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-md">
        <h3 className="font-medium mb-2">Summary</h3>
        <p>{reviewResult.summary}</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="text-sm font-medium">Quality Score:</div>
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
          {reviewResult.issues.map((issue, index) => (
            <IssueCard
              key={index}
              issue={{
                type: issue.type,
                line: issue.line,
                message: issue.message,
              }}
              index={index}
            />
            
          ))}
        </div>
      </div>
    </div>
  );
};
