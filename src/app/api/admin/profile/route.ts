import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rows = await prisma.setting.findMany({
      select: { key: true, value: true },
    });
    const settings: Record<string, string> = {};
    rows.forEach((r) => { settings[r.key] = r.value; });

    return NextResponse.json({
      success: true,
      data: {
        company_name: settings['company_name'] || 'TechNova',
        contact_email: settings['contact_email'] || 'info@technova.com',
      },
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
