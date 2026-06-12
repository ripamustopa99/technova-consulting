'use server';

import { prisma } from '@/lib/prisma';

export async function submitContactForm(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.message) {
      return { success: false, error: 'Harap lengkapi semua field yang wajib diisi.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Format email tidak valid.' };
    }

    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        company: data.company || null,
        message: data.message,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return { success: false, error: 'Terjadi kesalahan server. Silakan coba lagi.' };
  }
}
