import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TeamState {
  teamId: string | null;
  setTeamId: (teamId: string | null) => void;
  setTeams: (teams: { id: string; name: string; icon: string }[]) => void;
  addTeam: (team: { id: string; name: string; icon: string }) => void;
  removeTeam: (teamId: string) => void;
  updateTeam: (
    teamId: string,
    updatedTeam: Partial<{ id: string; name: string; icon: string }>
  ) => void;
  teams: { id: string; name: string; icon: string }[];
}

const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teamId: null,
      teams: [],

      setTeamId: (teamId) => set({ teamId }),
      setTeams: (teams) => set({ teams }),
      addTeam: (team) => set((state) => ({ teams: [...state.teams, team] })),
      removeTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== teamId),
        })),
      updateTeam: (teamId, updatedTeam) =>
        set((state) => ({
          teams: state.teams.map((team) =>
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
