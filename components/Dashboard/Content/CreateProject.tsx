"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Github, Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { addRepoToProject, fetchRepos } from "@/app/lib/actions/github";
import { useSession } from "next-auth/react";
import useStore from "@/lib/store/store";



const CreateProject = ({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) => {
  const session = useSession();

  const [repos, setRepos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<string>("");

  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get addProject function from store
  const { addProject } = useStore();

  useEffect(() => {
    fetchGithubRepos();
  }, []);

  // When a repo is selected, pre-fill the form
  useEffect(() => {
    if (selectedRepo) {
      const repo = repos.find((r) => r.full_name === selectedRepo);
      if (repo) {
        setProjectName(repo.name);
        setProjectDescription(repo.description || "");
      }
    }
  }, [selectedRepo, repos]);

  const fetchGithubRepos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const response = await fetchRepos(session?.data?.accessToken || "");


      setRepos(response);
    } catch (err) {
      console.error("Error fetching repos:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch GitHub repositories"
      );

      // For demo purposes, add some mock repos if the API call fails
      setRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toast("Project name is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // get selected repo details
      const selectedRepoDetails = repos.find(
        (r) => r.full_name === selectedRepo
      );
      await addRepoToProject(
        selectedRepoDetails,
        session?.data?.user?.id ?? "",
        projectDescription || ""
      );

      toast("Project created successfully!");

      // Close the dialog
      onOpenChange(false);

      // Add project to store
      addProject({
        id: Date.now().toString(),
        name: projectName,
        description: projectDescription,
        createdAt: selectedRepoDetails?.created_at || "",
        lastUpdated: selectedRepoDetails?.updated_at || "",
        status: "active",
        languages: selectedRepoDetails?.language ? [selectedRepoDetails.language] : ["No language detected"],
      });

      // Reset the form
      setSelectedRepo("");
      setProjectName("");
      setProjectDescription("");
    } catch (err) {
      console.error("Error creating project:", err);
      toast("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto  py-8">
      {/* <Card className="max-w-2xl mx-auto"> */}
      <CardHeader>
        <CardTitle className="text-2xl">Create New Project</CardTitle>
        <CardDescription>
          Import a project from GitHub or create a new one from scratch
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* GitHub Repositories Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="repo-select">Import from GitHub</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={fetchGithubRepos}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>

            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger id="repo-select" className="w-full">
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Your repositories</SelectLabel>
                  {repos.map((repo) => (
                    <SelectItem key={repo.id} value={repo.full_name}>
                      <div className="flex items-center">
                        <span className="truncate">{repo.name}</span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({repo.language || "No language"})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {repos.length === 0 && !isLoading && !error && (
              <div className="text-center py-3 text-muted-foreground text-sm">
                No repositories found. Connect your GitHub account to import
                repositories.
              </div>
            )}
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project..."
              className="min-h-[100px]"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setSelectedRepo("");
              setProjectName("");
              setProjectDescription("");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !projectName.trim()}
            className="gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {selectedRepo ? (
              <>
                <Github className="h-4 w-4 mr-1" />
                Import Project
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </CardFooter>
      </form>
      {/* </Card> */}
    </div>
  );
};

export default CreateProject;
