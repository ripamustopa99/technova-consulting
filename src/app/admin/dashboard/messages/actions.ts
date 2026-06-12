'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMessageDetail(id: string) {
  try {
    const msg = await prisma.contactMessage.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        message: true,
        isRead: true,
        createdAt: true,
      }
    });
    return { success: true, data: msg };
  } catch (error) {
    console.error('Error fetching message:', error);
    return { success: false, data: null };
  }
}

export async function markAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath('/admin/dashboard/messages');
    return { success: true };
  } catch (error) {
    console.error('Error marking as read:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id }
    });
    revalidatePath('/admin/dashboard/messages');
    return { success: true };
  } catch (error) {
    console.error('Error deleting message:', error);
    return { success: false, error: 'Failed to delete message' };
  }
}
