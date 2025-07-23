"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getIconComponent } from "@/components/utils/getTeamIcon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  ArrowLeft,
  Users,
  AlertTriangle,
  Trash2,
  User,
  UserPlus,
  Shield,
  MoreHorizontal,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/formatDate";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getTeamById } from "@/app/lib/actions/teams";
import {
  InvitationType,
  TeamMemberType,
  TeamTypeWithMembers,
} from "@/prisma/types";
import { v4 as uuidv4 } from "uuid";
import { addMemberInvitation } from "@/app/lib/actions/invitation";

export const TeamDetails = ({
  team,
  onBack,
}: {
  team: any;
  onBack: () => void;
}) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInvitations, setSearchInvitations] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);
  const debouncedSearchInvitations = useDebounce<string>(
    searchInvitations,
    300
  );

  const [teamDetails, setTeamDetails] = useState<TeamTypeWithMembers | null>(
    null
  );
  const [members, setMembers] = useState<TeamMemberType[]>(team.members || []);
  const [invitations, setInvitations] = useState<InvitationType[]>(
    team.invitations || []
  );

  // Filter members based on search
  const filteredMembers = debouncedSearchTerm
    ? members.filter(
        (member: TeamMemberType) =>
          member.user.name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          member.user.email
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          member.role?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    : members;

  // Filter invitations based on search
  const filteredInvitations = debouncedSearchInvitations
    ? invitations.filter(
        (invitation: any) =>
          invitation.email
            .toLowerCase()
            .includes(debouncedSearchInvitations.toLowerCase()) ||
          invitation.role
            .toLowerCase()
            .includes(debouncedSearchInvitations.toLowerCase())
      )
    : invitations;

  // Form schema for inviting a member
  const inviteFormSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["MEMBER", "ADMIN"], {
      required_error: "Please select a role",
    }),
  });

  // Form for inviting a member
  const inviteForm = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const onInviteSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    try {
      // Show loading toast
      toast.loading("Sending invitation...");

      // Generate a unique invitation ID
      const invitationId = uuidv4();

      const response = await fetch("/api/send-invitation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: values.email,
          subject: `Invitation to join ${team.name} team`,
          invitationDetails: {
            invitationId,
            teamId: team.id,
            teamName: team.name,
            role: values.role,
            invitedBy: teamDetails?.owner?.name || "Team Admin",
            acceptLink: `${
              window.location.origin
            }/invitations/${invitationId}?email=${encodeURIComponent(
              values.email
            )}&team=${team.id}&teamName=${encodeURIComponent(team.name)}`,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Dismiss loading toast and show success
        toast.dismiss();
        toast.success("Team invitation sent successfully!");

        // Create invitation record in database
        await addMemberInvitation({
          email: values.email,
          teamId: team.id,
          token: invitationId,
          invitedBy: teamDetails?.owner?.name || "",
          role: values.role,
        });

        // Close dialog and reset form
        setIsInviteDialogOpen(false);
        inviteForm.reset();

        return data;
      } else {
        // Dismiss loading toast and show error
        toast.dismiss();
        toast.error(`Failed to send invitation: ${data.message}`);
        throw new Error(data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(
        `Error sending invitation: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      console.error("Error sending invitation:", error);
    }
  };

  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement API call to delete team
      console.log("Deleting team:", team.id);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast("Team deleted successfully!");

      // Return to teams list
      onBack();
    } catch (error) {
      console.error("Error deleting team:", error);
      toast("Failed to delete team. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const data = await getTeamById(team.id);
        setTeamDetails(data);
        console.log("Fetched team details:", data);

        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };
    fetchTeamDetails();
  }, [team.id]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-md border bg-accent/50">
              {getIconComponent(team.icon)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{team.name}</h2>
              <p className="text-sm text-muted-foreground">
                Created {formatDate(team.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => setIsInviteDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">
                  Description
                </h3>
                <p className="text-base">
                  {team.description || "No description provided."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                ID
              </h3>
              <p className="text-sm font-mono bg-muted p-1 rounded">
                {team.id}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">
                Owner
              </h3>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                  {teamDetails?.owner.name?.charAt(0) || "O"}
                </div>
                <p>{teamDetails?.owner.name || "Unknown"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
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
                onChange={(e) => setSearchTerm(e.target.value)}
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
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member: any) => (
                    <TableRow key={member.id || member.email}>
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
                value={searchInvitations}
                onChange={(e) => setSearchInvitations(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Expired At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations.length > 0 ? (
                  filteredInvitations.map((invitation: any) => (
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

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Actions that can&apos;t be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Delete Team</AlertTitle>
            <AlertDescription className="space-y-3">
              <p>
                Once you delete a team, there is no going back. This action
                permanently deletes the team and removes all members.
              </p>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Team
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Invite someone to join your team. They&apos;ll receive an email
              with an invitation link.
            </DialogDescription>
          </DialogHeader>

          <Form {...inviteForm}>
            <form
              onSubmit={inviteForm.handleSubmit(onInviteSubmit)}
              className="space-y-4 pt-4"
            >
              <FormField
                control={inviteForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="colleague@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={inviteForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Team</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              team and remove all members.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="font-medium">
              Please type <span className="font-bold">{team.name}</span> to
              confirm:
            </p>
            <Input className="mt-2" />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTeam}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Team"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
