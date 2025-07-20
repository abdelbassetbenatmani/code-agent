import React from 'react'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Github } from "lucide-react";
import Link from "next/link";

// Project Header
type ProjectHeaderProps = {
  owner: string;
  repo: string;
};

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ owner, repo }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          {/* back to dashboard */}
          <Button
            variant="outline"
            // className="mb-4"
          >
            <Link href="/dashboard" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Github className="h-3.5 w-3.5" />
            {owner}/{repo}
          </Badge>
        
        </div>
      </div>
    </div>
  );
}

export default ProjectHeader