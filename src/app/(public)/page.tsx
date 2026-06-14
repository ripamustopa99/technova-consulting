import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';

// Font Setup
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

// SEO Metadata Configuration
export const metadata: Metadata = {
  title: 'TechNova Consulting | Transforming Enterprises',
  description: 'TechNova Consulting delivers elite IT consulting, enterprise software development, cloud solutions, and cybersecurity services.',
  keywords: 'IT Consulting, Web Development, Cloud Solutions, Cyber Security, Enterprise Software',
  openGraph: {
    title: 'TechNova Consulting | Transforming Enterprises',
    description: 'We engineer robust, scalable software systems, cutting-edge cloud infrastructure, and military-grade cybersecurity solutions.',
    type: 'website',
  }
};

// Service icon mapping (inline SVG fallback when no image URL)
const serviceIcons: Record<string, string> = {
  'cloud': '☁️',
  'web': '🌐',
  'mobile': '📱',
  'security': '🛡️',
  'data': '📊',
  'ai': '🤖',
  'default': '⚡',
};

function getServiceIcon(title: string): string {
  const lower = title.toLowerCase();
  for (const [key, icon] of Object.entries(serviceIcons)) {
    if (lower.includes(key)) return icon;
  }
  return serviceIcons.default;
}

export default async function HomePage() {
  // Fetch data dari database secara paralel
  let services: any[] = [];
  let featuredProjects: any[] = [];
  let testimonials: any[] = [];
  let companyName = 'TechNova Consulting';
  let tagline = 'Transforming Enterprises';

  try {
    const [servicesData, projectsData, testimonialsData, settingsData] = await Promise.all([
      prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          image: true,
        },
        take: 4,
        orderBy: { createdAt: 'asc' },
      }),
      prisma.project.findMany({
        where: { featured: true },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          client: true,
          images: {
            select: { image: true },
            take: 1,
          },
        },
        take: 4,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.testimonial.findMany({
        select: {
          id: true,
          clientName: true,
          company: true,
          position: true,
          photo: true,
          testimonial: true,
          rating: true,
        },
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.setting.findMany({ select: { key: true, value: true } }),
    ]);
    services = servicesData;
    featuredProjects = projectsData;
    testimonials = testimonialsData;
    // Extract settings
    const settingsMap: Record<string, string> = {};
    settingsData.forEach((r) => { settingsMap[r.key] = r.value; });
    if (settingsMap['company_name']) companyName = settingsMap['company_name'];
    if (settingsMap['tagline']) tagline = settingsMap['tagline'];
  } catch (error) {
    console.error("Database connection error:", error);
  }

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-50 ${inter.className}`}>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 lg:px-12 mx-auto max-w-7xl">
        {/* Background glow mesh effect */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Box (60% width -> 7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Eyebrow Text */}
            <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-cyan-400 font-medium text-sm tracking-wide">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse" />
              {tagline}
            </div>
            
            {/* Master H1 Header */}
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]`}>
              Build The Future With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                {companyName}
              </span>
            </h1>
            
            {/* Body Text */}
            <p className="text-lg lg:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              We engineer robust, scalable software systems, cutting-edge cloud infrastructure, and 
              military-grade cybersecurity solutions to accelerate your digital transformation.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/contact" className="inline-flex justify-center items-center px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1">
                Get Free Consultation
              </Link>
              <Link href="/services" className="inline-flex justify-center items-center px-8 py-4 bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1">
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Box (40% width -> 5 cols on lg) */}
          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Abstract SVG / Structural Graphic layout */}
            <div className="relative w-full aspect-square max-w-[500px] mx-auto group">
               {/* Decorative backdrop cards */}
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-cyan-400/20 rounded-3xl transform rotate-6 border border-slate-700/50 backdrop-blur-sm transition-transform duration-700 group-hover:rotate-12" />
               <div className="absolute inset-0 bg-slate-900 rounded-3xl transform -rotate-3 border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-700 group-hover:rotate-0">
                 
                 {/* Decorative elements representing networks/infrastructure */}
                 <div className="absolute w-32 h-32 border border-cyan-500/30 rounded-full top-10 left-10 animate-[spin_10s_linear_infinite]" />
                 <div className="absolute w-48 h-48 border border-indigo-500/20 rounded-full bottom-10 right-10 animate-[spin_15s_linear_infinite_reverse]" />
                 
                 {/* Central Hexagon Wireframe SVG */}
                 <svg className="w-2/3 h-2/3 text-cyan-500/60 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                    <circle cx="12" cy="12" r="3" className="fill-indigo-500/50" strokeWidth="1" />
                 </svg>

               </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. COMPANY STATS BANNER */}
      <section className="border-y border-slate-800/60 bg-slate-900/40 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
          {/* Grid partitioned by vertical split lines */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-800/0 md:divide-slate-800/80">
            
            {/* Stat Item 1 */}
            <div className="flex flex-col items-center justify-center text-center px-4 hover:-translate-y-1 transition-transform duration-300">
              <span className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-bold text-white mb-2`}>
                50<span className="text-cyan-400">+</span>
              </span>
              <span className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Enterprise Clients</span>
            </div>

            {/* Stat Item 2 */}
            <div className="flex flex-col items-center justify-center text-center px-4 border-l border-slate-800/80 md:border-none hover:-translate-y-1 transition-transform duration-300">
              <span className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-bold text-white mb-2`}>
                100<span className="text-indigo-400">+</span>
              </span>
              <span className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Projects Shipped</span>
            </div>

            {/* Stat Item 3 */}
            <div className="flex flex-col items-center justify-center text-center px-4 border-t border-slate-800/80 md:border-t-0 pt-8 md:pt-0 hover:-translate-y-1 transition-transform duration-300">
              <span className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-bold text-white mb-2`}>
                10<span className="text-cyan-400">+</span>
              </span>
              <span className="text-slate-400 text-sm uppercase tracking-widest font-semibold">Years Experience</span>
            </div>

            {/* Stat Item 4 */}
            <div className="flex flex-col items-center justify-center text-center px-4 border-t border-l border-slate-800/80 md:border-t-0 md:border-l-0 pt-8 md:pt-0 hover:-translate-y-1 transition-transform duration-300">
              <span className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-bold text-white mb-2`}>
                24<span className="text-indigo-400">/7</span>
              </span>
              <span className="text-slate-400 text-sm uppercase tracking-widest font-semibold">System Support</span>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SERVICES PREVIEW SECTION */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <FadeInUp>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-medium text-sm tracking-wide">
                What We Offer
              </div>
              <h2 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold tracking-tight mb-5`}>
                Our Core{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                  Services
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                We deliver comprehensive technology solutions tailored to empower your business with innovation and resilience.
              </p>
            </div>
          </FadeInUp>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.length > 0 ? (
              services.map((service, index) => (
                <FadeInUp key={service.id} delay={index * 0.1}>
                  <Link href={`/services/${service.slug}`} className="block group h-full">
                    <div className="relative h-full p-6 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.12)] hover:-translate-y-2">
                      {/* Glow effect on hover */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative z-10">
                        {/* Icon */}
                        <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/20 flex items-center justify-center overflow-hidden">
                          {service.image && service.image.startsWith('http') ? (
                            <img src={service.image} alt={service.title} className="w-7 h-7 object-contain" />
                          ) : (
                            <span className="text-2xl">{getServiceIcon(service.title)}</span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className={`${plusJakartaSans.className} text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300`}>
                          {service.title}
                        </h3>

                        {/* Description — Truncated */}
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                          {service.description}
                        </p>

                        {/* Arrow */}
                        <div className="mt-5 flex items-center text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
                          Learn More
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeInUp>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl border border-slate-800/40 bg-slate-900/40 animate-pulse">
                  <div className="w-14 h-14 rounded-xl bg-slate-800 mb-5" />
                  <div className="h-5 w-2/3 bg-slate-800 rounded mb-3" />
                  <div className="h-3 w-full bg-slate-800/60 rounded mb-2" />
                  <div className="h-3 w-4/5 bg-slate-800/60 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS SECTION */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <FadeInUp>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-medium text-sm tracking-wide">
                Our Work
              </div>
              <h2 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold tracking-tight mb-5`}>
                Featured{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                  Projects
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Explore our portfolio of successful projects that have driven real business impact for enterprise clients worldwide.
              </p>
            </div>
          </FadeInUp>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featuredProjects.length > 0 ? (
              featuredProjects.map((project, index) => (
                <FadeInUp key={project.id} delay={index * 0.12}>
                  <Link href={`/portfolio/${project.slug}`} className="block group">
                    <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_0_50px_rgba(79,70,229,0.12)] hover:-translate-y-2">
                      
                      {/* Thumbnail */}
                      <div className="relative w-full h-56 lg:h-64 bg-slate-800 overflow-hidden">
                        {project.images && project.images[0] ? (
                          <Image
                            src={project.images[0].image}
                            alt={project.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                            <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                        
                        {/* Category badge */}
                        {project.category && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide backdrop-blur-sm">
                              {project.category}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className={`${plusJakartaSans.className} text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors duration-300`}>
                          {project.title}
                        </h3>
                        {project.client && (
                          <p className="text-slate-500 text-sm font-medium">
                            Client: <span className="text-slate-400">{project.client}</span>
                          </p>
                        )}

                        {/* View Project CTA */}
                        <div className="mt-4 flex items-center text-cyan-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300">
                          View Case Study
                          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeInUp>
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-800/40 bg-slate-900/40 animate-pulse overflow-hidden">
                  <div className="w-full h-56 bg-slate-800" />
                  <div className="p-6">
                    <div className="h-6 w-3/4 bg-slate-800 rounded mb-3" />
                    <div className="h-4 w-1/2 bg-slate-800/60 rounded" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* View All Button */}
          <FadeInUp delay={0.4}>
            <div className="text-center mt-12">
              <Link
                href="/portfolio"
                className="inline-flex items-center px-8 py-4 bg-slate-900 border border-slate-700 hover:border-indigo-500 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]"
              >
                View All Projects
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 bg-slate-900/50 border-y border-slate-800/40 overflow-hidden">
        {/* Background accents */}
        <div className="absolute top-[10%] right-[-8%] w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] bg-cyan-500/6 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <FadeInUp>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-medium text-sm tracking-wide">
                Client Reviews
              </div>
              <h2 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold tracking-tight mb-5`}>
                What Our Clients{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
                  Say
                </span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                Hear from the enterprises we&apos;ve helped transform through innovative technology solutions.
              </p>
            </div>
          </FadeInUp>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.length > 0 ? (
              testimonials.map((item, index) => (
                <FadeInUp key={item.id} delay={index * 0.1}>
                  <div className="relative p-7 rounded-2xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md h-full transition-all duration-500 hover:border-indigo-500/30 hover:shadow-[0_0_40px_rgba(79,70,229,0.08)] group">
                    {/* Quote Icon — Samar di belakang */}
                    <svg
                      className="absolute top-5 right-5 w-12 h-12 text-indigo-500/8 group-hover:text-indigo-500/15 transition-colors duration-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H0z" />
                    </svg>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-0.5 mb-4">
                      {Array.from({ length: item.rating || 5 }).map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-slate-300 leading-relaxed mb-6 text-[15px] relative z-10">
                      &ldquo;{item.testimonial}&rdquo;
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center gap-3 mt-auto pt-5 border-t border-slate-800/60">
                      {item.photo ? (
                        <img
                          src={item.photo}
                          alt={item.clientName}
                          className="w-11 h-11 rounded-full object-cover border-2 border-slate-700"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {item.clientName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold text-sm">{item.clientName}</p>
                        <p className="text-slate-500 text-xs">
                          {[item.position, item.company].filter(Boolean).join(' at ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeInUp>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-7 rounded-2xl border border-slate-800/40 bg-slate-900/40 animate-pulse">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-slate-800 rounded" />
                    ))}
                  </div>
                  <div className="h-3 w-full bg-slate-800/60 rounded mb-2" />
                  <div className="h-3 w-5/6 bg-slate-800/60 rounded mb-2" />
                  <div className="h-3 w-4/5 bg-slate-800/60 rounded mb-6" />
                  <div className="flex items-center gap-3 pt-5 border-t border-slate-800/40">
                    <div className="w-11 h-11 bg-slate-800 rounded-full" />
                    <div>
                      <div className="h-3 w-24 bg-slate-800 rounded mb-1" />
                      <div className="h-2 w-32 bg-slate-800/60 rounded" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 6. CONTACT CTA SECTION */}
      <section className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <FadeInUp>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-600" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.4),transparent_60%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(99,102,241,0.3),transparent_60%)]" />
              
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

              {/* Floating orbs */}
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-cyan-400/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-[80px]" />

              {/* Content */}
              <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20 text-center">
                <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-white/20 bg-white/10 text-white/90 font-medium text-sm tracking-wide backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan-300 mr-2 animate-pulse" />
                  Let&apos;s Build Together
                </div>

                <h2 className={`${plusJakartaSans.className} text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]`}>
                  Ready to Transform{' '}
                  <br className="hidden sm:block" />
                  Your Business?
                </h2>

                <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                  Partner with {companyName} to unlock the full potential of technology. 
                  Let&apos;s discuss how we can drive your digital transformation forward.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center px-10 py-4 bg-white text-indigo-700 font-bold rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1"
                  >
                    Get Free Consultation
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="inline-flex items-center justify-center px-10 py-4 bg-transparent border-2 border-white/30 text-white font-semibold rounded-xl text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-1"
                  >
                    View Our Work
                  </Link>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

    </div>
  );
}