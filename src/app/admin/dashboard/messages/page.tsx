import React from 'react';
import { prisma } from '@/lib/prisma';
import MessagesLayout from './MessagesLayout';

export default async function AdminMessagesPage() {
  // ATURAN EFISIENSI DATABASE:
  // Untuk list panel kiri, hanya tarik: id, name, email, isRead, createdAt.
  // Field panjang 'message' (@db.Text) TIDAK ditarik — hanya diambil on-demand saat diklik.
  let messagesData: any[] = [];
  try {
    messagesData = await prisma.contactMessage.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Gagal terhubung ke database.", error);
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <MessagesLayout data={messagesData} />
      </div>
    </div>
  );
}