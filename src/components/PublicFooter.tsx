import React from 'react';
import Link from 'next/link';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import {
  WhatsAppIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon
} from '@/components/AntdIcons';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

function renderPlatformIcon(platformName: string, isCustom: boolean, customIconUrl?: string) {
  const name = platformName.toLowerCase().trim();
  if (!isCustom) {
    if (name === 'whatsapp') {
      return <WhatsAppIcon style={{ color: '#25D366' }} className="text-lg" />;
    }
    if (name === 'instagram') {
      return <InstagramIcon style={{ color: '#E1306C' }} className="text-lg" />;
    }
    if (name === 'linkedin') {
      return <LinkedinIcon style={{ color: '#0077B5' }} className="text-lg" />;
    }
    if (name === 'email') {
      return <MailIcon style={{ color: '#EA4335' }} className="text-lg" />;
    }
  }

  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt={platformName}
        className="w-4 h-4 object-contain"
      />
    );
  }

  return null;
}

function formatPlatformUrl(platform: string, url: string): string {
  const cleanedPlatform = platform.toLowerCase().trim();
  if (cleanedPlatform === 'whatsapp') {
    const cleanPhone = url.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0')
      ? '62' + cleanPhone.slice(1)
      : cleanPhone;
    return `https://wa.me/${phoneWithCountry}`;
  }
  if (cleanedPlatform === 'email') {
    if (url.startsWith('mailto:')) return url;
    return `mailto:${url}`;
  }
  return url;
}

function getBrandHoverClasses(platformName: string): string {
  const name = platformName.toLowerCase().trim();
  switch (name) {
    case 'whatsapp':
      return 'hover:text-[#25D366] hover:border-[#25D366]/30 hover:bg-[#25D366]/10 text-slate-400';
    case 'instagram':
      return 'hover:text-[#E1306C] hover:border-[#E1306C]/30 hover:bg-[#E1306C]/10 text-slate-400';
    case 'linkedin':
      return 'hover:text-[#0077B5] hover:border-[#0077B5]/30 hover:bg-[#0077B5]/10 text-slate-400';
    case 'email':
      return 'hover:text-[#EA4335] hover:border-[#EA4335]/30 hover:bg-[#EA4335]/10 text-slate-400';
    default:
      return 'hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 text-slate-400';
  }
}

export default async function PublicFooter() {
  const currentYear = new Date().getFullYear();

  let settings: Record<string, string> = {};
  try {
    const rows = await prisma.setting.findMany({
      select: { key: true, value: true },
    });
    rows.forEach((r) => { settings[r.key] = r.value; });
  } catch (error) {
    // Fallback jika DB error
  }

  const email = settings['contact_email'] || 'info@technova.com';
  const phone = settings['contact_phone'] || '+62 812 3456 7890';
  const whatsapp = settings['whatsapp'] || phone.replace(/[^0-9]/g, '');
  const address = settings['contact_address'] || 'Jakarta, Indonesia';

  let socialLinks: { platform: string; isCustom: boolean; customIconUrl?: string; url: string }[] = [];
  try {
    if (settings['social_links']) {
      socialLinks = JSON.parse(settings['social_links']);
    } else {
      // Data fallback default
      socialLinks = [
        { platform: 'linkedin', isCustom: false, url: '#' },
        { platform: 'instagram', isCustom: false, url: '#' },
        { platform: 'whatsapp', isCustom: false, url: phone },
        { platform: 'email', isCustom: false, url: email },
      ];
    }
  } catch (error) {
    console.error('Gagal memparsing social_links:', error);
  }

  return (
    <footer className={`${inter.className} bg-slate-950 border-t border-slate-800/50`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1: Logo & Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">TN</span>
              </div>
              <span className={`${plusJakartaSans.className} text-white font-bold text-xl tracking-tight`}>
                TechNova
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering enterprises with cutting-edge technology solutions. We build robust, scalable systems for the digital age.
            </p>
            {/* Social Icons Dinamis */}
            <div className="flex items-center gap-3 flex-wrap animate-fade-in">
              {socialLinks.map((link, idx) => {
                const href = formatPlatformUrl(link.platform, link.url);
                return (
                  <a
                    key={idx}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className={`w-9 h-9 rounded-lg bg-slate-800/60 border border-slate-700/50 flex items-center justify-center transition-all duration-200 ${getBrandHoverClasses(link.platform)}`}
                  >
                    {renderPlatformIcon(link.platform, link.isCustom, link.customIconUrl)}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className={`${plusJakartaSans.className} text-white font-bold text-sm uppercase tracking-widest mb-5`}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <h4 className={`${plusJakartaSans.className} text-white font-bold text-sm uppercase tracking-widest mb-5`}>
              Legal
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info (DYNAMIC) */}
          <div>
            <h4 className={`${plusJakartaSans.className} text-white font-bold text-sm uppercase tracking-widest mb-5`}>
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2.5 hover:text-cyan-400 transition-colors">
                  <svg className="w-4 h-4 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>{email}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 hover:text-green-400 transition-colors">
                  <svg className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span>{phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span>{address}</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            &copy; {currentYear} TechNova Consulting. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built with Next.js &amp; Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
