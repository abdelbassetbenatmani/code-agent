import { NotificationType } from "@prisma/client";
import {
  Code,
  GitBranch,
  Briefcase,
  UserMinus,
  UserCog,
  UserPlus,
  LogOut,
  Shield,
  CheckCircle,
  XCircle,
  Trash,
  GitFork,
  Plus,
  RefreshCcw,
} from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NotificationIconConfig {
  icon: ReactNode;
  bgColor: string;
  iconColor: string;
}

export const getNotificationIconConfig = (
  type: NotificationType
): NotificationIconConfig => {
  switch (type) {
    // Code-related notifications
    case "CODE_REVIEW":
      return {
        icon: <Code size={16} />,
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
      };
    case "CODE_REFACTOR":
      return {
        icon: <RefreshCcw size={16} />,
        bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
        iconColor: "text-indigo-600 dark:text-indigo-400",
      };

    // Team invitation related
    case "TEAM_INVITATION":
      return {
        icon: <Briefcase size={16} />,
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
      };
    case "TEAM_MEMBER_ACCEPTED_INVITATION":
      return {
        icon: <CheckCircle size={16} />,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      };
    case "TEAM_MEMBER_REJECTED_INVITATION":
      return {
        icon: <XCircle size={16} />,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      };

    // Team member status changes
    case "TEAM_MEMBER_JOINED":
      return {
        icon: <UserPlus size={16} />,
        bgColor: "bg-green-100 dark:bg-green-900/30",
        iconColor: "text-green-600 dark:text-green-400",
      };
    case "TEAM_MEMBER_LEFT":
      return {
        icon: <LogOut size={16} />,
        bgColor: "bg-amber-100 dark:bg-amber-900/30",
        iconColor: "text-amber-600 dark:text-amber-400",
      };
    case "TEAM_MEMBER_REMOVED":
      return {
        icon: <UserMinus size={16} />,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      };
    case "TEAM_MEMBER_REMOVED_BY_OWNER":
      return {
        icon: <Shield size={16} />,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      };
    case "TEAM_MEMBER_ROLE_CHANGED":
      return {
        icon: <UserCog size={16} />,
        bgColor: "bg-sky-100 dark:bg-sky-900/30",
        iconColor: "text-sky-600 dark:text-sky-400",
      };

    // Team/Repo deletions
    case "TEAM_DELETE":
      return {
        icon: <Trash size={16} />,
        bgColor: "bg-rose-100 dark:bg-rose-900/30",
        iconColor: "text-rose-600 dark:text-rose-400",
      };
    case "REPO_DELETE":
      return {
        icon: <Trash size={16} />,
        bgColor: "bg-red-100 dark:bg-red-900/30",
        iconColor: "text-red-600 dark:text-red-400",
      };

    // Repository operations
    case "REPO_ADD":
      return {
        icon: <Plus size={16} />,
        bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
      };
    case "REPO_UPDATE":
      return {
        icon: <GitBranch size={16} />,
        bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
        iconColor: "text-cyan-600 dark:text-cyan-400",
      };

    // Default fallback
    default:
      return {
        icon: <GitFork size={16} />,
        bgColor: "bg-gray-100 dark:bg-gray-800/50",
        iconColor: "text-gray-600 dark:text-gray-400",
      };
  }
};

interface NotificationIconProps {
  type: NotificationType;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const NotificationIcon = ({
  type,
  className,
  size = "md",
}: NotificationIconProps) => {
  const { icon, bgColor, iconColor } = getNotificationIconConfig(type);
  
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        bgColor,
        sizeClasses[size],
        className
      )}
    >
      <div className={iconColor}>{icon}</div>
    </div>
  );
};

export default NotificationIcon;