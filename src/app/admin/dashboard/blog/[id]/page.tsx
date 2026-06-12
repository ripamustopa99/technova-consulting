import React from 'react';
import { prisma } from '@/lib/prisma';
import BlogForm from './BlogForm';
import { notFound } from 'next/navigation';

export default async function AdminBlogFormPage({ params }: { params: Promise<{ id: string }> }) {
  // Await the params to resolve (Next.js 16 requirement)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  let initialData = null;

  if (id !== 'create') {
    initialData = await prisma.blog.findUnique({
      where: { id }
    });

    if (!initialData) {
      notFound();
    }
  }

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <BlogForm initialData={initialData} />
      </div>
    </div>
  );
}