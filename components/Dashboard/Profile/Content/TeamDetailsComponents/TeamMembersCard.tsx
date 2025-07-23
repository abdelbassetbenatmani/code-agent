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
import { Search, User, Shield, MoreHorizontal, Trash2 } from "lucide-react";
import { TeamMemberType } from "@/prisma/types";

interface TeamMembersCardProps {
  members: TeamMemberType[];
  searchTerm: string;
  debouncedSearchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TeamMembersCard = ({
  members,
  searchTerm,
  debouncedSearchTerm,
  onSearchChange,
}: TeamMembersCardProps) => {
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
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          member.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {member.status || "active"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center cursor-pointer hover:bg-muted p-1 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            {member.role === "Admin" ? (
                              <div>
                                <User className="h-4 w-4 mr-2" />
                                <span>Change to Member</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 mr-2" />
                                <span>Change to Admin</span>
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex items-center gap-2">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span>Remove Member</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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