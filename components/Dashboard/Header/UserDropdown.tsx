"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  Home,
  LogOut,
  MoreHorizontal,
  Settings,
  User,
} from "lucide-react";
import { DropdownMenuShortcut } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/lib/actions/auth";

interface UserDropdownProps {
  user: {
    _id?: string | undefined;
    _creationTime?: number | undefined;
    name?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    image?: string | undefined;
    emailVerificationTime?: number | undefined;
    phoneVerificationTime?: number | undefined;
    isAnonymous?: boolean | undefined;
  };
}
const UserDropdown = ({ user }: UserDropdownProps) => {
  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const onSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  return (
    <DropdownMenu>
      {/* Desktop version (with name and email) */}
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-11 max-w-[200px] pl-2 pr-4 rounded-full items-center gap-3 shadow-md hover:bg-accent transition-all sm:flex"
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/50 shadow">
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback className="text-base font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="md:flex flex-col items-start justify-center hidden sm:flex">
            <span className="text-sm font-semibold leading-tight truncate max-w-[110px]">
              {user.name}
            </span>
            <span className="text-xs text-muted-foreground leading-tight truncate max-w-[110px]">
              {user.email}
            </span>
          </div>
          <span className="ml-auto">
            <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 rounded-lg shadow-2xl border border-border bg-background/95 backdrop-blur-lg"
        align="end"
        alignOffset={20}
      >
        <DropdownMenuLabel className="font-normal pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary shadow">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-base font-semibold">{user.name}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 hover:bg-primary/10 rounded-lg transition-all">
            <User className="mr-3 h-5 w-5 text-primary" />
            <span className="font-medium">Profile</span>
            <DropdownMenuShortcut className="hidden sm:inline-flex">
              ⇧⌘P
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 hover:bg-primary/10 rounded-lg transition-all">
            <Settings className="mr-3 h-5 w-5 text-primary" />
            <span className="font-medium">Account Settings</span>
            <DropdownMenuShortcut className="hidden sm:inline-flex">
              ⌘S
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 hover:bg-primary/10 rounded-lg transition-all">
            <Command className="mr-3 h-5 w-5 text-primary" />
            <span className="font-medium">Command Menu</span>
            <DropdownMenuShortcut className="hidden sm:inline-flex">
              ⌘K
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="py-3 hover:bg-primary/10 rounded-lg transition-all">
          <Home className="mr-3 h-5 w-5 text-primary" />
          <span className="font-medium">Home Page</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="py-3 hover:bg-destructive/10 rounded-lg transition-all text-destructive"
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span className="font-medium">Log Out</span>
          <DropdownMenuShortcut className="hidden sm:inline-flex">
            ⇧⌘Q
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
