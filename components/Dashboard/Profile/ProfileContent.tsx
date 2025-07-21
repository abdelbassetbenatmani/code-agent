"use client";
import React, { useState } from "react";
import SidebarNav from "./SidebarNav";
import Profile from "./Content/Profile";
import Account from "./Content/Account";
import Appearance from "./Content/Appearance";
import { useSearchParams } from "next/navigation";

const ProfileContent = () => {
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab");

  const validTabs = ["profile", "account", "appearance"] as const;
  const initialTab: "profile" | "account" | "appearance" =
    validTabs.includes(tab as any) ? (tab as typeof validTabs[number]) : "profile";

  const [activeTab, setActiveTab] = useState<
    "profile" | "account" | "appearance"
  >(initialTab);
  return (
    <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
      <aside className="top-0 lg:sticky lg:w-1/5">
        <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </aside>
      <div className="flex w-full overflow-y-hidden p-1">
        <div className="flex w-full items-center justify-center p-4">
          {activeTab === "profile" && <Profile />}
          {activeTab === "account" && <Account />}
          {activeTab === "appearance" && <Appearance />}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
