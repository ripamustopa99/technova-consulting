import Link from 'next/link';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

export default function NotFound() {
  return (
    <div className={`${inter.className} min-h-screen bg-slate-950 flex items-center justify-center px-6`}>
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 404 Number */}
        <h1
          className={`${plusJakartaSans.className} text-[10rem] sm:text-[12rem] font-extrabold leading-none tracking-tight`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">
            4
          </span>
          <span className="text-slate-700">0</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">
            4
          </span>
        </h1>

        {/* Message */}
        <h2 className={`${plusJakartaSans.className} text-2xl sm:text-3xl font-bold text-white mt-4 mb-4`}>
          Page Not Found
        </h2>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-3.5 border border-slate-700 text-slate-300 font-semibold rounded-lg transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-14 pt-8 border-t border-slate-800/50">
          <p className="text-slate-500 text-sm mb-4">Or explore these pages:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/services', label: 'Services' },
              { href: '/portfolio', label: 'Portfolio' },
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg border border-slate-800 text-slate-400 text-sm font-medium hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
