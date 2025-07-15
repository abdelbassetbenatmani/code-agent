import DashboardHeader from "@/components/Dashboard/Header/DashboardHeader";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DashboardHeader />
      {children}
    </div>
  );
}
