"use server";

import { prisma } from "@/lib/prisma";

import { TeamType, TeamTypeWithMembers } from "@/prisma/types";

export async function getTeams() {
  try {
    const teams = await prisma.team.findMany({});

    return teams as TeamType[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
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
            role: "owner", // Assuming the creator is the owner
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
