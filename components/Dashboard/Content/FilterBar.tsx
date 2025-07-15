"use client";

import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useStore, { SortOption, ViewMode } from "@/lib/store/store";
import CreateProject from "./CreateProject";
import { useState } from "react";

interface FilterBarProps {
  onSearch?: (term: string) => void;
  onSortChange?: (option: SortOption) => void;
  onViewChange?: (view: ViewMode) => void;
  onDateChange?: (date: Date | undefined) => void;
  className?: string;
}

export default function FilterBar({
  onSearch,
  onSortChange,
  onViewChange,
  onDateChange,
  className,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  // Get state and actions from the store
  const {
    searchTerm,
    viewMode,
    sortOption,
    activeFilters,
    setSearchTerm,
    setViewMode,
    setSortOption,
    removeFilter,
    clearAllFilters,
  } = useStore();

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  // Handle view mode changes
  const handleViewChange = (value: string) => {
    if (!value) return;
    const newView = value as ViewMode;
    setViewMode(newView);
    onViewChange?.(newView);
  };

  // Handle sort changes
  const handleSortChange = (value: SortOption) => {
    setSortOption(value);
    onSortChange?.(value);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Top row with search and filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-9 pr-4 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-4" align="end">
              <div className="space-y-4">
                {/* Sort options */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Sort by</h4>
                  <RadioGroup
                    value={sortOption}
                    onValueChange={(value) =>
                      handleSortChange(value as SortOption)
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name-asc" id="name-asc" />
                      <Label htmlFor="name-asc">Name (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="name-desc" id="name-desc" />
                      <Label htmlFor="name-desc">Name (Z-A)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="date-new" id="date-new" />
                      <Label htmlFor="date-new">Newest first</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="date-old" id="date-old" />
                      <Label htmlFor="date-old">Oldest first</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Clear filters button */}
                {activeFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      clearAllFilters();
                      onSearch?.("");
                      onSortChange?.("name-asc");
                      onDateChange?.(undefined);
                    }}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* View Toggle */}
          <TooltipProvider>
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={handleViewChange}
              className="border rounded-md"
            >
              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="grid" aria-label="Grid view">
                    <Grid className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Grid view</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value="list" aria-label="List view">
                    <List className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>List view</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </TooltipProvider>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="h-10 px-3 flex items-center gap-1.5  justify-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
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
      </div>

      {/* Active filters display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter) => {
            const [type, value] = filter.split(":");
            return (
              <Badge
                key={filter}
                variant="secondary"
                className="flex items-center gap-1 pl-2 pr-1 py-1.5"
              >
                <span className="text-xs">{value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 rounded-full"
                  onClick={() => {
                    removeFilter(filter);
                    if (type === "sort") {
                      onSortChange?.("name-asc");
                    } else if (type === "date") {
                      onDateChange?.(undefined);
                    }
                  }}
                >
                  <span className="sr-only">Remove {type} filter</span>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground"
            onClick={() => {
              clearAllFilters();
              onSearch?.("");
              onSortChange?.("name-asc");
              onDateChange?.(undefined);
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

// X icon component
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
