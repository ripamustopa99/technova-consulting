import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const unreadMessages = await prisma.contactMessage.findMany({
      where: {
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    const totalUnreadCount = await prisma.contactMessage.count({
      where: { isRead: false },
    });

    return NextResponse.json({ 
      success: true, 
      messages: unreadMessages,
      total: totalUnreadCount
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memuat notifikasi' },
      { status: 500 }
    );
  }
}
