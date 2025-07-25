"use server";

import { prisma } from "@/lib/prisma";
import { NotificationsTypes } from "@/prisma/types";

export async function createNotification({
  userId,
  type,
  title,
  message,
}: {
  userId: string;
  type: NotificationsTypes["type"];
  title: string;
  message: string;
}) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      read: false,
    },
  });
}

export async function sendNotiificationToMultipleUsers({
  userIds,
  type,
  title,
  message,
}: {
  userIds: string[];
  type: NotificationsTypes["type"];
  title: string;
  message: string;
}) {
  const notifications = userIds.map((userId) => ({
    userId,
    type,
    title,
    message,
    read: false,
  }));

  console.log("Creating notifications for users:", userIds);

  return await prisma.notification.createMany({
    data: notifications,
  });
}

export async function getNotifications({
  userId,
  page = 1,
  limit = 10,
  cursor,
}: {
  userId: string;
  page?: number;
  limit?: number;
  cursor?: string;
}) {
  // Calculate skip for page-based pagination (used as fallback)
  const skip = (page - 1) * limit;

  // Prepare the query
  const query: any = {
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  };

  // If cursor is provided, use cursor-based pagination (more efficient for "load more")
  if (cursor) {
    query.cursor = {
      id: cursor,
    };
    query.skip = 1; // Skip the cursor item itself
  } else {
    // Otherwise use offset pagination
    query.skip = skip;
  }

  // Execute query to get the notifications
  const notifications = await prisma.notification.findMany(query);

  // Get total count for pagination metadata
  const totalCount = await prisma.notification.count({
    where: { userId },
  });

  // Get the last item's ID to use as next cursor
  const nextCursor =
    notifications.length > 0
      ? notifications[notifications.length - 1].id
      : null;

  // Calculate pagination metadata
  const hasMore = page * limit < totalCount || nextCursor !== null;

  return {
    notifications,
    pagination: {
      page,
      limit,
      totalCount,
      hasMore,
      nextCursor,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllNotificationsAsRead(userId: string) {
  return await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(notificationId: string) {
  return await prisma.notification.delete({
    where: { id: notificationId },
  });
}

export async function deleteAllNotifications(userId: string) {
  return await prisma.notification.deleteMany({
    where: { userId },
  });
}
