import React from "react";

import { User, Palette, SlidersHorizontal } from "lucide-react";
const sidebarNavItems = [
  {
    title: "Profile",
    icon: <User size={18} />,
    href: "/settings",
  },
  {
    title: "Account",
    icon: <SlidersHorizontal size={18} />,
    href: "/settings/account",
  },
  {
    title: "Appearance",
    icon: <Palette size={18} />,
    href: "/settings/appearance",
  },
];
const SidebarNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "profile" | "account" | "appearance";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"profile" | "account" | "appearance">
  >;
}) => {
  return (
    <nav className="space-y-1">
      {sidebarNavItems.map((item: any) => (
        <button
          key={item.title}
          className={`flex cursor-pointer items-center p-2 text-sm font-medium transition-colors duration-200 ease-in-out group rounded-md focus:ring-0
            ${
              activeTab === item.title.toLowerCase()
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }
          `}
          onClick={() =>
            setActiveTab(
              item.title.toLowerCase() as "profile" | "account" | "appearance"
            )
          }
        >
          <span
            className={`transition-colors duration-200 ease-in-out ${
              activeTab === item.title.toLowerCase()
            ? "text-primary"
            : "group-hover:text-primary"
            }`}
          >
            {item.icon}
          </span>
          <span
            className={`ml-2 transition-colors duration-200 ease-in-out ${
              activeTab === item.title.toLowerCase()
            ? "text-primary"
            : "group-hover:text-primary"
            }`}
          >
            {item.title}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default SidebarNav;
