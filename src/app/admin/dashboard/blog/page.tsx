import React from 'react';
import { prisma } from '@/lib/prisma';
import BlogTable from './BlogTable';

export default async function AdminBlogPage() {
  // ATURAN EFISIENSI DATABASE
  // Hanya menarik data yang tampil di tabel: id, title, author, status, createdAt
  let blogsData: any[] = [];
  try {
    blogsData = await prisma.blog.findMany({
      select: {
        id: true,
        title: true,
        author: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Gagal terhubung ke database. Menampilkan data kosong.", error);
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <BlogTable data={blogsData} />
      </div>
    </div>
  );
}