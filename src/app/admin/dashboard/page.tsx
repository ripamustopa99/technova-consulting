import React from 'react';
import { prisma } from '@/lib/prisma';
import DashboardOverview from './DashboardOverview';

export default async function AdminDashboardPage() {
  let totalProjects = 0;
  let totalServices = 0;
  let totalArticles = 0;
  let totalMessages = 0;
  let recentMessages: any[] = [];
  let categoryData: { name: string; value: number }[] = [];
  let messageTrendData: { month: string; count: number }[] = [];

  try {
    // 1. Aggregate counts — paralel untuk kecepatan
    const [projects, services, articles, messages] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.blog.count(),
      prisma.contactMessage.count(),
    ]);
    totalProjects = projects;
    totalServices = services;
    totalArticles = articles;
    totalMessages = messages;

    // 2. Donut Chart — sebaran kategori proyek (groupBy)
    const categoryCounts = await prisma.project.groupBy({
      by: ['category'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    });
    categoryData = categoryCounts.map((c) => ({
      name: c.category || 'Uncategorized',
      value: c._count.id,
    }));

    // 3. Area Chart — tren pesan masuk per bulan (6 bulan terakhir)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const allMessages = await prisma.contactMessage.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by month
    const monthMap: Record<string, number> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Pre-fill 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      monthMap[key] = 0;
    }
    
    allMessages.forEach((msg) => {
      const d = new Date(msg.createdAt);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (monthMap[key] !== undefined) {
        monthMap[key]++;
      }
    });

    messageTrendData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));

    // 4. Recent Messages (5 terbaru)
    recentMessages = await prisma.contactMessage.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
  } catch (error) {
    console.error("Gagal terhubung ke database.", error);
  }

  return (
    <div style={{ padding: '24px' }}>
      <DashboardOverview
        totalProjects={totalProjects}
        totalServices={totalServices}
        totalArticles={totalArticles}
        totalMessages={totalMessages}
        recentMessages={recentMessages}
        categoryData={categoryData}
        messageTrendData={messageTrendData}
      />
    </div>
  );
}