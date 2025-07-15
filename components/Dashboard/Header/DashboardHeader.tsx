import {
  User,
  Clock,
  Code,
  AlertCircle,
  CheckCircle2,
  Users,
  Building,
  Laptop,
} from "lucide-react";
import Logo from "../../Logo";
import TeamSwitcher from "./TeamSwitcher";
import Notifications from "./Notifications";
import DashboardToggleTheme from "./DashboardToglleTheme";
import UserDropdown from "./UserDropdown";
import { auth } from "@/app/lib/auth";
import { getUserProfile } from "@/app/lib/actions/user";

// Sample teams data
const teams = [
  {
    id: "1",
    name: "Personal Account",
    icon: <User className="h-4 w-4" />,
    type: "personal",
  },
  {
    id: "2",
    name: "Acme Inc",
    icon: <Building className="h-4 w-4" />,
    type: "organization",
  },
  {
    id: "3",
    name: "Codiny Labs",
    icon: <Laptop className="h-4 w-4" />,
    type: "organization",
  },
  {
    id: "4",
    name: "Design Team",
    icon: <Users className="h-4 w-4" />,
    type: "team",
  },
];

// Sample notifications for demonstration
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
  actionLabel: string;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "Code review completed",
    description: "Your pull request #42 has been reviewed",
    time: "2 minutes ago",
    read: false,
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    actionLabel: "View",
  },
  {
    id: "2",
    title: "Build failed",
    description: "main branch build failed due to test errors",
    time: "35 minutes ago",
    read: false,
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    actionLabel: "Details",
  },
  {
    id: "3",
    title: "New comment on issue #88",
    description: "John added a comment on your open issue",
    time: "2 hours ago",
    read: true,
    icon: <Code className="h-4 w-4 text-blue-500" />,
    actionLabel: "Open",
  },
  {
    id: "4",
    title: "Weekly report available",
    description: "Your project performance report is ready",
    time: "Yesterday",
    read: true,
    icon: <Clock className="h-4 w-4 text-amber-500" />,
    actionLabel: "View",
  },
];

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
          <TeamSwitcher teams={teams} />
        </div>

        {/* Right side - Notifications, Theme Toggle and User Menu */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications Dropdown */}
          <Notifications notifications={notifications} />

          <DashboardToggleTheme />
          {session.user && <UserDropdown user={user} />}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
