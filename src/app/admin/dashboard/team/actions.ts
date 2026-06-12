'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { extractPublicId, deleteFromCloudinary } from '@/lib/cloudinary';

export async function getTeamMember(id: string) {
  try {
    const member = await prisma.teamMember.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        position: true,
        photo: true,
        bio: true,
        linkedin: true,
      },
    });
    return { success: true, data: member };
  } catch (error) {
    console.error('Error fetching team member:', error);
    return { success: false, data: null };
  }
}

export async function createTeamMember(data: any) {
  try {
    await prisma.teamMember.create({
      data: {
        name: data.name,
        position: data.position,
        photo: data.photo || null,
        bio: data.bio || null,
        linkedin: data.linkedin || null,
      },
    });
    revalidatePath('/admin/dashboard/team');
    return { success: true };
  } catch (error) {
    console.error('Error creating team member:', error);
    return { success: false, error: 'Failed to create team member' };
  }
}

export async function updateTeamMember(id: string, data: any) {
  try {
    // Cek apakah foto berubah — jika iya, hapus foto lama dari Cloudinary
    const existing = await prisma.teamMember.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (existing && existing.photo && existing.photo !== data.photo) {
      const publicId = extractPublicId(existing.photo);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        position: data.position,
        photo: data.photo || null,
        bio: data.bio || null,
        linkedin: data.linkedin || null,
      },
    });
    revalidatePath('/admin/dashboard/team');
    return { success: true };
  } catch (error) {
    console.error('Error updating team member:', error);
    return { success: false, error: 'Failed to update team member' };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    // Hapus foto fisik dari Cloudinary sebelum hapus record
    const existing = await prisma.teamMember.findUnique({
      where: { id },
      select: { photo: true },
    });

    if (existing && existing.photo) {
      const publicId = extractPublicId(existing.photo);
      if (publicId) {
        await deleteFromCloudinary(publicId);
      }
    }

    await prisma.teamMember.delete({
      where: { id },
    });
    revalidatePath('/admin/dashboard/team');
    return { success: true };
  } catch (error) {
    console.error('Error deleting team member:', error);
    return { success: false, error: 'Failed to delete team member' };
  }
}
