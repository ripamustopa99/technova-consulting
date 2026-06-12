import React from 'react';
import { prisma } from '@/lib/prisma';
import TeamGrid from './TeamGrid';

export default async function AdminTeamPage() {
  // ATURAN EFISIENSI DATABASE:
  // Hanya select kolom yang ditampilkan di card grid (id, name, position, photo).
  // Field panjang seperti 'bio' dan 'linkedin' TIDAK ditarik untuk daftar.
  let teamData: any[] = [];
  try {
    teamData = await prisma.teamMember.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        photo: true,
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
        <TeamGrid data={teamData} />
      </div>
    </div>
  );
}