import type { Metadata } from 'next';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: {
    default: 'TechNova Consulting | Transforming Enterprises',
    template: '%s | TechNova Consulting',
  },
  description:
    'TechNova Consulting delivers elite IT consulting, enterprise software development, cloud solutions, and cybersecurity services to accelerate your digital transformation.',
  keywords: [
    'IT Consulting',
    'Web Development',
    'Cloud Solutions',
    'Cybersecurity',
    'Enterprise Software',
    'Digital Transformation',
    'TechNova',
  ],
  authors: [{ name: 'TechNova Consulting' }],
  creator: 'TechNova Consulting',
  openGraph: {
    title: 'TechNova Consulting | Transforming Enterprises',
    description:
      'We engineer robust, scalable software systems, cutting-edge cloud infrastructure, and military-grade cybersecurity solutions.',
    url: 'https://technova.com',
    siteName: 'TechNova Consulting',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechNova Consulting | Transforming Enterprises',
    description:
      'We engineer robust, scalable software systems, cutting-edge cloud infrastructure, and military-grade cybersecurity solutions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch general settings
  let companyName = 'TechNova Consulting';
  try {
    const rows = await prisma.setting.findMany({ select: { key: true, value: true } });
    const settings: Record<string, string> = {};
    rows.forEach((r) => { settings[r.key] = r.value; });
    if (settings['company_name']) companyName = settings['company_name'];
  } catch (error) {
    console.error('Failed to fetch settings:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <PublicNavbar companyName={companyName} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
