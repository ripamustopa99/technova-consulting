import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Explore our portfolio of successful projects delivering real business impact for enterprise clients worldwide.',
};

export default async function PortfolioPage() {
  let projects: any[] = [];

  try {
    projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        client: true,
        category: true,
        technology: true,
        images: {
          select: { image: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50`}>
      {/* Hero Banner */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-medium text-sm tracking-wide">
              Our Work
            </div>
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-6xl font-extrabold tracking-tight mb-5`}>
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                Portfolio
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Discover how we&apos;ve helped enterprises transform through innovative technology solutions.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <FadeInUp key={project.id} delay={index * 0.08}>
                  <Link href={`/portfolio/${project.slug}`} className="block group">
                    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_0_50px_rgba(79,70,229,0.1)] hover:-translate-y-2">
                      {/* Thumbnail */}
                      <div className="relative w-full h-52 bg-slate-800 overflow-hidden">
                        {project.images && project.images[0] ? (
                          <img
                            src={project.images[0].image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <svg className="w-14 h-14 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        {project.category && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className={`${plusJakartaSans.className} text-lg font-bold text-white mb-1.5 group-hover:text-indigo-400 transition-colors`}>
                          {project.title}
                        </h3>
                        {project.client && (
                          <p className="text-slate-500 text-sm mb-2">
                            Client: <span className="text-slate-400">{project.client}</span>
                          </p>
                        )}
                        {project.technology && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {project.technology.split(',').slice(0, 3).map((tech: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 text-slate-400 text-xs rounded-md">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </FadeInUp>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Belum ada proyek untuk ditampilkan.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}