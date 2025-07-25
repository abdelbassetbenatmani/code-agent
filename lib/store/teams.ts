import { TeamType } from "@/prisma/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TeamState {
  teamId: string | null;
  setTeamId: (teamId: string | null) => void;
  setTeam: (team: TeamType) => void;
  setTeams: (teams: TeamType[]) => void;
  setOwnedTeams: (ownedTeams: TeamType[]) => void;
  ownedTeams: TeamType[];
  addTeam: (team: TeamType) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (
    teamId: string,
    updatedTeam: Partial<{
      id: string;
      name: string;
      icon: string;
      description: string;
    }>
  ) => void;
  teams: TeamType[];
  team: TeamType | null;
}

const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teamId: null,
      teams: [],
      team: null,
      ownedTeams: [],
      setOwnedTeams: (ownedTeams) => set({ ownedTeams }),

      setTeamId: (teamId) => set({ teamId }),
      setTeam: (team) => set({ team }),
      setTeams: (teams) => set({ teams }),
      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, team],
          ownedTeams: [...state.ownedTeams, team],
        })),
      removeTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
          ownedTeams: state.ownedTeams.filter((team) => team.id !== teamId),
          teamId: state.teamId === teamId ? null : state.teamId,
        })),
      updateTeam: (teamId, updatedTeam) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, ...updatedTeam } : team
          ),
          ownedTeams: state.ownedTeams.map((team) =>
            team.id === teamId ? { ...team, ...updatedTeam } : team
          ),
        })),
    }),
    {
      name: "team-storage", // unique name for the storage
    }
  )
);
export default useTeamStore;
export type { TeamState };
