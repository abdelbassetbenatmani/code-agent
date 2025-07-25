import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { addMemberInvitation } from "@/app/lib/actions/invitation";
import { TeamTypeWithMembers } from "@/prisma/types";
import { getUserProfileByEmail } from "@/app/lib/actions/user";
import { createNotification } from "@/app/lib/actions/notifications";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  team: {
    id: string;
    name: string;
  };
  teamDetails: TeamTypeWithMembers | null;
}

// Form schema for inviting a member
const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["MEMBER", "ADMIN"], {
    required_error: "Please select a role",
  }),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  team,
  teamDetails,
}: InviteMemberDialogProps) => {
  // Form for inviting a member
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const onSubmit = async (values: InviteFormValues) => {
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
          invitedById: teamDetails?.owner?.id || "",
          role: values.role,
        });

        // if user is existing on our system, create a notification
        const existingUser = await getUserProfileByEmail(values.email);
        if (existingUser) {
          await createNotification({
            userId: existingUser.id,
            type: "TEAM_INVITATION",
            title: `You've been invited to join ${team.name}`,
            message: `You have been invited to join the team ${team.name} as a ${values.role}. Please check your email for the invitation link.`,
          });
        }

        // Close dialog and reset form
        onOpenChange(false);
        form.reset();

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Invite someone to join your team. They&apos;ll receive an email with
            an invitation link.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <FormField
              control={form.control}
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
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
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
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
