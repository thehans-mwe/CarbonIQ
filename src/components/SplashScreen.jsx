import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LINES = [
  'Initializing AI Core',
  'Syncing Emission Models',
  'Calibrating Sustainability Metrics',
  'Loading Climate Intelligence',
];

export default function SplashScreen({ onFinished }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Rotate status text every 600ms
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  // Start exit after 2s
  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          {/* Ambient glow behind logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,160,23,0.08) 0%, rgba(212,160,23,0.03) 40%, transparent 70%)',
            }}
          />

          {/* Logo icon with glow pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{ boxShadow: '0 0 30px rgba(212,160,23,0.25)' }}
            />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a017] to-[#f5c842] flex items-center justify-center relative">
              <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight mb-3"
          >
            Carbon<span style={{
              background: 'linear-gradient(135deg, #f5c842 0%, #d4a017 50%, #c49b12 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>IQ</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-white/40 tracking-[0.25em] uppercase font-medium mb-12"
          >
            Intelligent Carbon Analysis
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '200px' }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="relative h-[3px] rounded-full bg-white/[0.06] overflow-hidden mb-8"
            style={{ width: 200 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #d4a017, #f5c842, #d4a017)',
                backgroundSize: '200% 100%',
              }}
              initial={{ width: '0%' }}
              animate={{
                width: '100%',
                backgroundPosition: ['0% 0%', '100% 0%'],
              }}
              transition={{
                width: { duration: 1.8, delay: 0.7, ease: [0.4, 0, 0.2, 1] },
                backgroundPosition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
              }}
            />
            {/* Glow on the leading edge */}
          </motion.div>

          {/* Rotating status text */}
          <div className="h-5 relative overflow-hidden" style={{ width: 260 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="text-xs text-white/30 tracking-[0.15em] uppercase text-center font-medium absolute inset-x-0"
              >
                {STATUS_LINES[statusIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
