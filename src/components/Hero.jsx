import { motion } from 'framer-motion';

/* Floating abstract shapes — slower, subtler */
function FloatingShape({ className, delay = 0, duration = 12 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* Smooth staggered text reveal */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 60, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ onGetStarted, onDemo }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background shapes — muted, elegant */}
      <FloatingShape className="w-[600px] h-[600px] bg-accent-green/10 -top-40 -left-40 opacity-40" delay={0} duration={14} />
      <FloatingShape className="w-[400px] h-[400px] bg-accent-blue/10 top-1/3 -right-32 opacity-30" delay={3} duration={16} />
      <FloatingShape className="w-[300px] h-[300px] bg-accent-purple/8 bottom-20 left-1/4 opacity-25" delay={5} duration={12} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_70%)]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
            Intelligent Carbon Analytics
          </span>
        </motion.div>

        {/* Headline — elegant serif */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold leading-[1.08] tracking-tight mb-8"
        >
          Track your
          <br />
          <span className="gradient-text italic">carbon impact</span>
          <br />
          <span className="text-white/40">intelligently.</span>
        </motion.h1>

        {/* Subheading — clean, readable */}
        <motion.p
          variants={fadeUp}
          className="max-w-xl mx-auto text-base md:text-lg text-gray-400 leading-relaxed mb-14 font-light"
        >
          Real-time visibility into your emissions, actionable reduction
          strategies, and beautifully simple reporting — all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.04, boxShadow: '0 0 50px rgba(212,160,23,0.2)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow px-10 py-4 rounded-full bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-semibold text-sm tracking-wide shadow-glow transition-all duration-500"
          >
            Start Tracking — Free
          </motion.button>
          <motion.button
            onClick={onDemo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-full glass text-white/70 font-medium text-sm hover:text-white transition-all duration-500"
          >
            Try Demo Account
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeScale}
          className="mt-20 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-600 tracking-wide"
        >
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-green/60" />
            EPA & DEFRA Data
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/60" />
            AI-Powered Insights
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/60" />
            100% Private
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeScale}
          className="mt-16 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-5 h-9 rounded-full border border-white/10 flex justify-center pt-2"
          >
            <motion.div className="w-0.5 h-2 rounded-full bg-accent-green/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
