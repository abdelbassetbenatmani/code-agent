"use client";
import React, { useState } from "react";
import useStore from "@/lib/store/store";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Edit,
  Eye,
  Github,
  MoreHorizontal,
  Trash,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteRepoProject } from "@/app/lib/actions/github";

const ProjectsList = () => {
  const { viewMode, getFilteredProjects, deleteProject } = useStore();
  const projects = getFilteredProjects();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="mt-8 p-8 bg-muted/30 rounded-lg text-center">
        <h3 className="text-xl font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or create a new project.
        </p>
        <Button className="mt-4">Create Project</Button>
      </div>
    );
  }

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    
    try {
      await deleteRepoProject(Number(projectToDelete));
      console.log("Project deleted successfully");
      deleteProject(projectToDelete);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const projectToDeleteDetails = projectToDelete 
    ? projects.find(p => p.id === projectToDelete) 
    : null;

  if (viewMode === "grid") {
    return (
      <>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border-0 bg-card/50 transition-all hover:shadow-lg hover:bg-card dark:bg-[#0d1117] dark:hover:bg-[#161b22] dark:border-[#30363d]"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold flex items-center">
                      <span className="mr-2 flex items-center justify-center bg-muted rounded-md p-2">
                        <Github className="h-5 w-5" />
                      </span>
                      {project.name}
                    </CardTitle>
                    <CardDescription>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {project.description || "No description provided"}
                      </p>
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-50 hover:opacity-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDeleteClick(project.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Tech stack badges with GitHub style */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.languages?.map((lang) => {
                    // Define language-specific colors
                    const langColor =
                      lang === "JavaScript"
                        ? "bg-yellow-400"
                        : lang === "TypeScript"
                        ? "bg-blue-500"
                        : lang === "Python"
                        ? "bg-green-500"
                        : lang === "Java"
                        ? "bg-orange-600"
                        : lang === "C#"
                        ? "bg-purple-600"
                        : "bg-gray-400";

                    return (
                      <div
                        key={lang}
                        className="flex items-center text-xs text-muted-foreground"
                      >
                        <span
                          className={`h-3 w-3 rounded-full mr-1.5 ${langColor}`}
                        ></span>
                        {lang}
                      </div>
                    );
                  })}
                  {!project.languages?.length && (
                    <div className="text-xs text-muted-foreground">
                      No languages specified
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  {/* Status badge GitHub style */}
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full mr-1.5",
                        project.status === "public"
                          ? "bg-green-500"
                          : project.status === "private"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      )}
                    ></div>
                    <span className="capitalize">{project.status}</span>
                  </div>

                  {/* Created time */}
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>
                      Updated {formatDistanceToNow(new Date(project.createdAt))}{" "}
                      ago
                    </span>
                  </div>
                </div>

                <CardFooter className="px-0 pt-4 pb-0">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full border-muted-foreground/20 hover:bg-secondary/80"
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center justify-center"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      View Project
                    </Link>
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirm Delete
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the project{" "}
                <span className="font-semibold">
                  {projectToDeleteDetails?.name}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  } else {
    // List view
    return (
      <>
        <div className="mt-8 space-y-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden transition-all hover:shadow-md border-0 bg-card/50 dark:bg-[#0d1117] dark:hover:bg-[#161b22] dark:border-[#30363d]"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side with GitHub logo and language indicator */}
                <div className="relative md:w-48 h-32 md:h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  {/* Language-specific colored accent bar */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-1 md:w-full md:h-1 h-full",
                      project.languages?.[0] === "JavaScript" && "bg-yellow-400",
                      project.languages?.[0] === "TypeScript" && "bg-blue-500",
                      project.languages?.[0] === "Python" && "bg-green-500",
                      project.languages?.[0] === "Java" && "bg-orange-600",
                      project.languages?.[0] === "C#" && "bg-purple-600",
                      !project.languages?.[0] && "bg-gray-400"
                    )}
                  />

                  <div className="flex h-full w-full items-center justify-center p-4">
                    {/* GitHub logo */}
                    <div className="h-16 w-16 opacity-20 group-hover:opacity-30 transition-opacity">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        className="h-full w-full"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                    <div className="flex items-center px-2 py-1 rounded-full bg-card/70 dark:bg-[#161b22]/70 text-xs">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mr-1.5",
                          project.status === "public"
                            ? "bg-green-500"
                            : project.status === "private"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        )}
                      ></div>
                      <span className="capitalize text-muted-foreground">
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side with project details */}
                <CardContent className="flex-1 p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-lg font-semibold mb-1 flex items-center">
                          {project.name}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-3 text-xs">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>
                              Created{" "}
                              {formatDistanceToNow(new Date(project.createdAt))}{" "}
                              ago
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>
                              Updated{" "}
                              {formatDistanceToNow(new Date(project.lastUpdated))}{" "}
                              ago
                            </span>
                          </div>
                        </CardDescription>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-50 hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit project</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(project.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-4">
                      {/* Project description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description provided"}
                      </p>

                      {/* Tech stack with GitHub style colored dots */}
                      <div className="flex flex-wrap gap-2">
                        {project.languages?.map((lang) => {
                          // Define language-specific colors
                          const langColor =
                            lang === "JavaScript"
                              ? "bg-yellow-400"
                              : lang === "TypeScript"
                              ? "bg-blue-500"
                              : lang === "Python"
                              ? "bg-green-500"
                              : lang === "Java"
                              ? "bg-orange-600"
                              : lang === "C#"
                              ? "bg-purple-600"
                              : "bg-gray-400";

                          return (
                            <div
                              key={lang}
                              className="flex items-center text-xs text-muted-foreground"
                            >
                              <span
                                className={`h-3 w-3 rounded-full mr-1.5 ${langColor}`}
                              ></span>
                              {lang}
                            </div>
                          );
                        })}
                        {!project.languages?.length && (
                          <div className="text-xs text-muted-foreground">
                            No languages specified
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-muted-foreground/20 hover:bg-secondary/80"
                        >
                          <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center"
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View Project
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Delete Confirmation Dialog - shared between views */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirm Delete
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the project{" "}
                <span className="font-semibold">
                  {projectToDeleteDetails?.name}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:justify-end">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }
};

export default ProjectsList;