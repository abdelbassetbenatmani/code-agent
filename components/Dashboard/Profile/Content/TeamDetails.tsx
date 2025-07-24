"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getTeamById, updateTeamInfo } from "@/app/lib/actions/teams";
import {
  InvitationType,
  TeamMemberType,
  TeamTypeWithMembers,
} from "@/prisma/types";

// Import the separated components
import { TeamHeader } from "./TeamDetailsComponents/TeamHeader";
import { TeamAboutCard } from "./TeamDetailsComponents/TeamAboutCard";
import { TeamInfoCard } from "./TeamDetailsComponents/TeamInfoCard";
import { TeamMembersCard } from "./TeamDetailsComponents/TeamMembersCard";
import { TeamInvitationsCard } from "./TeamDetailsComponents/TeamInvitationsCard";
import { DangerZoneCard } from "./TeamDetailsComponents/DangerZoneCard";
import { InviteMemberDialog } from "./TeamDetailsComponents/InviteMemberDialog";
import { DeleteTeamDialog } from "./TeamDetailsComponents/DeleteTeamDialog";
import { toast } from "sonner";
import useTeamStore from "@/lib/store/teams";
import useTeamMemberStore from "@/lib/store/teamMember";

export const TeamDetails = ({
  team,
  onBack,
}: {
  team: any;
  onBack: () => void;
}) => {
  const { updateTeam } = useTeamStore();
  const { members, setMembers } = useTeamMemberStore();
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

  const handleDeleteTeam = async () => {
    setIsDeleting(true);
    try {
      // TODO: Implement API call to delete team
      console.log("Deleting team:", team.id);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Team deleted successfully!");

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

  const handleUpdateTeamName = async (teamId: string, newName: string) => {
    const newTeam = await updateTeamInfo({ teamId, newName });
    // You might want to refresh team data here
    setTeamDetails((prev) => (prev ? { ...prev, name: newName } : null));
    updateTeam(teamId, {
      ...newTeam,
      description: newTeam.description ?? undefined,
    });
  };

  const habdleUpdateTeamDescription = async (
    teamId: string,
    newDescription: string
  ) => {
    const newTeam = await updateTeamInfo({
      teamId,
      description: newDescription,
    });
    // You might want to refresh team data here
    setTeamDetails((prev) =>
      prev ? { ...prev, description: newDescription } : null
    );
    updateTeam(teamId, {
      ...newTeam,
      name: newTeam.name ?? undefined,
      description: newTeam.description ?? undefined,
    });
  };

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const data = await getTeamById(team.id);
        setTeamDetails(data);
        setMembers(data.members || []);
        setInvitations(data.invitations || []);
      } catch (error) {
        console.error("Error fetching team details:", error);
      }
    };
    fetchTeamDetails();
  }, [team.id, setMembers]);

  return (
    <div className="space-y-8">
      <TeamHeader
        team={team}
        onBack={onBack}
        onInvite={() => setIsInviteDialogOpen(true)}
        onUpdateTeamName={handleUpdateTeamName}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TeamAboutCard
          teamId={team.id}
          description={team.description}
          onUpdateDescription={habdleUpdateTeamDescription}
          className="md:col-span-2"
        />
        <TeamInfoCard
          teamId={team.id}
          owner={teamDetails?.owner}
          className="md:col-span-1"
        />
      </div>

      <TeamMembersCard
        teamId={team.id}
        members={filteredMembers}
        searchTerm={searchTerm}
        debouncedSearchTerm={debouncedSearchTerm}
        onSearchChange={setSearchTerm}
      />

      {team.name !== "Personal" && (
        <TeamInvitationsCard
          invitations={filteredInvitations}
          searchTerm={searchInvitations}
          debouncedSearchTerm={debouncedSearchInvitations}
          onSearchChange={setSearchInvitations}
        />
      )}

      <DangerZoneCard onDeleteClick={() => setIsDeleteDialogOpen(true)} />

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        team={team}
        teamDetails={teamDetails}
      />

      <DeleteTeamDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        teamName={team.name}
        isDeleting={isDeleting}
        onDelete={handleDeleteTeam}
      />
    </div>
  );
};

export default TeamDetails;
