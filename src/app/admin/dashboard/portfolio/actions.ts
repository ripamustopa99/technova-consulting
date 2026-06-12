'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

export async function createProject(data: any) {
  try {
    // Basic slug generation dari title
    const baseSlug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    await prisma.project.create({
      data: {
        title: data.title,
        slug: slug,
        client: data.client,
        category: data.category,
        technology: data.technology ? data.technology.join(', ') : null,
        challenge: data.challenge,
        solution: data.solution,
        result: data.result,
        featured: data.featured || false,
        images: {
          create: (data.images || []).map((imgUrl: string) => ({ image: imgUrl })),
        },
      },
    });

    revalidatePath('/admin/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: any) {
  try {
    // 1. Ambil data gambar project yang ada di database saat ini
    const existing = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    const existingUrls = existing?.images.map((img) => img.image) || [];

    // 2. Identifikasi gambar mana yang dihapus dari form UI
    const newUrls: string[] = data.images || [];
    const urlsToDelete = existingUrls.filter((url) => !newUrls.includes(url));

    // Hapus fisik gambar yang dibuang dari Cloudinary
    for (const url of urlsToDelete) {
      const publicId = extractPublicId(url);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    // 3. Update data project di database (hapus relasi gambar lama & buat relasi baru)
    await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        client: data.client,
        category: data.category,
        technology: data.technology ? data.technology.join(', ') : null,
        challenge: data.challenge,
        solution: data.solution,
        result: data.result,
        featured: data.featured || false,
        images: {
          deleteMany: {},
          create: newUrls.map((imgUrl: string) => ({ image: imgUrl })),
        },
      },
    });

    revalidatePath('/admin/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    // 1. Ambil daftar gambar project
    const existing = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    // 2. Hapus fisik seluruh gambar di Cloudinary
    if (existing) {
      for (const img of existing.images) {
        const publicId = extractPublicId(img.image);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }
      }
    }

    // 3. Hapus record project dari database
    await prisma.project.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/portfolio');
    revalidatePath('/portfolio');
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}

export async function getProjectDetail(id: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });
    return { success: true, data: project };
  } catch (error) {
    console.error('Error fetching project detail:', error);
    return { success: false, data: null };
  }
}
