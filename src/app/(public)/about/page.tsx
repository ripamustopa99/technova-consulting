import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { prisma } from '@/lib/prisma';
import FadeInUp from '@/components/FadeInUp';
import { WhatsAppIcon, InstagramIcon, LinkedinIcon, MailIcon } from '@/components/AntdIcons';

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
  title: 'About Us',
  description: 'Learn about TechNova Consulting, our mission, vision, core values, and the expert team driving digital transformation.',
};

export default async function AboutPage() {
  let team: any[] = [];

  try {
    team = await prisma.teamMember.findMany({
      orderBy: { createdAt: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
  }

  const coreValues = [
    {
      title: 'Innovation',
      description: 'We constantly push boundaries, adopting cutting-edge technologies to solve complex enterprise challenges.',
      icon: '💡',
    },
    {
      title: 'Integrity',
      description: 'Honesty and transparent communication form the bedrock of our relationships with clients and partners.',
      icon: '🛡️',
    },
    {
      title: 'Excellence',
      description: 'We hold ourselves to the highest standards, delivering robust, scalable, and high-performance solutions.',
      icon: '⭐',
    },
    {
      title: 'Client Success',
      description: 'Our clients success is our success. We align our strategies directly with your long-term business goals.',
      icon: '📈',
    },
  ];

  return (
    <div className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen pb-24`}>
      {/* 1. HERO BANNER */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-20 px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <FadeInUp>
            <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-medium text-sm tracking-wide">
              Who We Are
            </div>
            <h1 className={`${plusJakartaSans.className} text-5xl lg:text-6xl font-extrabold tracking-tight mb-5`}>
              About{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
                TechNova
              </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              We are a team of passionate engineers, designers, and consultants dedicated to crafting elite IT solutions that transform businesses.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* 2. COMPANY STORY */}
      <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <FadeInUp>
              <h2 className={`${plusJakartaSans.className} text-3xl font-bold text-white mb-6`}>
                Our Journey & Story
              </h2>
              <div className="space-y-5 text-slate-300 leading-relaxed text-[15px]">
                <p>
                  Founded with a vision to bridge the gap between complex technological evolution and business application, TechNova Consulting has grown from a boutique agency into a trusted IT consulting partner for enterprise clients.
                </p>
                <p>
                  We believe that technology should be an enabler, not a bottleneck. Our approach combines rigorous engineering practices with strategic foresight, ensuring the software, cloud systems, and cybersecurity frameworks we build today are ready to scale for the challenges of tomorrow.
                </p>
                <p>
                  Over the years, we have successfully delivered high-performance applications, migrated complex legacy systems to state-of-the-art cloud architectures, and secured critical infrastructures against sophisticated cyber threats.
                </p>
              </div>
            </FadeInUp>
          </div>
          <div className="lg:col-span-5 relative">
            <FadeInUp delay={0.2}>
              <div className="relative aspect-video lg:aspect-square w-full rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 flex flex-col justify-center overflow-hidden shadow-2xl">
                {/* Decorative gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-indigo-500/5" />
                <div className="relative z-10 text-center space-y-6">
                  <div className="text-6xl">🚀</div>
                  <h3 className={`${plusJakartaSans.className} text-xl font-bold text-white`}>
                    10+ Years of Engineering Excellence
                  </h3>
                  <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Helping enterprises adapt, evolve, and lead in a rapidly changing digital landscape.
                  </p>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="px-6 lg:px-12 py-16 bg-slate-900/30 border-y border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <FadeInUp>
            <div className="h-full p-8 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px]" />
              <h3 className={`${plusJakartaSans.className} text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3`}>
                <span>👁️</span> Our Vision
              </h3>
              <p className="text-slate-300 leading-relaxed text-[15px]">
                To become the premier technology partner for businesses globally, recognized for engineering integrity, exceptional performance, and delivering transformative digital architectures.
              </p>
            </div>
          </FadeInUp>

          {/* Mission Card */}
          <FadeInUp delay={0.1}>
            <div className="h-full p-8 rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-[40px]" />
              <h3 className={`${plusJakartaSans.className} text-2xl font-bold text-indigo-400 mb-4 flex items-center gap-3`}>
                <span>🎯</span> Our Mission
              </h3>
              <p className="text-slate-300 leading-relaxed text-[15px]">
                To deliver bespoke, high-quality, and robust software, cloud, and security solutions. We empower organizations to scale safely, automate workflow operations, and achieve high-performance results.
              </p>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section className="px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <FadeInUp>
          <div className="text-center mb-16">
            <h2 className={`${plusJakartaSans.className} text-3xl lg:text-4xl font-extrabold text-white mb-4`}>
              Our Core Values
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-[15px]">
              These key pillars shape our corporate culture, define our engineering standards, and steer our consulting strategies.
            </p>
          </div>
        </FadeInUp>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => (
            <FadeInUp key={idx} delay={idx * 0.1}>
              <div className="p-6 rounded-2xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-sm h-full transition-all duration-300 hover:border-cyan-500/20 hover:bg-slate-900/60 hover:-translate-y-1">
                <div className="text-3xl mb-4">{val.icon}</div>
                <h3 className={`${plusJakartaSans.className} text-lg font-bold text-white mb-2`}>
                  {val.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {val.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* 5. TEAM MEMBERS */}
      <section className="px-6 lg:px-12 py-20 bg-slate-900/20 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <FadeInUp>
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-1.5 mb-5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-medium text-sm tracking-wide">
                Meet the Experts
              </div>
              <h2 className={`${plusJakartaSans.className} text-3xl lg:text-4xl font-extrabold text-white mb-4`}>
                Our Leadership & Team
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-[15px]">
                A collective of industry-seasoned consultants and elite developers driving your growth.
              </p>
            </div>
          </FadeInUp>

          {team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, idx) => (
                <FadeInUp key={member.id} delay={idx * 0.08}>
                  <div className="group rounded-2xl border border-slate-800/60 bg-slate-900/60 overflow-hidden shadow-lg transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-1.5">
                    {/* Member photo */}
                    <div className="relative aspect-[4/5] bg-slate-800 w-full overflow-hidden">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center text-slate-500">
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                      
                      {/* Social Links overlay hover */}
                      {member.linkedin && (
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                          <div className="flex gap-3">
                            {(() => {
                              let socialLinks: { platform: string; url: string; isCustom?: boolean; customIconUrl?: string }[] = [];
                              try {
                                const parsed = JSON.parse(member.linkedin);
                                if (Array.isArray(parsed)) {
                                  socialLinks = parsed;
                                } else {
                                  socialLinks = [{ platform: 'linkedin', url: member.linkedin, isCustom: false }];
                                }
                              } catch {
                                socialLinks = [{ platform: 'linkedin', url: member.linkedin, isCustom: false }];
                              }

                              return socialLinks.map((link, i) => {
                                const platformName = link.platform.toLowerCase();
                                let IconElement = null;

                                if (!link.isCustom) {
                                  if (platformName === 'whatsapp') IconElement = <WhatsAppIcon className="text-xl" />;
                                  if (platformName === 'instagram') IconElement = <InstagramIcon className="text-xl" />;
                                  if (platformName === 'linkedin') IconElement = <LinkedinIcon className="text-xl" />;
                                  if (platformName === 'email') IconElement = <MailIcon className="text-xl" />;
                                }

                                if (link.isCustom && link.customIconUrl) {
                                  IconElement = <img src={link.customIconUrl} alt={platformName} className="w-5 h-5 object-contain" />;
                                }

                                if (!IconElement && !link.isCustom) {
                                  // Fallback for unknown standard platform
                                  IconElement = <span className="font-bold text-sm uppercase">{platformName.substring(0, 2)}</span>;
                                }

                                return (
                                  <a 
                                    key={i}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center transition-transform duration-300 hover:scale-110 shadow-lg"
                                    title={link.platform}
                                  >
                                    {IconElement}
                                  </a>
                                );
                              });
                            })()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Member details */}
                    <div className="p-5">
                      <h3 className="font-bold text-white text-lg">{member.name}</h3>
                      <p className="text-cyan-400 text-xs font-semibold tracking-wide uppercase mt-1 mb-3">
                        {member.position}
                      </p>
                      {member.bio && (
                        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
              <p className="text-slate-500 text-sm">No team members added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}