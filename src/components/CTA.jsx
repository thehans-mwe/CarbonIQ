import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.22, 1, 0.36, 1];

/* CTA: elastic rubber-band overshoot — card bounces past final size then settles */
export default function CTA({ onGetStarted }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-32" ref={ref}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30, filter: 'blur(14px)' }}
          animate={inView ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ type: 'spring', stiffness: 80, damping: 10, mass: 0.8 }}
          className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-12 md:p-16 overflow-hidden animate-border-glow"
        >
          {/* Dot mesh */}
          <div
            className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Top glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,160,23,0.08) 0%, transparent 100%)' }}
          />

          <motion.span
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 120, damping: 10, delay: 0.25 }}
            className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-6 relative"
          >
            Get Started Today
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24, scale: 0.95, filter: 'blur(6px)' }}
            animate={inView ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.35 }}
            className="font-serif text-2xl md:text-4xl font-semibold tracking-tight leading-tight mb-5 relative"
          >
            Ready to measure your
            <br />
            <span className="gradient-text-shimmer">carbon footprint?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.45 }}
            className="max-w-md mx-auto text-gray-500 text-sm mb-10 leading-relaxed relative"
          >
            Join thousands already using CarbonIQ to drive measurable climate action.
          </motion.p>

          <motion.button
            onClick={onGetStarted}
            initial={{ opacity: 0, y: 16, scale: 0.85 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 90, damping: 8, delay: 0.55 }}
            whileHover={{ scale: 1.08, y: -3, rotate: -0.5 }}
            whileTap={{ scale: 0.92 }}
            className="relative px-10 py-3.5 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm tracking-wide transition-shadow duration-300 hover:shadow-[0_4px_32px_rgba(212,160,23,0.35)] overflow-hidden"
          >
            <span className="relative z-10">Start Tracking Now</span>
            {/* Shine sweep */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
            />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
