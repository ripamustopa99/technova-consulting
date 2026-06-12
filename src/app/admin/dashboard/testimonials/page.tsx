import React from 'react';
import { prisma } from '@/lib/prisma';
import TestimonialsTable from './TestimonialsTable';

export default async function AdminTestimonialsPage() {
  // ATURAN EFISIENSI DATABASE:
  // Hanya select kolom yang ditampilkan di tabel (id, clientName, company, rating, createdAt).
  // Field panjang 'testimonial' (@db.Text) TIDAK ditarik untuk daftar — hanya diambil saat edit.
  let testimonialsData: any[] = [];
  try {
    testimonialsData = await prisma.testimonial.findMany({
      select: {
        id: true,
        clientName: true,
        company: true,
        rating: true,
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
      <div className="max-w-6xl mx-auto">
        <TestimonialsTable data={testimonialsData} />
      </div>
    </div>
  );
}
