import { create } from "zustand";
import { persist } from "zustand/middleware";
import { NotificationsTypes } from "../../prisma/types";

interface NotificationState {
  notifications: NotificationsTypes[];
  unreadCount: number; // Optional: to keep track of unread notifications
  setUnreadCount: (count: number) => void; // Optional: to update unread
  addNotification: (notification: NotificationsTypes) => void;
  removeNotification: (id: string) => void;
  setNotifications: (notifications: NotificationsTypes[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0, // Initialize unread count
      setUnreadCount: (count) => set({ unreadCount: count }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      setNotifications: (notifications) =>
        set(() => ({
          notifications,
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
    }),
    {
      name: "notification-storage",
    }
  )
);
