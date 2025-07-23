"use server";

import { signIn, signOut } from "../auth";

export const login = async () => {
  const response = await signIn("github", {
    redirectTo: "/dashboard",
  });
  console.log("Login response:", response);
};

export const loginWithInvitation = async (
  invitationId: string,
  teamId: string,
  role: string
) => {
  // Store invitation info in URL params to handle after auth
  await signIn("github", {
    redirectTo: `/dashboard?acceptInvitation=true&invitationId=${invitationId}&teamId=${teamId}&role=${role}`,
  });
};

export const logout = async () => {
  await signOut({
    redirectTo: "/",
  });
};
