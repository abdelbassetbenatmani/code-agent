"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Check, ChevronsUpDown, PlusCircle, Users, Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateTeam from "../Teams/CreateTeam";
import useTeamStore from "@/lib/store/teams";
import { Session } from "@/prisma/types";
import { getTeams } from "@/app/lib/actions/teams";
import { getIconComponent } from "@/components/utils/getTeamIcon";
import { useDebounce } from "@/lib/hooks/useDebounce";

const TeamSwitcher = ({ session }: { session: Session }) => {
  const { teams, setTeams, setTeamId } = useTeamStore();
  // State for team switcher
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Apply debounce to search input (300ms delay)
  const debouncedSearchQuery = useDebounce<string>(searchInputValue, 300);

  // Filter teams based on debounced search
  const filteredTeams = debouncedSearchQuery
    ? teams.filter((team) =>
        team.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      )
    : teams;

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(e.target.value);
  };

  // fetch teams from store or session
  useEffect(() => {
    if (session) {
      getTeams().then((fetchedTeams) => {
        if (fetchedTeams.length > 0) {
          setTeams(fetchedTeams);
          setSelectedTeam(fetchedTeams[0]);
          setTeamId(fetchedTeams[0].id);
        }
      });
    }
  }, [session, setTeams, setTeamId]); // Only re-run when session or setTeams changes

  return (
    <div>
      {/* Team Switcher */}
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isSearchOpen}
            aria-label="Select a team"
            className="hidden md:flex h-9 w-64 ml-3 justify-between text-sm font-medium transition-all"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50 mr-2">
                {selectedTeam && getIconComponent(selectedTeam.icon)}
              </div>
              <span className="truncate">{selectedTeam?.name}</span>
            </div>
            <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search team..."
                className="h-8 border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                value={searchInputValue}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-0">
            {filteredTeams.length > 0 ? (
              <div className="grid gap-1 p-1">
                {filteredTeams.map((team) => (
                  <Button
                    key={team.id}
                    variant="ghost"
                    className="flex h-9 w-full items-center justify-between text-sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setTeamId(team.id);
                      setIsSearchOpen(false);
                      setSearchInputValue("");
                    }}
                  >
                    <div className="flex items-center min-w-0">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50 mr-2">
                        {getIconComponent(team.icon)}
                      </div>
                      <span className="truncate">{team.name}</span>
                    </div>
                    {selectedTeam?.id === team.id && (
                      <Check className="h-4 w-4 shrink-0 ml-2" />
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-2">
                <Users className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  {debouncedSearchQuery
                    ? "No matching teams found"
                    : "No teams available"}
                </p>
              </div>
            )}
          </div>
          <DropdownMenuSeparator className="my-0" />
          <div className="p-1">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDialogOpen(true);
                setIsSearchOpen(false);
              }}
              className="flex h-9 w-full items-center justify-start text-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create team
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Mobile team switcher remains the same */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9 p-0 flex items-center justify-center"
            aria-label="Select a team"
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50 ">
              {selectedTeam && getIconComponent(selectedTeam.icon)}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>Teams</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {teams.map((team) => (
            <DropdownMenuItem
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="cursor-pointer"
            >
              <div className="flex items-center">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50 mr-2">
                  {getIconComponent(team.icon)}
                </div>
                <span>{team.name}</span>
              </div>
              {selectedTeam?.id === team.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setIsDialogOpen(true);
              setIsSearchOpen(false);
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          // Optional: Close dropdowns when dialog closes
          if (!open) {
            setIsSearchOpen(false);
            setSearchInputValue("");
          }
        }}
      >
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Create a new team</DialogTitle>
            <DialogDescription>
              Add a new team to manage projects and collaborate with others.
            </DialogDescription>
          </DialogHeader>
          <CreateTeam setIsDialogOpen={setIsDialogOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamSwitcher;
