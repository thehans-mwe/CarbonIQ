import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CTA({ onGetStarted }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section id="cta" className="relative py-32" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Glow behind card */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-accent-green/[0.06] blur-[100px] rounded-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="relative glass rounded-3xl p-12 md:p-16 overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-accent-green/30 via-transparent to-accent-blue/30 pointer-events-none" />

          {/* Background mesh */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-green/10 text-accent-green text-xs font-medium tracking-widest uppercase mb-6">
              Get Started Today
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Ready to measure your
              <br />
              <span className="gradient-text">carbon footprint?</span>
            </h2>

            <p className="max-w-lg mx-auto text-gray-400 text-lg mb-10 leading-relaxed">
              Join thousands of forward-thinking companies already using CarbonIQ
              to drive measurable climate action.
            </p>

            <div className="flex items-center justify-center">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,232,143,0.25)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-glow px-10 py-4 rounded-2xl bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-semibold text-base tracking-wide shadow-glow"
              >
                Start Tracking Now
              </motion.button>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
