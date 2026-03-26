import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

export const Navbar = () => {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/services' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Contact', href: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith('/#') && isHomePage) {
      const id = href.substring(2);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-lg py-4 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-tighter">
            SARTHAK THAPA<span className="text-accent">.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={(e) => {
                  if (isHomePage && link.href.startsWith('/#')) {
                    e.preventDefault();
                    handleLinkClick(link.href);
                  }
                }}
                className={`text-sm font-medium transition-colors hover-text-glow ${
                  (isHomePage && link.href.startsWith('/#') && window.location.hash === link.href.substring(1)) || 
                  location.pathname === link.href 
                    ? 'text-accent' 
                    : 'text-text-secondary hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-2 px-4 py-2 bg-accent text-background rounded-full text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 hover-glow"
            >
              <Phone className="w-4 h-4" />
              {settings.contact_phone}
            </a>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-text-primary" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={(e) => {
                  if (isHomePage && link.href.startsWith('/#')) {
                    e.preventDefault();
                  }
                  handleLinkClick(link.href);
                }}
                className={`text-3xl font-bold transition-colors hover-text-glow ${
                  (isHomePage && link.href.startsWith('/#') && window.location.hash === link.href.substring(1)) || 
                  location.pathname === link.href 
                    ? 'text-accent' 
                    : 'hover:text-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`} 
              className="flex items-center gap-3 text-2xl font-bold text-accent mt-4 hover-text-glow"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone className="w-6 h-6" />
              {settings.contact_phone}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
