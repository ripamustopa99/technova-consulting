import React from 'react';
import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export default async function AdminSettingsPage() {
  // Ambil semua key-value dari tabel settings
  let settingsMap: Record<string, string> = {};
  try {
    const settings = await prisma.setting.findMany({
      select: {
        key: true,
        value: true,
      }
    });
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });
  } catch (error) {
    console.error("Gagal terhubung ke database.", error);
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <SettingsForm initialData={settingsMap} />
      </div>
    </div>
  );
}