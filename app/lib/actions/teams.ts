"use server";

import { prisma } from "@/lib/prisma";

import { TeamType } from "@/prisma/types";

export async function getTeams() {
  try {
    const teams = await prisma.team.findMany({});

    return teams as TeamType[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams");
  }
}

export async function createTeam(
  name: string,
  icon: string,
  userId: string,
  description?: string
) {
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
