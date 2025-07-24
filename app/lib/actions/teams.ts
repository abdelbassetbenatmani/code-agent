"use server";

import { prisma } from "@/lib/prisma";

import { TeamType, TeamTypeWithMembers } from "@/prisma/types";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

export async function getUserTeams() {
  const session = await auth();
  try {
    // Find teams where the user is a member (including teams they own)
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: {
            userId: session?.user?.id || "",
          },
        },
      },
      include: {
        owner: true, // Include owner details
        members: {
          where: {
            userId: session?.user?.id || "",
          },
          select: {
            role: true, // Include the user's role in each team
          },
        },
        _count: {
          select: {
            members: true, // Count total members
          },
        },
      },
      orderBy: {
        updatedAt: "asc", // Most recently updated teams first
      },
    });

    // Format the teams to include the user's role in each team
    const formattedTeams = teams.map((team) => ({
      ...team,
      userRole: team.members[0]?.role || "member",
      memberCount: team._count.members,
      members: undefined, // Remove the members array to clean up the response
      _count: undefined, // Remove the count object
    }));

    return formattedTeams as (TeamType & {
      userRole: string;
      memberCount: number;
    })[];
  } catch (error) {
    console.error("Error fetching user teams:", error);
    throw new Error("Failed to fetch teams where user is a member");
  }
}

export async function getOwnedTeams(userId: string) {
  try {
    const teams = await prisma.team.findMany({
      where: {
        ownerId: userId,
      },
    });

    return teams as TeamType[];
  } catch (error) {
    console.error("Error fetching owned teams:", error);
    throw new Error("Failed to fetch owned teams");
  }
}

export async function getTeamById(teamId: string) {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      include: {
        members: {
          include: {
            user: true, // Include user details in the members
          },
        },
        owner: true, // Include owner details
        invitations: true, // Include invitations related to the team
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team as TeamTypeWithMembers;
  } catch (error) {
    console.error("Error fetching team by ID:", error);
    throw new Error("Failed to fetch team by ID");
  }
}

export async function getOwnerOfTeam(teamId: string) {
  try {
    const team = await prisma.team.findUnique({
      where: {
        id: teamId,
      },
      select: {
        ownerId: true,
      },
    });

    if (!team) {
      throw new Error("Team not found");
    }

    return team.ownerId;
  } catch (error) {
    console.error("Error fetching team owner:", error);
    throw new Error("Failed to fetch team owner");
  }
}

interface CreateTeamParams {
  name: string;
  icon: string;
  userId: string;
  description?: string;
}

export async function createTeam({
  name,
  icon,
  userId,
  description = "",
}: CreateTeamParams) {
  try {
    const team = await prisma.team.create({
      data: {
        name,
        icon,
        description,
        owner: {
          connect: {
            id: userId,
          },
        },
        members: {
          create: {
            userId,
            role: "OWNER", // Assuming the creator is the owner
          },
        },
      },
    });

    return team as TeamType;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team");
  }
}

interface UpdateTeamNameParams {
  teamId: string;
  newName?: string;
  description?: string;
}

export async function updateTeamInfo({
  teamId,
  newName,
  description,
}: UpdateTeamNameParams) {
  try {
    const team = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        name: newName,
        description,
      },
    });

    revalidatePath(`/dashboard/profile?tab=teams`);
    return team as TeamType;
  } catch (error) {
    console.error("Error updating team info:", error);
    throw new Error("Failed to update team info");
  }
}

export async function deleteTeam(teamId: string) {
  try {
    const deletedTeam = await prisma.team.delete({
      where: {
        id: teamId,
      },
    });

    revalidatePath(`/dashboard/profile?tab=teams`);
    return deletedTeam as TeamType;
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error("Failed to delete team");
  }
}
