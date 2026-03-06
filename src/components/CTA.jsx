import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CTA({ onGetStarted }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative py-32" ref={ref}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-12 md:p-16 overflow-hidden"
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
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(212,160,23,0.06) 0%, transparent 100%)' }}
          />

          <span className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-6 relative">
            Get Started Today
          </span>

          <h2 className="font-serif text-2xl md:text-4xl font-semibold tracking-tight leading-tight mb-5 relative">
            Ready to measure your
            <br />
            <span className="gradient-text">carbon footprint?</span>
          </h2>

          <p className="max-w-md mx-auto text-gray-500 text-sm mb-10 leading-relaxed relative">
            Join thousands already using CarbonIQ to drive measurable climate action.
          </p>

          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="relative px-10 py-3.5 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm tracking-wide transition-shadow duration-300 hover:shadow-[0_4px_32px_rgba(212,160,23,0.3)]"
          >
            Start Tracking Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
