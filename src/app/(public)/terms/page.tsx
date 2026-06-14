import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  weight: ['600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto text-slate-300">
      <h1 className={`${plusJakartaSans.className} text-4xl lg:text-5xl font-extrabold text-white mb-10 tracking-tight`}>
        Terms of Service
      </h1>
      
      <div className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold">
        <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <p>Welcome to TechNova Consulting!</p>
        <p>These terms and conditions outline the rules and regulations for the use of TechNova Consulting&apos;s Website.</p>
        
        <h2>1. Terms</h2>
        <p>By accessing this Website, accessible from technova.com, you are agreeing to be bound by these Website Terms and Conditions of Use and agree that you are responsible for the agreement with any applicable local laws. If you disagree with any of these terms, you are prohibited from accessing this site. The materials contained in this Website are protected by copyright and trade mark law.</p>
        
        <h2>2. Use License</h2>
        <p>Permission is granted to temporarily download one copy of the materials on TechNova Consulting&apos;s Website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose or for any public display;</li>
          <li>attempt to reverse engineer any software contained on TechNova Consulting&apos;s Website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or &ldquo;mirror&rdquo; the materials on any other server.</li>
        </ul>
        
        <h2>3. Disclaimer</h2>
        <p>All the materials on TechNova Consulting&apos;s Website are provided &ldquo;as is&rdquo;. TechNova Consulting makes no warranties, may it be expressed or implied, therefore negates all other warranties. Furthermore, TechNova Consulting does not make any representations concerning the accuracy or reliability of the use of the materials on its Website or otherwise relating to such materials or any sites linked to this Website.</p>
        
        <h2>4. Limitations</h2>
        <p>TechNova Consulting or its suppliers will not be hold accountable for any damages that will arise with the use or inability to use the materials on TechNova Consulting&apos;s Website, even if TechNova Consulting or an authorize representative of this Website has been notified, orally or written, of the possibility of such damage. Some jurisdiction does not allow limitations on implied warranties or limitations of liability for incidental damages, these limitations may not apply to you.</p>
        
        <h2>5. Revisions and Errata</h2>
        <p>The materials appearing on TechNova Consulting&apos;s Website may include technical, typographical, or photographic errors. TechNova Consulting will not promise that any of the materials in this Website are accurate, complete, or current. TechNova Consulting may change the materials contained on its Website at any time without notice. TechNova Consulting does not make any commitment to update the materials.</p>
      </div>
    </div>
  );
}
