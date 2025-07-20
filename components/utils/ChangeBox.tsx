import { RefreshCcw } from "lucide-react";
import React from "react";

interface Change {
  type: "performance" | "readability" | "structure" | "security" | "other";
  description: string;
}

const ChangeBox = ({ change, index }: { change: Change; index: number }) => {
  return (
    <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
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
        <p className="text-sm text-muted-foreground">{change.description}</p>
      </div>
    </div>
  );
};

export default ChangeBox;
