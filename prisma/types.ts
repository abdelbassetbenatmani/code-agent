import { Prisma } from "@prisma/client";

export type FullUser = Prisma.UserGetPayload<{
  include: {
    accounts: true;
    Authenticator: true;
    sessions: true;
    Repo: true;
  };
}>;

export type UserSession = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
    image: true;
  };
}>;

export type RepoWithUser = Prisma.RepoGetPayload<{
  include: {
    user: true;
  };
}>;

export type ReviewType = Prisma.CodeReviewGetPayload<object>;

export type RefactoringType = Prisma.CodeRefactorGetPayload<object>;

// Account type
export type Account = Prisma.AccountGetPayload<object>;

// Session type
export type Session = Prisma.SessionGetPayload<object>;

// Authenticator type
export type Authenticator = Prisma.AuthenticatorGetPayload<object>;

// VerificationToken type
export type VerificationToken = Prisma.VerificationTokenGetPayload<object>;

export type TeamType = Prisma.TeamGetPayload<object>;

export type TeamTypeWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: {
      include: {
        user: true; // Include user details in the members
      };
    };
    owner: true; // Include owner details
  };
}>;

export type TeamMemberType = Prisma.TeamMemberGetPayload<{
  include: {
    user: true; // Include user details
  };
}>;
