import { TeamMemberType } from "@/prisma/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TeamMemberState {
  members: TeamMemberType[];
  setMembers: (members: TeamMemberType[]) => void;
  addMember: (member: TeamMemberType) => void;
  removeMember: (userId: string) => void;
  updateMemberRole: (userId: string, role: "MEMBER" | "ADMIN") => void;
}

const useTeamMemberStore = create<TeamMemberState>()(
  persist(
    (set) => ({
      members: [],
      setMembers: (members) => set({ members }),
      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),
      removeMember: (userId) =>
        set((state) => ({
          members: state.members.filter((member) => member.userId !== userId),
        })),
      updateMemberRole: (userId, role) =>
        set((state) => ({
          members: state.members.map((member) =>
            member.userId === userId ? { ...member, role } : member
          ),
        })),
    }),
    {
      name: "team-member-storage", // unique name for the storage
    }
  )
);

export default useTeamMemberStore;
export type { TeamMemberState };
