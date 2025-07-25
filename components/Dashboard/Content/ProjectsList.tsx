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
  RefreshCcw,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Card,
  CardDescription,
  // CardFooter,
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
import Link from "next/link";
import { cn } from "@/lib/utils";
import { deleteRepoProject } from "@/app/lib/actions/github";
import CreateProject from "./CreateProject";
import { formatDistanceToNow } from "@/lib/formatDate";
import { getTeamMembers } from "@/app/lib/actions/teamMember";
import { sendNotiificationToMultipleUsers } from "@/app/lib/actions/notifications";
import useTeamStore from "@/lib/store/teams";
import { useSession } from "next-auth/react";

const ProjectsList = () => {
  const { team, teamId } = useTeamStore();
  const session = useSession();
  const { viewMode, getFilteredProjects, deleteProject } = useStore();
  const projects = getFilteredProjects();
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="mt-8 p-8 bg-muted/30 rounded-lg text-center flex flex-col items-center">
        <h3 className="text-xl font-medium">No projects found</h3>
        <p className="text-muted-foreground mt-2">
          Try adjusting your filters or create a new project.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="h-10 mt-5 px-3 flex items-center gap-1.5  justify-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Create New Project</span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Git Repository</DialogTitle>
              <CreateProject onOpenChange={setOpen} />
            </DialogHeader>
          </DialogContent>
        </Dialog>
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
      deleteProject(projectToDelete);

      // Notify team members about the deleted project
      if (team && team.name !== "Personal") {
        const teamMembers = await getTeamMembers(teamId as string);
        const userIds = teamMembers.map((member) => member.userId);

        // Notify team members about the deleted project
        sendNotiificationToMultipleUsers({
          userIds,
          type: "REPO_DELETE",
          title: "Project Deleted",
          message: `The user ${session?.data?.user?.name} has deleted a project. If you have any questions, please contact support.`,
        }).catch((err) => {
          console.error("Failed to send notifications:", err);
        });
      }

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
    ? projects.find((p) => p.id === projectToDelete)
    : null;

  if (viewMode === "grid") {
    return (
      <>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden border border-border/40 bg-background transition-all hover:shadow-md dark:bg-[#0d1117] dark:hover:bg-[#161b22] dark:border-[#30363d] dark:shadow-lg dark:hover:shadow-indigo-500/10"
            >
              {/* Top accent bar - varies by primary language */}
              <div
                className={cn(
                  "h-1 w-full",
                  project.languages?.[0] === "JavaScript" && "bg-yellow-400",
                  project.languages?.[0] === "TypeScript" && "bg-blue-500",
                  project.languages?.[0] === "Python" && "bg-green-500",
                  project.languages?.[0] === "Java" && "bg-orange-600",
                  project.languages?.[0] === "C#" && "bg-purple-600",
                  !project.languages?.[0] && "bg-gray-400"
                )}
              />

              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg font-semibold flex items-center group-hover:text-primary transition-colors">
                      <span className="mr-2.5 flex items-center justify-center bg-muted/80 dark:bg-slate-800/60 rounded-md p-2 group-hover:bg-muted/50 dark:group-hover:bg-slate-800 transition-colors">
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
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/projects/${project.owner}/${project.name}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View details</span>
                        </Link>
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
                        className="flex items-center text-xs bg-muted/40 dark:bg-slate-800/60 px-2 py-1 rounded-full text-muted-foreground"
                      >
                        <span
                          className={`h-2.5 w-2.5 rounded-full mr-1.5 ${langColor}`}
                        ></span>
                        {lang}
                      </div>
                    );
                  })}
                  {!project.languages?.length && (
                    <div className="text-xs bg-muted/40 dark:bg-slate-800/60 px-2 py-1 rounded-full text-muted-foreground">
                      No languages specified
                    </div>
                  )}
                </div>

                {/* Activity metrics - added review and refactor counts */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="flex flex-col items-center justify-center p-2 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                    <div className="flex items-center justify-center mb-1 w-full">
                      <div
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full mr-1",
                          project.status === "public"
                            ? "bg-green-500"
                            : project.status === "private"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        )}
                      ></div>
                      <span className="capitalize text-muted-foreground truncate">
                        {project.status}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">
                      Status
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                    <div className="flex items-center justify-center mb-1 w-full">
                      <Calendar className="h-3 w-3 mr-1 shrink-0 text-muted-foreground" />
                      <span
                        className="text-muted-foreground truncate"
                        title={formatDistanceToNow(
                          new Date(project.lastUpdated)
                        )}
                      >
                        {formatDistanceToNow(new Date(project.lastUpdated))}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">
                      Updated
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-3 w-3 mr-1 shrink-0 text-blue-500" />
                      <span className="text-muted-foreground">
                        {project.reviewCount || 0}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">
                      Reviews
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                    <div className="flex items-center justify-center mb-1">
                      <RefreshCcw className="h-3 w-3 mr-1 shrink-0 text-purple-500" />
                      <span className="text-muted-foreground">
                        {project.refactorCount || 0}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground/70">
                      Refactors
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                  >
                    <Link
                      href={`/dashboard/projects/${project.owner}/${project.name}`}
                      className="flex items-center justify-center"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5" />
                      View Project
                    </Link>
                  </Button>

                  <div className="flex gap-1">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-muted-foreground/20 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700"
                    >
                      <Link
                        href={`/dashboard/projects/${project.owner}/${project.name}/reviews`}
                        className="flex items-center justify-center"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="border-muted-foreground/20 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700"
                    >
                      <Link
                        href={`/dashboard/projects/${project.owner}/${project.name}/refactors`}
                        className="flex items-center justify-center"
                      >
                        <RefreshCcw className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
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
              className="group overflow-hidden transition-all hover:shadow-md border border-border/40 bg-background dark:bg-[#0d1117] dark:hover:bg-[#161b22] dark:border-[#30363d] dark:shadow-lg dark:hover:shadow-indigo-500/10"
            >
              <div className="flex flex-col md:flex-row">
                {/* Left side with GitHub logo and language indicator */}
                <div className="relative md:w-48 h-32 md:h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  {/* Language-specific colored accent bar */}
                  <div
                    className={cn(
                      "absolute top-0 left-0 w-1 md:w-full md:h-1 h-full",
                      project.languages?.[0] === "JavaScript" &&
                        "bg-yellow-400",
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
                <div className="flex-1 p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-lg font-semibold mb-1 flex items-center group-hover:text-primary transition-colors">
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
                              {formatDistanceToNow(
                                new Date(project.lastUpdated)
                              )}{" "}
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
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/projects/${project.owner}/${project.name}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View details</span>
                            </Link>
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

                    <div className="space-y-4">
                      {/* Project description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description || "No description provided"}
                      </p>

                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Tech stack with GitHub style colored dots */}
                        <div className="flex flex-wrap gap-1.5">
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
                                className="flex items-center text-xs bg-muted/40 dark:bg-slate-800/60 px-2 py-1 rounded-full text-muted-foreground"
                              >
                                <span
                                  className={`h-2.5 w-2.5 rounded-full mr-1.5 ${langColor}`}
                                ></span>
                                {lang}
                              </div>
                            );
                          })}
                          {!project.languages?.length && (
                            <div className="text-xs bg-muted/40 dark:bg-slate-800/60 px-2 py-1 rounded-full text-muted-foreground">
                              No languages specified
                            </div>
                          )}
                        </div>

                        {/* Activity metrics for list view - more compact */}
                        <div className="flex gap-3 text-xs ml-auto">
                          <div className="flex items-center px-2 py-1 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                            <Eye className="h-3 w-3 mr-1.5 text-blue-500" />
                            <span className="text-muted-foreground">
                              {0} Reviews
                            </span>
                          </div>
                          <div className="flex items-center px-2 py-1 bg-muted/30 dark:bg-slate-800/40 rounded-md">
                            <RefreshCcw className="h-3 w-3 mr-1.5 text-purple-500" />
                            <span className="text-muted-foreground">
                              {0} Refactors
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Button
                          asChild
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                        >
                          <Link
                            href={`/dashboard/projects/${project.owner}/${project.name}`}
                            className="flex items-center justify-center"
                          >
                            <Eye className="mr-2 h-3.5 w-3.5" />
                            View Project
                          </Link>
                        </Button>

                        <div className="flex gap-1">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-muted-foreground/20 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700"
                          >
                            <Link
                              href={`/dashboard/projects/${project.owner}/${project.name}/reviews`}
                              className="flex items-center justify-center"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>

                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-muted-foreground/20 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:border-slate-700"
                          >
                            <Link
                              href={`/dashboard/projects/${project.owner}/${project.name}/refactors`}
                              className="flex items-center justify-center"
                            >
                              <RefreshCcw className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
