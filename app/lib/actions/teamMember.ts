"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTeamMember({
  teamId,
  userId,
  role = "MEMBER", // Default role is MEMBER
}: {
  teamId: string;
  userId: string;
  role?: "MEMBER" | "ADMIN";
}) {
  try {
    const teamMember = await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
      },
    });

    return teamMember;
  } catch (error) {
    console.error("Error creating team member:", error);
    throw new Error("Failed to create team member");
  }
}

export async function deleteTeamMember({
  teamId,
  userId,
}: {
  teamId: string;
  userId: string;
}) {
  try {
    const deletedMember = await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
    });

    return deletedMember;
  } catch (error) {
    console.error("Error deleting team member:", error);
    throw new Error("Failed to delete team member");
  }
}

export async function updateTeamMemberRole({
  teamId,
  userId,
  role,
}: {
  teamId: string;
  userId: string;
  role: "MEMBER" | "ADMIN";
}) {
  try {
    const updatedMember = await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId,
        },
      },
      data: {
        role,
      },
    });

    revalidatePath("/dashboard/profile?tab=teams");
    return updatedMember;
  } catch (error) {
    console.error("Error updating team member role:", error);
    throw new Error("Failed to update team member role");
  }
}


export async function getTeamMembers(teamId: string) {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        teamId,
      },
      include: {
        user: true, // Include user details
      },
    });

    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw new Error("Failed to fetch team members");
  }
}