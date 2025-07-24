import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  User,
  Shield,
  MoreHorizontal,
  Trash2,
  Loader2,
} from "lucide-react";
import { TeamMemberType } from "@/prisma/types";
import { updateTeamMemberRole } from "@/app/lib/actions/teamMember";
import { toast } from "sonner";
import useTeamMemberStore from "@/lib/store/teamMember";

interface TeamMembersCardProps {
  teamId: string; // Add teamId prop
  members: TeamMemberType[];
  searchTerm: string;
  debouncedSearchTerm: string;
  onSearchChange: (value: string) => void;

}

export const TeamMembersCard = ({
  teamId,
  members,
  searchTerm,
  debouncedSearchTerm,
  onSearchChange,

}: TeamMembersCardProps) => {
  const { updateMemberRole } = useTeamMemberStore();
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);

  const changeToAdmin = async (
    memberId: string,
    userId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      setUpdatingMemberId(memberId);

      console.log(`Changing user ${userId} to Admin in team ${teamId}`);

      await updateTeamMemberRole({
        teamId,
        userId,
        role: "ADMIN",
      });

      toast.success("Member role updated to Admin");

      updateMemberRole(userId, "ADMIN");

    } catch (error) {
      console.error("Error changing role to Admin:", error);
      toast.error("Failed to update member role");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const changeToMember = async (
    memberId: string,
    userId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      setUpdatingMemberId(memberId);

      console.log(`Changing user ${userId} to Member in team ${teamId}`);

      await updateTeamMemberRole({
        teamId,
        userId,
        role: "MEMBER",
      });

      toast.success("Member role updated to Member");

      updateMemberRole(userId, "MEMBER");

    } catch (error) {
      console.error("Error changing role to Member:", error);
      toast.error("Failed to update member role");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const removeMember = async (
    memberId: string,
    userId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    // This would need to be implemented in your actions
    // For now, just showing the structure
    try {
      setUpdatingMemberId(memberId);

      console.log(`Removing user ${userId} from team ${teamId}`);

      // Call your remove member API
      // await removeTeamMember({ teamId, userId });

      toast.success("Member removed from team");

    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage team members and their roles.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length > 0 ? (
                members.map((member) => (
                  <TableRow key={member.id || member.user.email}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium">
                            {member.user.name || "Invited User"}
                          </p>
                          <p className="text-xs text-muted-foreground md:hidden">
                            {member.user.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {member.user.email || "No email"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {member.role === "OWNER" && (
                          <Shield className="h-3 w-3 text-primary" />
                        )}
                        <span>{member.role || "Member"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-100 text-green-800`}
                      >
                        {"active"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {updatingMemberId === member.id ? (
                        <div className="flex justify-center">
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        </div>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center justify-center cursor-pointer hover:bg-muted p-1 rounded">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          {member.role.toUpperCase() !== "OWNER" && (
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                {member.role === "ADMIN" ? (
                                  <div
                                    className="flex items-center gap-2 w-full cursor-pointer"
                                    onClick={(e) =>
                                      changeToMember(
                                        member.id,
                                        member.userId,
                                        e
                                      )
                                    }
                                  >
                                    <User className="h-4 w-4 mr-2" />
                                    <span>Change to Member</span>
                                  </div>
                                ) : (
                                  <div
                                    className="flex items-center gap-2 w-full cursor-pointer"
                                    onClick={(e) =>
                                      changeToAdmin(member.id, member.userId, e)
                                    }
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    <span>Change to Admin</span>
                                  </div>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <div
                                  className="flex items-center gap-2 w-full cursor-pointer text-destructive"
                                  onClick={(e) =>
                                    removeMember(member.id, member.userId, e)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span>Remove Member</span>
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          )}
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <User className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium">No members found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {debouncedSearchTerm
                          ? "No members match your search criteria"
                          : "This team doesn't have any members yet"}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
