'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createBlog(data: any) {
  try {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await prisma.blog.create({
      data: {
        title: data.title,
        slug: slug,
        author: data.author || 'Admin',
        status: data.status || 'DRAFT',
        content: data.content,
      }
    });
    revalidatePath('/admin/dashboard/blog');
    return { success: true };
  } catch (error) {
    console.error('Error creating blog:', error);
    return { success: false, error: 'Failed to create blog' };
  }
}

export async function updateBlog(id: string, data: any) {
  try {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await prisma.blog.update({
      where: { id },
      data: {
        title: data.title,
        slug: slug,
        author: data.author,
        status: data.status,
        content: data.content,
      }
    });
    revalidatePath('/admin/dashboard/blog');
    return { success: true };
  } catch (error) {
    console.error('Error updating blog:', error);
    return { success: false, error: 'Failed to update blog' };
  }
}

export async function deleteBlog(id: string) {
  try {
    await prisma.blog.delete({
      where: { id }
    });
    revalidatePath('/admin/dashboard/blog');
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return { success: false, error: 'Failed to delete blog' };
  }
}
