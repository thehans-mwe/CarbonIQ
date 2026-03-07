import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { label: 'Features', section: 'features' },
  { label: 'About', section: 'about' },
];

export default function Navbar({ onDashboard, onNavigateSection, onHome }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled
          ? 'bg-black/90 backdrop-blur-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button onClick={onHome} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a017] to-[#f5c842] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-serif font-semibold tracking-tight">
            Carbon<span className="gradient-text">IQ</span>
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={onDashboard}
            className="nav-underline text-[13px] text-gray-500 hover:text-white transition-colors duration-200"
          >
            Dashboard
          </button>
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => onNavigateSection?.(l.section)}
              className="nav-underline text-[13px] text-gray-500 hover:text-white transition-colors duration-200"
            >
              {l.label}
            </button>
          ))}
          <motion.button
            onClick={onDashboard}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold-line btn-shimmer btn-premium px-5 py-2 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black text-[13px] font-semibold"
          >
            Get Started
          </motion.button>

          {/* Offline indicator */}
          <AnimatePresence>
            {offline && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[10px] text-yellow-400 font-semibold uppercase tracking-wider">Offline</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-white rounded-full block"
          />
          <motion.span
            animate={{ opacity: mobileOpen ? 0 : 1 }}
            className="w-5 h-0.5 bg-white rounded-full block"
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-white rounded-full block"
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
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/[0.04] bg-black/95 backdrop-blur-md"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              <button
                onClick={() => { setMobileOpen(false); onDashboard(); }}
                className="text-sm text-gray-400 hover:text-white transition-colors text-left"
              >
                Dashboard
              </button>
              {links.map((l) => (
                <button
                  key={l.label}
                  onClick={() => { setMobileOpen(false); onNavigateSection?.(l.section); }}
                  className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); onDashboard(); }}
                className="mt-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black text-sm font-semibold text-center"
              >
                Get Started
              </button>
              {offline && (
                <span className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <span className="text-[10px] text-yellow-400 font-semibold uppercase tracking-wider">Offline Mode Active</span>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
