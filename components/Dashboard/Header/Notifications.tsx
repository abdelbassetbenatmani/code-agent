"use client";
import React, { useEffect, useState } from "react";

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
import { Bell, Check, RefreshCw, Trash2 } from "lucide-react";
import { useNotificationStore } from "@/lib/store/notification";
import NotificationIcon from "@/components/utils/getNotificationIcon";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationType } from "@prisma/client";
import { formatDistanceToNow } from "@/lib/formatDate";
import {
  getNotifications,
  GetNotificationsResponse,
  getUnreadNotificationsCount,
} from "@/app/lib/actions/notifications";

const Notifications = ({ userId }: { userId: string }) => {
  // Use notification store
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    setNotifications,
    setUnreadCount,
  } = useNotificationStore();

  // State to track if notifications were loaded
  const [initialized, setInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications on component mount
  useEffect(() => {
    // Dummy function to simulate fetching notifications
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const [notificationsData, unreadCount]: [
          GetNotificationsResponse,
          number
        ] = await Promise.all([
          getNotifications({ userId }),
          getUnreadNotificationsCount(userId),
        ]);

        setNotifications(notificationsData.notifications);
        setUnreadCount(unreadCount);

        setInitialized(true);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (!initialized) {
      loadNotifications();
    }
  }, [userId, initialized, setNotifications, setUnreadCount]);

  // Dummy function to handle marking a notification as read
  const handleMarkAsRead = (notificationId: string) => {
    console.log("Marking notification as read:", notificationId);
    markAsRead(notificationId);
  };

  // Dummy function to handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    console.log("Marking all notifications as read");
    markAllAsRead();
  };

  // Dummy function to refresh notifications
  const handleRefresh = () => {
    console.log("Refreshing notifications");
  };

  // Dummy function to load more notifications
  const handleLoadMore = () => {
    console.log("Loading more notifications");
  };

  // Dummy function to remove a notification
  const handleRemoveNotification = (
    notificationId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    console.log("Removing notification:", notificationId);
    removeNotification(notificationId);
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
                onClick={handleMarkAllAsRead}
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

          {isLoading && !initialized ? (
            // Loading skeletons
            <div className="p-2 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1 flex-1">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <DropdownMenuGroup className="max-h-[50vh] sm:max-h-[300px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start p-0 focus:bg-transparent"
                  onSelect={(e) => e.preventDefault()}
                >
                  <div
                    className={`flex w-full items-start gap-2 p-3 cursor-pointer ${
                      !notification.read ? "bg-muted/30" : ""
                    } hover:bg-muted/60`}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <NotificationIcon
                      type={notification.type as NotificationType}
                      size="sm"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm ${
                            !notification.read ? "font-medium" : ""
                          } line-clamp-1`}
                        >
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0"
                          onClick={(e) =>
                            handleRemoveNotification(notification.id, e)
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>
                  </div>
                  {notifications.indexOf(notification) <
                    notifications.length - 1 && (
                    <DropdownMenuSeparator className="m-0" />
                  )}
                </DropdownMenuItem>
              ))}

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs py-2 text-primary hover:text-primary/80"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load more"}
              </Button>
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
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh notifications"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
