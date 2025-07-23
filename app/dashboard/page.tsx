import DashboardContent from "@/components/Dashboard/Content/DashboardContent";
import { deleteInvitation } from "../lib/actions/invitation";
import { createTeamMember } from "../lib/actions/teamMember";
import { auth } from "../lib/auth";

type DashbaordPageProps = {
  searchParams?: {
    invitationId?: string;
    teamId?: string;
    role?: "MEMBER" | "ADMIN";
  };
};

const DashboardPage = async ({ searchParams }: DashbaordPageProps) => {
  const session = await auth();
  const { invitationId, teamId, role } = await searchParams || {};

  // Handle invitation acceptance logic if needed
  if (
    invitationId &&
    teamId &&
    role
  ) {
    console.log("Accepting invitation with params:", { invitationId, teamId, role });

    try {
      await deleteInvitation(invitationId);
      await createTeamMember({
        teamId,
        userId: session.user.id,
        role,
      });
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