import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const service = await prisma.service.findUnique({
    where: { slug },
  });

  if (!service) {
    notFound();
  }

  return (
    <div className={`min-h-screen pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto text-slate-300 ${inter.className}`}>
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-slate-500">
        <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-cyan-400 transition-colors">Services</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-300">{service.title}</span>
      </nav>

      <div className="mb-10">
        {service.image && service.image.startsWith('http') && (
          <div className="w-20 h-20 mb-8 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <img src={service.image} alt={service.title} className="w-10 h-10 object-cover overflow-hidden" />
          </div>
        )}
        <h1 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight`}>
          {service.title}
        </h1>
      </div>

      <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed">
        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
          {service.description}
        </p>

        <div className="mt-12 p-8 rounded-2xl border border-slate-800 bg-slate-900/50">
          <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-white mb-4`}>
            Interested in this service?
          </h2>
          <p className="text-slate-400 mb-6">
            Contact us to learn more about how we can help your business with {service.title.toLowerCase()}.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition-all duration-300 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            Get in Touch
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

