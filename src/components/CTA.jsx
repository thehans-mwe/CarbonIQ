import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ease = [0.16, 1, 0.3, 1];

/* CTA: spring pop — card scales up with overshoot feel */
export default function CTA({ onGetStarted }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      {/* Pulsing radial glow behind CTA */}
      <div className="cta-glow-bg" />

      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 180, damping: 18 }}
          className="relative rounded-2xl border border-white/[0.06] p-12 md:p-16 overflow-hidden glass-card"
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
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.1 }}
            className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-6 relative"
          >
            Get Started Today
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.18 }}
            className="font-serif text-2xl md:text-4xl font-semibold tracking-tight leading-tight mb-5 relative"
          >
            Ready to measure your
            <br />
            <span className="gradient-text-shift">carbon footprint?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.26 }}
            className="max-w-md mx-auto text-gray-500 text-sm mb-10 leading-relaxed relative"
          >
            Join thousands already using CarbonIQ to drive measurable climate action.
          </motion.p>

          <motion.button
            onClick={onGetStarted}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 250, damping: 16, delay: 0.32 }}
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.94 }}
            className="relative px-10 py-3.5 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm tracking-wide btn-gold-line btn-shimmer btn-premium btn-pulse-glow overflow-hidden"
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
