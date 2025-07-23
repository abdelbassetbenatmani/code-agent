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
import { Search, User, Shield, Users } from "lucide-react";
import { InvitationType } from "@/prisma/types";

interface TeamInvitationsCardProps {
  invitations: InvitationType[];
  searchTerm: string;
  debouncedSearchTerm: string;
  onSearchChange: (value: string) => void;
}

export const TeamInvitationsCard = ({
  invitations,
  searchTerm,
  debouncedSearchTerm,
  onSearchChange,
}: TeamInvitationsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Invite Members
          </CardTitle>
          <CardDescription>
            List of pending invitations to join the team.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invited members..."
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
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Invited By</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Expired At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length > 0 ? (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id || invitation.email}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {invitation.email?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {invitation?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {invitation.invitedBy || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {invitation.role === "Admin" && (
                          <Shield className="h-3 w-3 text-primary" />
                        )}
                        <span>{invitation.role || "Member"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {invitation.expiresAt
                        ? new Date(invitation.expiresAt).toLocaleDateString()
                        : "No expiration date"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                          invitation.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : invitation.status === "ACCEPTED"
                            ? "bg-green-100 text-green-800"
                            : invitation.status === "EXPIRED"
                            ? "bg-gray-200 text-gray-600"
                            : invitation.status === "DECLINED"
                            ? "bg-red-100 text-red-800"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {invitation.status || "PENDING"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <User className="h-8 w-8 text-muted-foreground mb-2" />
                      <h3 className="font-medium">No invitations found</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {debouncedSearchTerm
                          ? "No invitations match your search criteria"
                          : "There are no pending invitations"}
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