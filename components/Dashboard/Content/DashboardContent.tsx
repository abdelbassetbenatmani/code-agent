"use client";
import React, { useEffect } from "react";
import ProjectsList from "./ProjectsList";
import FilterBar from "./FilterBar";
import useStore, { Project } from "@/lib/store/store";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { fetchUserRepos } from "@/app/lib/actions/github";

const DashboardContent = () => {
  const session = useSession();

  const {
    setProjects,
    isLoading,
    error,
    setSearchTerm,
    setSortOption,
    setViewMode,
    setSelectedDate,
  } = useStore();

  // Fetch projects on component mount
  useEffect(() => {
    // Only fetch repos when session is loaded and we have a user ID
    if (session.status === "authenticated" && session.data?.user?.id) {
      const userId = session.data.user.id;


      fetchUserRepos(userId)
        .then((repos) => {
          // map repos to projects format
          const projects: Project[] = repos.map((repo) => ({
            id: repo.id.toString(),
            name: repo.name,
            owner: repo.ownerLogin,
            description: repo.description || "",
            createdAt: repo.createdAt,
            lastUpdated: repo.updatedAt,
            status: repo.private ? "private" : "public",
            languages: repo.language ? [repo.language] : [],
            reviewCount: repo.reviewCount || 0,
            refactorCount: repo.refactorCount || 0,
          }));

          setProjects(projects);
        })
        .catch((err) => {
          console.error("Error fetching repos:", err);
        })
        
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status, session.data?.user?.id]);

  return (
    <div className="container mx-auto px-4 pt-8 lg:pt-12">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>

      <FilterBar
        onSearch={(term) => setSearchTerm(term)}
        onSortChange={(option) => setSortOption(option)}
        onViewChange={(view) => setViewMode(view)}
        onDateChange={(date) => setSelectedDate(date)}
      />

      {isLoading && (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-lg shadow-sm overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 border border-destructive rounded-md bg-destructive/10 text-destructive">
          <p>Failed to load projects: {error}</p>
          <button
            className="mt-2 text-sm underline"
            // onClick={() => fetchProjects(
            //   session.data?.user?.id || "default-user-id" // Replace with actual user ID
            // )}
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && <ProjectsList />}
    </div>
  );
};

export default DashboardContent;
