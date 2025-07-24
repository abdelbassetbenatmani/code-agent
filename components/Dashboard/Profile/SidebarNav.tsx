import React from "react";
import { User, Palette, SlidersHorizontal, Users } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const sidebarNavItems = [
  {
    title: "Profile",
    icon: <User size={18} />,
    href: "/settings",
    param: "profile",
  },
  {
    title: "Account",
    icon: <SlidersHorizontal size={18} />,
    href: "/settings/account",
    param: "account",
  },
  {
    title: "Teams",
    icon: <Users size={18} />,
    href: "/settings/teams",
    param: "teams",
  },
  {
    title: "Appearance",
    icon: <Palette size={18} />,
    href: "/settings/appearance",
    param: "appearance",
  },
];

const SidebarNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "profile" | "account" | "appearance" | "teams";
  setActiveTab: React.Dispatch<
    React.SetStateAction<"profile" | "account" | "appearance" | "teams">
  >;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleNavClick = (
    tab: "profile" | "account" | "appearance" | "teams"
  ) => {
    // Update component state
    setActiveTab(tab);

    // Create a new URLSearchParams object based on the current params
    const params = new URLSearchParams(searchParams);

    // Set the tab parameter
    params.set("tab", tab);

    // Update the URL without refreshing the page
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <nav className="space-y-1">
      {sidebarNavItems.map((item) => (
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
            handleNavClick(
              item.title.toLowerCase() as
                | "profile"
                | "account"
                | "appearance"
                | "teams"
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
