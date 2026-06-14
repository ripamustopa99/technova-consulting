import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';
import ContactForm from './ContactForm';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with TechNova Consulting. We are ready to help transform your business with cutting-edge technology solutions.',
};

export default async function ContactPage() {
  // Fetch settings data untuk info kontak
  const contactInfo: Record<string, string> = {};

  try {
    const settings = await prisma.setting.findMany({
      select: { key: true, value: true },
    });
    settings.forEach((s) => {
      contactInfo[s.key] = s.value;
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
  }

  const email = contactInfo['contact_email'] || 'info@technova.com';
  const phone = contactInfo['contact_phone'] || '+62 812 3456 7890';
  const whatsapp = contactInfo['whatsapp'] || phone.replace(/[^0-9]/g, '');
  const address = contactInfo['contact_address'] || 'Jakarta, Indonesia';

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50`}>
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium text-sm tracking-wide">
              Get In Touch
            </div>
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-6xl font-extrabold tracking-tight mb-5`}>
              Let&apos;s{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                Connect
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Send us a message and we&apos;ll get back to you as soon as possible.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Contact Info Cards */}
            <div className="lg:col-span-2 space-y-5">
              <FadeInUp delay={0}>
                <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md group hover:border-cyan-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className={`${plusJakartaSans.className} text-white font-bold mb-1`}>Email</h3>
                  <a href={`mailto:${email}`} className="text-slate-400 text-sm hover:text-cyan-400 transition-colors">
                    {email}
                  </a>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.1}>
                <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md group hover:border-green-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  </div>
                  <h3 className={`${plusJakartaSans.className} text-white font-bold mb-1`}>WhatsApp</h3>
                  <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-slate-400 text-sm hover:text-green-400 transition-colors">
                    {phone}
                  </a>
                </div>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md group hover:border-indigo-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <h3 className={`${plusJakartaSans.className} text-white font-bold mb-1`}>Address</h3>
                  <p className="text-slate-400 text-sm">{address}</p>
                </div>
              </FadeInUp>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <FadeInUp delay={0.15}>
                <div className="p-8 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md">
                  <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-white mb-1`}>
                    Send us a Message
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">Fill in the form below and we&apos;ll get back to you shortly.</p>
                  <ContactForm />
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}