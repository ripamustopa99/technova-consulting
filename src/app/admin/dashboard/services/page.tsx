import React from 'react';
import { prisma } from '@/lib/prisma';
import ServicesTable from './ServicesTable';

export default async function AdminServicesPage() {
  // ATURAN EFISIENSI DATABASE: 
  // Hanya mengambil kolom id, title, status, dan updatedAt karena hanya ini yang dirender di tabel.
  let servicesData: any[] = [];
  try {
    servicesData = await prisma.service.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Gagal terhubung ke database. Menampilkan data kosong sementara.", error);
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <ServicesTable data={servicesData} />
      </div>
    </div>
  );
}