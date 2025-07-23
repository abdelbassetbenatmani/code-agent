"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function addMemberInvitation({
  email,
  teamId,
  token,
}: {
  email: string;
  teamId: string;
  token?: string; // Optional token, will generate a new one if not provided
}) {
  try {
    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        status: "PENDING",
        token: token || uuidv4(), // Generate a new token if not provided
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiresAt to 7 days from now
      },
    });

    return invitation;
  } catch (error) {
    console.error("Error creating invitation:", error);
    throw new Error("Failed to create invitation");
  }
}

export async function deleteInvitation(invitationId: string) {
  try {
    const deletedInvitation = await prisma.invitation.delete({
      where: { id: invitationId },
    });

    return deletedInvitation;
  } catch (error) {
    console.error("Error deleting invitation:", error);
    throw new Error("Failed to delete invitation");
  }
}
