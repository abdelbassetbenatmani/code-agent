"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const getUserProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        socialLinks: true,
        secondaryEmail: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};

export const updateUserProfile = async (
  userId: string,
  profileData: {
    bio?: string;
    displayName?: string;
    avatar?: string; // Base64 string or URL of the avatar image
    socialLinks?: string; // JSON stringified array of social links
    secondaryEmail?: string; // Optional secondary email
  }
) => {
  // Update user profile logic here
  try {
    // Assuming you have a Prisma client instance
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.displayName || undefined,
        image: profileData.avatar || undefined,
        bio: profileData.bio,
        socialLinks: profileData.socialLinks
          ? JSON.stringify(profileData.socialLinks)
          : null,
        secondaryEmail: profileData.secondaryEmail || null,
      },
    });
    revalidatePath("/dashboard");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};
