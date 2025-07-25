import DashboardContent from "@/components/Dashboard/Content/DashboardContent";
import { deleteInvitation } from "../lib/actions/invitation";
import { createTeamMember } from "../lib/actions/teamMember";
import { auth } from "../lib/auth";
import { createNotification } from "../lib/actions/notifications";
import { getOwnerOfTeam } from "../lib/actions/teams";

type DashbaordPageProps = {
  searchParams?: {
    invitationId?: string;
    teamId?: string;
    role?: "MEMBER" | "ADMIN";
  };
};

const DashboardPage = async ({ searchParams }: DashbaordPageProps) => {
  const session = await auth();
  const { invitationId, teamId, role } = (await searchParams) || {};

  // Handle invitation acceptance logic if needed
  if (invitationId && teamId && role) {
    console.log("Accepting invitation with params:", {
      invitationId,
      teamId,
      role,
    });

    try {
      await deleteInvitation(invitationId);
      await createTeamMember({
        teamId,
        userId: session.user.id,
        role,
      });

      // Create a notification for the owner of the team
      const ownerId = await getOwnerOfTeam(teamId);

      if (ownerId) {
        await createNotification({
          userId: ownerId,
          message: `User ${session.user.name} has accepted your invitation to join the team as a ${role}.`,
          type: "TEAM_MEMBER_JOINED",
          title: `Team Member Joined`,
        });
      }


    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  }

  return (
    <div>
      <DashboardContent />
    </div>
  );
};

export default DashboardPage;
