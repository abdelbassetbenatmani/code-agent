import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

export const customAdapter = (p: PrismaClient) => {
  return {
    ...PrismaAdapter(p),
    createUser: async (data: any) => {
      data.id = data.oid;
      //remove oid from data
      delete data.oid;

      // Create the user
      const user = await p.user.create({ data });

      try {
        // Create a default team for the user
        await p.team.create({
          data: {
            id: uuidv4(),
            name: "Personal",
            description: "Your personal workspace",
            icon: "users",
            ownerId: user.id,
            members: {
              create: {
                userId: user.id,
                role: "OWNER",
              },
            },
          },
        });

      } catch (error) {
        console.error("Failed to create default team:", error);
        // Don't throw here to avoid blocking user creation
        // Just log the error and continue
      }

      return user;
    },
  };
};
