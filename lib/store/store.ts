import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define types
export type ViewMode = "grid" | "list";
export type SortOption = "name-asc" | "name-desc" | "date-new" | "date-old";

export interface Project {
  id: string;
  name: string;
  owner: string; // Assuming owner is a string, adjust if needed
  description: string;
  reviewCount: number;
  refactorCount: number;
  createdAt: Date;
  lastUpdated: Date;
  status: "private" | "public" | "active";
  languages?: string[];
}

// Define the filter store slice
interface FilterState {
  searchTerm: string;
  viewMode: ViewMode;
  sortOption: SortOption;
  activeFilters: string[];
  selectedDate?: Date;

  // Actions
  setSearchTerm: (term: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortOption: (option: SortOption) => void;
  updateActiveFilter: (type: string, value: string) => void;
  removeFilter: (filter: string) => void;
  clearAllFilters: () => void;
  setSelectedDate: (date: Date | undefined) => void;
}

// Define the projects store slice
interface ProjectsState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  // Actions
  // fetchProjects: (userId: string) => Promise<void>;
  addProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
  editProject: (projectId: string, updatedProject: Partial<Project>) => void;
  setProjects: (projects: Project[]) => void;
  getFilteredProjects: () => Project[];
}

// Combined store type
interface StoreState extends FilterState, ProjectsState {}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Filter state
      searchTerm: "",
      viewMode: "grid",
      sortOption: "name-asc",
      activeFilters: [],
      selectedDate: undefined,

      // Projects state
      projects: [],
      isLoading: false,
      error: null,

      // Filter actions
      setSearchTerm: (term) => set({ searchTerm: term }),

      setViewMode: (mode) => set({ viewMode: mode }),

      setSortOption: (option) =>
        set((state) => {
          // Update sort option
          let filterLabel = "";
          switch (option) {
            case "name-asc":
              filterLabel = "Name (A-Z)";
              break;
            case "name-desc":
              filterLabel = "Name (Z-A)";
              break;
            case "date-new":
              filterLabel = "Newest First";
              break;
            case "date-old":
              filterLabel = "Oldest First";
              break;
          }

          // Update active filters
          const filtered = state.activeFilters.filter(
            (item) => !item.startsWith("sort:")
          );
          return {
            sortOption: option,
            activeFilters: [...filtered, `sort:${filterLabel}`],
          };
        }),

      updateActiveFilter: (type, value) =>
        set((state) => {
          // Remove existing filter of same type
          const filtered = state.activeFilters.filter(
            (item) => !item.startsWith(`${type}:`)
          );
          // Add new filter
          return { activeFilters: [...filtered, `${type}:${value}`] };
        }),

      removeFilter: (filter) =>
        set((state) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [type, _] = filter.split(":");

          if (type === "sort") {
            // Reset sort to default
            return {
              sortOption: "name-asc",
              activeFilters: state.activeFilters.filter(
                (item) => item !== filter
              ),
            };
          } else if (type === "date") {
            return {
              selectedDate: undefined,
              activeFilters: state.activeFilters.filter(
                (item) => item !== filter
              ),
            };
          }

          return {
            activeFilters: state.activeFilters.filter(
              (item) => item !== filter
            ),
          };
        }),

      clearAllFilters: () =>
        set({
          searchTerm: "",
          sortOption: "name-asc",
          selectedDate: undefined,
          activeFilters: [],
        }),

      setSelectedDate: (date) =>
        set((state) => {
          if (date) {
            const dateString = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            // Remove any existing date filter
            const filtered = state.activeFilters.filter(
              (item) => !item.startsWith("date:")
            );

            return {
              selectedDate: date,
              activeFilters: [...filtered, `date:${dateString}`],
            };
          } else {
            return {
              selectedDate: undefined,
              activeFilters: state.activeFilters.filter(
                (item) => !item.startsWith("date:")
              ),
            };
          }
        }),

      // Projects actions
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({
          projects: [...state.projects, project],
        })),
      deleteProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== projectId),
        })),
      editProject: (projectId, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId ? { ...p, ...updatedProject } : p
          ),
        })),

      getFilteredProjects: () => {
        const { projects, searchTerm, sortOption, selectedDate } = get();
        console.log("Current Projects:", projects);

        // First, filter projects
        let filteredProjects = [...projects];

        // Apply search term filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          filteredProjects = filteredProjects.filter(
            (project) =>
              project.name.toLowerCase().includes(searchLower) ||
              project.description.toLowerCase().includes(searchLower) ||
              project?.languages?.some((language) =>
                language.toLowerCase().includes(searchLower)
              )
          );
        }

        // Apply date filter
        if (selectedDate) {
          const selectedDateStr = selectedDate.toISOString().split("T")[0];
          filteredProjects = filteredProjects.filter((project) => {
            const createdDateStr = new Date(project.createdAt)
              .toISOString()
              .split("T")[0];
            return createdDateStr === selectedDateStr;
          });
        }

        // Then, sort the filtered projects
        switch (sortOption) {
          case "name-asc":
            filteredProjects.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            filteredProjects.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "date-new":
            filteredProjects.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          case "date-old":
            filteredProjects.sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
            break;
        }

        return filteredProjects;
      },
    }),
    {
      name: "projects-storage", // Name for localStorage
      partialize: (state) => ({ projects: state.projects }), // Only persist the projects array
    }
  )
);

export default useStore;
