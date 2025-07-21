"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Check, MoreHorizontal, RefreshCw } from "lucide-react";
import { Notification } from "./DashboardHeader";

const Notifications = ({ notifications }: { notifications: Notification[] }) => {
      const [unreadCount, setUnreadCount] = useState(
    notifications.filter((n) => !n.read).length,
  );
  const markAllAsRead = () => {
    setUnreadCount(0);
  };
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-primary">
                {unreadCount > 9 && (
                  <span className="absolute flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white">
                    {unreadCount}
                  </span>
                )}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[calc(100vw-2rem)] sm:w-80"
          align="end"
          side="bottom"
          sideOffset={12}
        >
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className="text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {notifications.length > 0 ? (
            <DropdownMenuGroup className="max-h-[50vh] sm:max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-0"
                >
                  <div
                    className={`flex w-full items-start gap-2 p-3 ${!notification.read ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border">
                      {notification.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium line-clamp-1">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-primary hover:text-primary/80"
                        >
                          {notification.actionLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {notifications.indexOf(notification) <
                    notifications.length - 1 && (
                    <DropdownMenuSeparator className="m-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ) : (
            <div className="flex flex-col items-center justify-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mt-2 text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground">
                You&apos;re all caught up!
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh notifications
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
