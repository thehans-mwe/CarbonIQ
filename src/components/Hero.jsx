import { motion } from 'framer-motion';

/* ── animation helpers ─────────────────────────────────── */
const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.9, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
};

/* ── component ──────────────────────────────────────────── */
export default function Hero({ onGetStarted, onDemo }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 20%, rgba(212,160,23,0.06) 0%, transparent 100%)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[calc(100vh-8rem)]">

          {/* Left — Copy */}
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-8">
              <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[10px] font-semibold text-gray-400 tracking-[0.2em] uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Carbon Intelligence
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-serif text-[2.75rem] sm:text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight mb-6"
            >
              Measure your
              <br />
              carbon footprint.
              <br />
              <span className="gradient-text">Then shrink it.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-400 text-base md:text-[17px] leading-relaxed max-w-md mb-10"
            >
              Five quick questions. Science-backed emissions breakdown.
              Personalized AI tips to cut your impact — all in under 2 minutes.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-14">
              <motion.button
                onClick={onGetStarted}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="group relative px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm tracking-wide overflow-hidden transition-shadow duration-300 hover:shadow-[0_4px_32px_rgba(212,160,23,0.3)]"
              >
                <span className="relative z-10">Get Started</span>
              </motion.button>
              <motion.button
                onClick={onDemo}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-full border border-white/[0.08] text-white/60 font-medium text-sm hover:text-white hover:border-white/[0.16] transition-all duration-300"
              >
                View Demo
              </motion.button>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-center gap-8 text-[11px] text-gray-500 uppercase tracking-widest font-medium">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                EPA 2024
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                AI Insights
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                100% Free
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop&q=80"
                alt="Forest canopy"
                className="w-full h-[420px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6, ease }}
                className="absolute bottom-5 left-5 right-5 rounded-xl bg-black/60 backdrop-blur-md border border-white/[0.08] p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Weekly Footprint</p>
                    <p className="text-2xl font-bold text-white">127.4 <span className="text-sm font-normal text-gray-400">kg CO₂</span></p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898" /></svg>
                      34% below avg
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">Green Score: 87/100</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6, ease }}
              className="absolute -top-4 -right-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] p-3.5 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d4a017]/15 flex items-center justify-center text-sm">🌱</div>
                <div>
                  <p className="text-xs font-semibold text-white">304 trees</p>
                  <p className="text-[10px] text-gray-500">equivalent saved</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll */}
        <motion.div variants={fadeIn} initial="hidden" animate="visible" className="flex justify-center mt-8 lg:mt-0">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-8 rounded-full border border-white/[0.08] flex justify-center pt-2"
          >
            <div className="w-0.5 h-1.5 rounded-full bg-white/20" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
