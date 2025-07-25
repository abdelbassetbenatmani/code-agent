
import Logo from "../../Logo";
import TeamSwitcher from "./TeamSwitcher";
import Notifications from "./Notifications";
import DashboardToggleTheme from "./DashboardToglleTheme";
import UserDropdown from "./UserDropdown";
import { auth } from "@/app/lib/auth";
import { getUserProfile } from "@/app/lib/actions/user";



const DashboardHeader = async () => {
  const session = await auth();
  const userProfile = await getUserProfile(session.user.id);

  // Convert nulls to undefined for props compatibility
  const user = {
    ...userProfile,
    name: userProfile.name ?? undefined,
    email: userProfile.email ?? undefined,
    image: userProfile.image ?? undefined,
    bio: userProfile.bio ?? undefined,
    socialLinks: userProfile.socialLinks ?? undefined,
    secondaryEmail: userProfile.secondaryEmail ?? undefined,
  };
  

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo, Team Switcher */}
        <div className="flex items-center gap-4">
          <Logo href="/dashboard" />
          <TeamSwitcher session={session} />
        </div>

        {/* Right side - Notifications, Theme Toggle and User Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications Dropdown */}
          <Notifications userId={session.user.id} />

          <DashboardToggleTheme />
          {session.user && <UserDropdown user={user} />}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
