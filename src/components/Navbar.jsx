import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const staticLinks = [
  { label: 'Features', section: 'features' },
  { label: 'About', section: 'about' },
];

export default function Navbar({ onDashboard, onNavigateSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/95 shadow-glass py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <svg className="w-5 h-5 text-navy-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-serif font-semibold tracking-tight">
            Carbon<span className="gradient-text">IQ</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onDashboard}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group"
          >
            Dashboard
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-green transition-all duration-300 group-hover:w-full" />
          </button>
          {staticLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigateSection && onNavigateSection(link.section)}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-green transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
          <motion.button
            onClick={onDashboard}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow px-5 py-2.5 rounded-full bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 text-sm font-semibold transition-shadow duration-300 hover:shadow-glow"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-white rounded-full block"
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-0.5 bg-white rounded-full block"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-6 h-0.5 bg-white rounded-full block"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden glass"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <button
                onClick={() => { setMobileOpen(false); onDashboard(); }}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Dashboard
              </button>
              {staticLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => { setMobileOpen(false); onNavigateSection && onNavigateSection(link.section); }}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onDashboard(); }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 text-sm font-semibold text-center"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
