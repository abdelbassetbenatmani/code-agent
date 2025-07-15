import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";
import { customAdapter } from "@/prisma/CustomAdapter";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Github({
      authorization: {
        params: {
          scope: "read:user repo user:email workflow ",
        },
      },
      profile: (profile) => {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        };
      },
    }),
  ],
  adapter: customAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/dashboard") return !!auth;
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.sub || user?.id,
        // Add any other custom fields from token or user
      };
      return session;
    },
  },
});
