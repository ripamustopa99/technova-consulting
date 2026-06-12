import React from 'react';
import { prisma } from '@/lib/prisma';
import PortfolioTable from './PortfolioTable';

export default async function AdminPortfolioPage() {
  // ATURAN KETAT: EFISIENSI DATABASE (.cursorrules)
  // Hanya tarik data yang benar-benar akan ditampilkan di tabel dashboard 
  // (Project Name, Client, Category, Featured) ditambah ID untuk key.
  let projectsData: any[] = [];
  try {
    projectsData = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        client: true,
        category: true,
        featured: true,
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
        <PortfolioTable data={projectsData} />
      </div>
    </div>
  );
}