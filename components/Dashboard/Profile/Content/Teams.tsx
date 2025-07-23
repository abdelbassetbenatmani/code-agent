"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIconComponent } from "@/components/utils/getTeamIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusCircle, Search } from "lucide-react";
import CreateTeam from "../../Teams/CreateTeam";
import useTeamStore from "@/lib/store/teams";
import { getOwnedTeams } from "@/app/lib/actions/teams";
import { formatDate } from "@/lib/formatDate";
import { useSession } from "next-auth/react";

const Teams = () => {
  const session = useSession();
  const { ownedTeams, setOwnedTeams } = useTeamStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Apply debounce to search input (300ms delay)
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  // Filter teams based on debounced search
  const filteredTeams = debouncedSearchTerm
    ? ownedTeams.filter(
        (team) =>
          team.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (team.description &&
            team.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      )
    : ownedTeams;

  // Load teams data
  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      try {
        const fetchedTeams = await getOwnedTeams(session?.data?.user?.id as string || "");
        if (fetchedTeams.length > 0) {
          setOwnedTeams(fetchedTeams);
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTeams();
  }, [setOwnedTeams, session.data?.user?.id]);

  return (
    <div className="space-y-6 container mx-auto py-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl font-bold">My Teams</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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

      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardDescription>
            Manage your teams and team membership.
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredTeams.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Team</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md border bg-accent/50">
                            {getIconComponent(team.icon)}
                          </div>
                          <span className="font-medium">{team.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="line-clamp-1">
                          {team.description || "No description"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(team.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline">Details</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No teams found</h3>
              <p className="text-muted-foreground mt-1">
                {debouncedSearchTerm
                  ? "No teams match your search. Try with a different term."
                  : "You don't have any teams yet. Create your first team!"}
              </p>
              {!debouncedSearchTerm && (
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-4"
                  variant="outline"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create your first team
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Teams;
