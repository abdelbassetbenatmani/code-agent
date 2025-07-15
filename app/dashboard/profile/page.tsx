import ProfileContent from "@/components/Dashboard/Profile/ProfileContent";
import { Separator } from "@/components/ui/separator";
import React from "react";

const ProfilePage = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-4 lg:my-6" />
      <ProfileContent />
    </div>
  );
};

export default ProfilePage;
