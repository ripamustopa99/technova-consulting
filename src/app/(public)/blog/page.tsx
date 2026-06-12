import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700', '800'], 
  display: 'swap' 
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600'], 
  display: 'swap' 
});

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read the latest insights, technology articles, and business transformation guides from TechNova Consulting.',
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// Helper to strip HTML tags for summary snippet
function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').substring(0, 140) + '...';
}

export default async function BlogPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';

  let blogs: any[] = [];

  try {
    blogs = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        ...(query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        author: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen pb-24`}>
      {/* 1. HERO & SEARCH */}
      <section className="relative pt-20 pb-12 lg:pt-28 lg:pb-16 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium text-sm tracking-wide">
              Our Insights
            </div>
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-6xl font-extrabold tracking-tight mb-6`}>
              Latest{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                Insights
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
              Discover industry trends, technological breakthroughs, and executive strategies for the modern digital era.
            </p>

            {/* Search Bar Form */}
            <form action="/blog" method="GET" className="max-w-md mx-auto relative group">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search articles..."
                className="w-full px-5 py-3.5 bg-slate-900/80 border border-slate-800 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl text-white text-sm outline-none transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-lg transition-all duration-200"
              >
                Search
              </button>
            </form>
          </FadeInUp>
        </div>
      </section>

      {/* 2. BLOG LIST GRID */}
      <section className="px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <FadeInUp key={blog.id} delay={index * 0.08}>
                  <Link href={`/blog/${blog.slug}`} className="block group h-full">
                    <div className="relative h-full rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.1)] hover:-translate-y-2 flex flex-col">
                      {/* Image Thumbnail */}
                      <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-cyan-900/30 flex items-center justify-center">
                            <span className="text-4xl">📚</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Metadata */}
                          <div className="flex items-center gap-3 text-slate-500 text-xs font-medium mb-3">
                            <span>By {blog.author}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                            <span>
                              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className={`${plusJakartaSans.className} text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300 leading-snug line-clamp-2`}>
                            {blog.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {stripHtml(blog.content)}
                          </p>
                        </div>

                        {/* Read More */}
                        <div className="flex items-center text-cyan-400 text-sm font-semibold mt-auto">
                          Read Full Article
                          <svg className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeInUp>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
              <p className="text-slate-500 text-lg mb-2">No articles found.</p>
              {query && (
                <Link href="/blog" className="text-cyan-400 text-sm hover:underline">
                  Clear search filters
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}