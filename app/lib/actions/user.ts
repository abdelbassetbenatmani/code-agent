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
    avatar?: string;
    socialLinks?: any;
    secondaryEmail?: string;
  }
) => {
  try {
    let formattedSocialLinks = profileData.socialLinks;

    // If socialLinks is an array or object, stringify it
    if (
      profileData.socialLinks &&
      typeof profileData.socialLinks !== "string"
    ) {
      formattedSocialLinks = JSON.stringify(profileData.socialLinks);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: profileData.displayName || undefined,
        image: profileData.avatar || undefined,
        bio: profileData.bio,
        socialLinks: formattedSocialLinks,
        secondaryEmail: profileData.secondaryEmail || undefined,
      },
    });

    revalidatePath("/dashboard");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error("Failed to update user profile");
  }
};

export const deleteUserProfile = async (userId: string) => {
  try {
     await prisma.user.delete({
      where: { id: userId },
    });

    return true;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return false;
  }
};
