import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Services',
  description: 'Explore TechNova Consulting comprehensive technology services: cloud solutions, web development, cybersecurity, and more.',
};

export default async function ServicesPage() {
  let services: any[] = [];

  try {
    services = await prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true, 
        slug: true,
        description: true,
        image: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
  }

  const serviceIcons: Record<string, string> = {
    cloud: '☁️', web: '🌐', mobile: '📱', security: '🛡️',
    data: '📊', ai: '🤖', devops: '⚙️', consulting: '💼',
  };

  const getIcon = (service: { title: string; image: string | null }) => {
    // If image is an emoji (not a URL), use it directly
    if (service.image && !service.image.startsWith('http')) return service.image;
    // Fallback: match title keyword
    const lower = service.title.toLowerCase();
    for (const [key, icon] of Object.entries(serviceIcons)) {
      if (lower.includes(key)) return icon;
    }
    return '⚡';
  };

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50`}>
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium text-sm tracking-wide">
              What We Offer
            </div>
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-6xl font-extrabold tracking-tight mb-5`}>
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                Services
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Comprehensive technology solutions tailored to empower your business with innovation, scalability, and resilience.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Services List */}
      <section className="px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          {services.length > 0 ? (
            <div className="space-y-6">
              {services.map((service, index) => (
                <FadeInUp key={service.id} delay={index * 0.1}>
                  <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md p-8 lg:p-10 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_rgba(6,182,212,0.08)] group overflow-hidden">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/3 to-indigo-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {service.image && service.image.startsWith('http') ? (
                          <img src={service.image} alt={service.title} className="w-8 h-8 object-contain" />
                        ) : (
                          <span className="text-3xl">{getIcon(service)}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors`}>
                          {service.title}
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-5">
                          {service.description}
                        </p>

                        {/* Benefits */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Enterprise-Grade Quality
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            24/7 Dedicated Support
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Scalable Architecture
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <svg className="w-4 h-4 text-cyan-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            Fast Delivery Cycle
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0 self-center flex flex-col sm:flex-row gap-3">
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium text-sm hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
                        >
                          Learn More
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 font-medium text-sm hover:border-cyan-500/40 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
                        >
                          Get Quote
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Belum ada layanan untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <FadeInUp>
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.3),transparent_60%)]" />
              <div className="relative z-10 px-8 py-14 lg:px-14 lg:py-16 text-center">
                <h2 className={`${plusJakartaSans.className} text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-4`}>
                  Need a Custom Solution?
                </h2>
                <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
                  Let&apos;s discuss how our services can be tailored to your specific business needs.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center px-10 py-4 bg-white text-indigo-700 font-bold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                  Contact Us
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  );
}