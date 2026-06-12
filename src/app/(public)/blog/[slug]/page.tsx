import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { prisma } from '@/lib/prisma';

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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: {
      title: true,
      content: true,
    },
  });

  if (!blog) {
    return { title: 'Article Not Found | TechNova' };
  }

  // Strip HTML for dynamic description snippet
  const snippet = blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

  return {
    title: `${blog.title} | TechNova Insights`,
    description: snippet,
    openGraph: {
      title: blog.title,
      description: snippet,
      type: 'article',
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let blog = null;
  let recentPosts: any[] = [];

  try {
    blog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (blog) {
      recentPosts = await prisma.blog.findMany({
        where: {
          status: 'PUBLISHED',
          NOT: { id: blog.id },
        },
        select: {
          id: true,
          title: true,
          slug: true,
          image: true,
          createdAt: true,
        },
        take: 2,
        orderBy: { createdAt: 'desc' },
      });
    }
  } catch (error) {
    console.error('Error fetching blog detail:', error);
  }

  if (!blog) {
    notFound();
  }

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen pb-24`}>
      {/* 1. TOP HEADER & BACKGROUND GLOW */}
      <div className="relative pt-24 lg:pt-32 pb-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-slate-400 hover:text-cyan-400 text-sm font-semibold mb-8 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Insights
          </Link>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-slate-400 text-sm font-semibold mb-4">
            <span>By {blog.author}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          {/* Heading */}
          <h1 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-8`}>
            {blog.title}
          </h1>

          {/* Feature Cover Image */}
          {blog.image && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 shadow-2xl mb-12">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <section className="px-6">
        <div className="max-w-3xl mx-auto">
          {/* Custom CSS targets to make rich text editor HTML render beautifully */}
          <article
            className="prose-custom [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-slate-300 [&_p]:text-base md:[&_p]:text-[17px] [&_h2]:text-2xl lg:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_li]:mb-2 [&_li]:text-slate-300 [&_a]:text-cyan-400 [&_a]:underline hover:[&_a]:text-cyan-300 [&_strong]:text-white [&_em]:text-slate-200 [&_blockquote]:border-l-4 [&_blockquote]:border-cyan-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_blockquote]:my-6 [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:text-sm [&_pre]:my-6"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </section>

      {/* 3. RECOMMENDED READING SECTION */}
      {recentPosts.length > 0 && (
        <section className="mt-20 border-t border-slate-900 pt-16 px-6">
          <div className="max-w-3xl mx-auto">
            <h3 className={`${plusJakartaSans.className} text-2xl font-bold text-white mb-8`}>
              More Insights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="p-5 rounded-2xl border border-slate-900 hover:border-slate-800 bg-slate-900/30 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div>
                      {post.image && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 bg-slate-800">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h4 className="font-bold text-white text-[15px] group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                    <span className="text-slate-500 text-xs font-semibold mt-4 block">
                      {new Date(post.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}