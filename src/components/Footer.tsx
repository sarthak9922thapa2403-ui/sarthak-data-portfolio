import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const Footer = () => {
  const { settings } = useSettings();
  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <div className="text-2xl font-bold tracking-tighter mb-4">
              SARTHAK THAPA<span className="text-accent">.</span>
            </div>
            <p className="text-text-secondary max-w-xs">
              Professional Data Processing Specialist helping businesses make sense of their raw data.
            </p>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold uppercase tracking-widest text-text-primary">Navigation</p>
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-text-secondary hover:text-accent transition-colors hover-text-glow"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm font-bold uppercase tracking-widest text-text-primary">Socials</p>
              {(() => {
                try {
                  const links = JSON.parse(settings.social_links || '[]');
                  return links.map((link: { title: string, url: string }, index: number) => (
                    <a key={index} href={link.url} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent transition-colors hover-text-glow">
                      {link.title}
                    </a>
                  ));
                } catch (e) {
                  return null;
                }
              })()}
            </div>
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-secondary">
          <p>© 2026 Sarthak Thapa. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/admin" className="hover:text-accent hover-text-glow transition-colors">Admin Panel</Link>
            <a href="#" className="hover:text-accent hover-text-glow transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent hover-text-glow transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
