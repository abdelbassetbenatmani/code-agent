"use server";

import { prisma } from "@/lib/prisma";
import { NotificationsTypes } from "@/prisma/types";

export async function createNotification({
  userId,
  type,
  title,
  message,
}: NotificationsTypes) {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
    },
  });
}
export async function getNotifications(userId: string) {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
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
