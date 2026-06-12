'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const socialLinkSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  isCustom: z.boolean(),
  customIconUrl: z.string().optional().nullable(),
  url: z.string().min(1, 'URL or Contact target is required'),
});

const settingsSchema = z.object({
  company_name: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  logo_url: z.string().optional().nullable(),
  favicon_url: z.string().optional().nullable(),
  contact_email: z.string().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  contact_address: z.string().optional().nullable(),
  social_links: z.array(socialLinkSchema).optional().nullable(),
});

export async function getSettings() {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });
    return { success: true, data: map };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { success: false, data: {} };
  }
}

export async function updateSettings(data: any) {
  try {
    const parsed = settingsSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || 'Invalid input data' };
    }

    const validatedData = parsed.data;

    // Simpan semua key-value ke database
    const entries = Object.entries(validatedData);
    for (const [key, value] of entries) {
      if (value !== undefined && value !== null) {
        let dbValue = '';
        if (key === 'social_links') {
          // Bersihkan dan format platform name menjadi lowercase
          const formattedLinks = (value as any[]).map((link) => ({
            platform: link.platform.toLowerCase().trim(),
            isCustom: link.isCustom,
            customIconUrl: link.isCustom ? link.customIconUrl : undefined,
            url: link.url,
          }));
          dbValue = JSON.stringify(formattedLinks);
        } else {
          dbValue = String(value);
        }

        await prisma.setting.upsert({
          where: { key },
          update: { value: dbValue },
          create: { key, value: dbValue },
        });
      }
    }

    revalidatePath('/admin/dashboard/settings');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

