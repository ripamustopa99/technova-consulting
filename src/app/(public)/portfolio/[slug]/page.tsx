import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { prisma } from '@/lib/prisma';

// Font Configuration
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  weight: ['400', '500'],
  display: 'swap',
});

// Next.js 16 requires async params
interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SEO Metadata Generation
 * Mengambil title, deskripsi, dan image dari database sesuai dengan slug.
 * Sesuai aturan: menggunakan `select` agar query efisien.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const project = await prisma.project.findUnique({
    where: { slug },
    select: {
      title: true,
      challenge: true,
      images: {
        select: { image: true },
        take: 1
      }
    }
  });

  if (!project) return { title: 'Project Not Found | TechNova' };

  // Generate description from challenge snippet
  const description = project.challenge?.substring(0, 160) || `Detailed case study and portfolio for ${project.title}.`;
  const ogImage = project.images[0]?.image || '/default-og.jpg';

  return {
    title: `${project.title} | TechNova Consulting Portfolio`,
    description,
    openGraph: {
      title: project.title,
      description,
      images: [ogImage],
    }
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  // Await the parameters (Next.js 16 requirement)
  const { slug } = await params;

  let project = null;
  try {
    project = await prisma.project.findUnique({
      where: { slug },
      select: {
        title: true,
        client: true,
        category: true,
        technology: true,
        challenge: true,
        solution: true,
        result: true,
        images: { 
          select: { id: true, image: true } 
        }
      }
    });
  } catch (error) {
    console.error("Gagal terhubung ke database. Menampilkan dummy data sementara.", error);
    // Dummy fallback for UI testing without DB
    project = {
      title: "Sample Project (DB Error)",
      client: "Sample Client",
      category: "Web Development",
      technology: "React, Next.js",
      challenge: "Database connection failed.",
      solution: "Check your .env file.",
      result: "Configure DATABASE_URL correctly.",
      images: []
    };
  }

  // Jika slug tidak ada di DB, arahkan ke 404
  if (!project) notFound();

  // Parsing data
  const techStack = project.technology ? project.technology.split(',').map(t => t.trim()) : [];
  const coverImage = project.images.length > 0 ? project.images[0].image : null;
  const galleryImages = project.images.slice(1);

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-50 ${inter.className} pt-24 lg:pt-32 pb-20`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Banner Image Section */}
        {coverImage && (
          <div className="relative w-full h-[40vh] md:h-[50vh] rounded-2xl overflow-hidden mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-slate-800">
            <Image 
              src={coverImage}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent mix-blend-multiply" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Metadata (Sticky Box) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-32 space-y-8 bg-slate-900/40 p-8 rounded-2xl border border-slate-800/60 backdrop-blur-xl shadow-xl">
              <h1 className={`${plusJakartaSans.className} text-3xl md:text-4xl font-bold text-white leading-tight`}>
                {project.title}
              </h1>
              
              <div className="space-y-6 pt-4 border-t border-slate-800/80">
                {/* Client Name */}
                {project.client && (
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Client</span>
                    <span className="text-lg text-slate-200">{project.client}</span>
                  </div>
                )}
                
                {/* Industry / Category */}
                {project.category && (
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Industry / Category</span>
                    <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-sm border border-cyan-500/20 font-medium">
                      {project.category}
                    </span>
                  </div>
                )}
                
                {/* Tech Stack Tags */}
                {techStack.length > 0 && (
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tech Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-md text-xs font-medium border border-indigo-500/20">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Case Study Content Streams */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* The Challenge */}
            {project.challenge && (
              <section>
                <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-cyan-400 mb-5 flex items-center`}>
                  <span className="w-8 h-[2px] bg-cyan-400 mr-4" />
                  The Challenge
                </h2>
                <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-300 whitespace-pre-wrap text-lg">
                  {project.challenge}
                </div>
              </section>
            )}

            {/* The Solution */}
            {project.solution && (
              <section>
                <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-indigo-400 mb-5 flex items-center`}>
                  <span className="w-8 h-[2px] bg-indigo-400 mr-4" />
                  The Solution
                </h2>
                <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-300 whitespace-pre-wrap text-lg">
                  {project.solution}
                </div>
              </section>
            )}

            {/* The Results */}
            {project.result && (
              <section>
                <h2 className={`${plusJakartaSans.className} text-2xl font-bold text-emerald-400 mb-5 flex items-center`}>
                  <span className="w-8 h-[2px] bg-emerald-400 mr-4" />
                  The Results
                </h2>
                <div className="prose prose-invert prose-slate max-w-none prose-p:leading-relaxed prose-p:text-emerald-100 whitespace-pre-wrap bg-emerald-950/30 border border-emerald-500/20 p-6 md:p-8 rounded-2xl text-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] -mr-10 -mt-10" />
                  {project.result}
                </div>
              </section>
            )}

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <section className="pt-10 border-t border-slate-800/80">
                <h3 className={`${plusJakartaSans.className} text-xl font-bold text-white mb-6`}>Project Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-800/80 group">
                      <Image 
                        src={img.image} 
                        alt={`Gallery Image for ${project.title}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}