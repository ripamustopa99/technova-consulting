'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

export async function getTestimonial(id: string) {
  try {
    const testimonial = await prisma.testimonial.findUnique({
      where: { id },
      select: {
        id: true,
        clientName: true,
        company: true,
        position: true,
        photo: true,
        testimonial: true,
        rating: true,
      },
    });
    return { success: true, data: testimonial };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return { success: false, data: null };
  }
}

export async function createTestimonial(data: any) {
  try {
    await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        company: data.company || null,
        position: data.position || null,
        photo: data.photo || null,
        testimonial: data.testimonial,
        rating: data.rating ? Number(data.rating) : 5,
      },
    });
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return { success: false, error: 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    // Cek apakah foto berubah — jika iya, hapus foto lama dari Cloudinary
    const existing = await prisma.testimonial.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (existing && existing.photo && existing.photo !== data.photo) {
      const publicId = extractPublicId(existing.photo);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: data.clientName,
        company: data.company || null,
        position: data.position || null,
        photo: data.photo || null,
        testimonial: data.testimonial,
        rating: data.rating ? Number(data.rating) : 5,
      },
    });
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return { success: false, error: 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    // Hapus foto fisik dari Cloudinary sebelum hapus record
    const existing = await prisma.testimonial.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (existing && existing.photo) {
      const publicId = extractPublicId(existing.photo);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await prisma.testimonial.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/testimonials');
    return { success: true };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return { success: false, error: 'Failed to delete testimonial' };
  }
}
