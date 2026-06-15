'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getService(id: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        image: true,
        status: true,
      },
    });
    return { success: true, data: service };
  } catch (error) {
    console.error('Error fetching service:', error);
    return { success: false, data: null };
  }
}

export async function createService(data: any) {
  try {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    await prisma.service.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        image: data.image || null,
        status: data.status || 'PUBLISHED',
      },
    });
    revalidatePath('/admin/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('Error creating service:', error);
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateService(id: string, data: any) {
  try {
    await prisma.service.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        image: data.image || null,
        status: data.status,
      },
    });

    revalidatePath('/admin/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('Error updating service:', error);
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id },
    });

    revalidatePath('/admin/dashboard/services');
    revalidatePath('/services');
    return { success: true };
  } catch (error) {
    console.error('Error deleting service:', error);
    return { success: false, error: 'Failed to delete service' };
  }
}
