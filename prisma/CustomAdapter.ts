import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const customAdapter = (p: PrismaClient) => {
  return {
    ...PrismaAdapter(p),
    createUser: async (data: any) => {
      console.log("default createUser", data);
      data.id = data.oid;
      //remove oid from data
      delete data.oid;
      console.log("custom createUser", data);
      return p.user.create({ data });
    },
  };
};
