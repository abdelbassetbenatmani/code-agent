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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Users,
  Search,
  UserPlus,
} from "lucide-react";
import { JSX, useState } from "react";
const TeamSwitcher = ({ teams }: { teams: Array<{ id: string; name: string; icon: JSX.Element }> }) => {
  // State for team switcher
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  // Filter teams based on search
  const filteredTeams = searchQuery
    ? teams.filter((team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : teams;
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
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50">
                {selectedTeam.icon}
              </div>
              <span className="truncate">{selectedTeam.name}</span>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                    className="flex h-9 w-full items-center justify-start text-sm"
                    onClick={() => {
                      setSelectedTeam(team);
                      setIsSearchOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border bg-accent/50 mr-2">
                      {team.icon}
                    </div>
                    <span className="truncate">{team.name}</span>
                    {selectedTeam.id === team.id && (
                      <Check className="ml-auto h-4 w-4" />
                    )}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 px-2">
                <Users className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  No teams found
                </p>
              </div>
            )}
          </div>
          <DropdownMenuSeparator className="my-0" />
          <div className="p-1">
            <Button
              variant="ghost"
              className="flex h-9 w-full items-center justify-start text-sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create team
            </Button>
            <Button
              variant="ghost"
              className="flex h-9 w-full items-center justify-start text-sm"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Join team
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Mobile team switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden h-9 w-9 p-0"
            aria-label="Select a team"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-accent/50">
              {selectedTeam.icon}
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
                  {team.icon}
                </div>
                <span>{team.name}</span>
              </div>
              {selectedTeam.id === team.id && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create team
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            Join team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TeamSwitcher;
