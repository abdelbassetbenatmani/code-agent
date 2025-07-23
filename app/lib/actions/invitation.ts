"use server";

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";



export async function addMemberInvitation({
  email,
  teamId,
  token,
  invitedBy = "",
  role = "member", // Default role is 'member'
}: {
  email: string;
  teamId: string;
  token?: string; // Optional token, will generate a new one if not provided
  invitedBy: string;
  role: string;
}) {
  try {
    const invitation = await prisma.invitation.create({
      data: {
        teamId,
        email,
        status: "PENDING",
        token: token || uuidv4(), // Generate a new token if not provided
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiresAt to 7 days from now
        invitedBy, // Store the userId of the person who sent the invitation
        role, // Store the role of the invited user
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

export async function checkInvitationExpiration(
  invitationToken: string
): Promise<boolean> {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: invitationToken },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Check if the invitation is expired (more than 7 days old or past expiresAt)
    const createdAt = invitation.createdAt;
    const expiresAt = invitation.expiresAt;
    const now = new Date();

    // Ensure both checks: expiresAt and 7 days from createdAt
    const isExpired =
      now > expiresAt ||
      (createdAt &&
        now.getTime() - createdAt.getTime() > 7 * 24 * 60 * 60 * 1000);

    return isExpired;
  } catch (error) {
    console.log("Error checking invitation expiration:", error);
    throw new Error("Failed to check invitation expiration");
  }
}

export async function getInvitationByToken(invitationToken: string) {
  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token: invitationToken },
    });

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    return invitation;
  } catch (error) {
    console.error("Error fetching invitation by token:", error);
    throw new Error("Failed to fetch invitation");
  }
}

export async function declineInvitation(token: string) {
  try {
    const declinedInvitation = await prisma.invitation.update({
      where: { token: token },
      data: { status: "DECLINED" },
    });

    return declinedInvitation;
  } catch (error) {
    console.log("Error declining invitation:", error);
    throw new Error("Failed to decline invitation");
  }
}
