import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_LINES = [
  'Initializing AI Core',
  'Syncing Emission Models',
  'Calibrating Metrics',
  'Loading Intelligence',
];

export default function SplashScreen({ onFinished }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % STATUS_LINES.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {!exiting && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center"
        >
          {/* Logo icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#d4a017] to-[#f5c842] flex items-center justify-center shadow-[0_0_24px_rgba(212,160,23,0.2)]">
              <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight mb-2"
          >
            Carbon<span className="gradient-text">IQ</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[11px] text-white/30 tracking-[0.25em] uppercase font-medium mb-10"
          >
            Intelligent Carbon Analysis
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="relative h-[2px] rounded-full bg-white/[0.04] overflow-hidden mb-6"
            style={{ width: 180 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* Rotating status */}
          <div className="h-4 relative overflow-hidden" style={{ width: 220 }}>
            <AnimatePresence mode="wait">
              <motion.p
                key={statusIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="text-[10px] text-white/20 tracking-[0.12em] uppercase text-center font-medium absolute inset-x-0"
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
