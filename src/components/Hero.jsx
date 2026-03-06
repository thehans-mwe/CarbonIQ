import { motion } from 'framer-motion';

/* ── animation variants ───────────────────────────────── */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
};

/* ── stat pill ────────────────────────────────────────── */
function StatPill({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-[11px] text-gray-500 uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

export default function Hero({ onGetStarted, onDemo }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ── Background layers ── */}
      {/* Soft top-center glow */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
        style={{ background: 'radial-gradient(ellipse 50% 45% at 50% 0%, rgba(212,160,23,0.07) 0%, transparent 100%)' }}
      />
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />

      {/* ── Content ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-32 pb-24"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold text-gray-400 tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Carbon Intelligence Platform
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.08] tracking-tight mb-7"
        >
          Know your footprint.
          <br />
          <span className="gradient-text">Shrink it.</span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className="max-w-xl mx-auto text-base md:text-lg text-gray-400 leading-relaxed mb-12"
        >
          Answer a few quick questions about your week and get a science-backed
          emissions breakdown with personalized AI tips to reduce your impact.
        </motion.p>

        {/* CTA row */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-lift px-10 py-4 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(212,160,23,0.25)] transition-all duration-300"
          >
            Calculate My Footprint
          </motion.button>
          <motion.button
            onClick={onDemo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-full border border-white/[0.08] bg-white/[0.02] text-white/60 font-semibold text-sm hover:text-white hover:border-white/[0.15] transition-all duration-300"
          >
            View Demo
          </motion.button>
        </motion.div>

        {/* Social proof stats */}
        <motion.div
          variants={fadeIn}
          className="mt-20 flex items-center justify-center gap-12 md:gap-16"
        >
          <StatPill value="5-step" label="Wizard" />
          <div className="w-px h-10 bg-white/[0.06]" />
          <StatPill value="EPA" label="Accurate" />
          <div className="w-px h-10 bg-white/[0.06]" />
          <StatPill value="AI" label="Insights" />
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          variants={fadeIn}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-9 rounded-full border border-white/[0.08] flex justify-center pt-2"
          >
            <div className="w-0.5 h-2 rounded-full bg-white/20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
