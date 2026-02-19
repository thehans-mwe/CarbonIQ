import { motion } from 'framer-motion';

/* Floating abstract shapes — pure CSS for performance */
function FloatingShape({ className }) {
  return <div className={`absolute rounded-full blur-3xl will-change-transform ${className}`} />;
}

/* Smooth staggered text reveal */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 70, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ onGetStarted, onDemo }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background shapes — muted, elegant, CSS-animated */}
      <FloatingShape className="w-[700px] h-[700px] bg-accent-green/[0.07] -top-48 -left-48 opacity-50 animate-float-slow" />
      <FloatingShape className="w-[500px] h-[500px] bg-accent-blue/[0.06] top-1/3 -right-40 opacity-35 animate-float-medium" />
      <FloatingShape className="w-[350px] h-[350px] bg-accent-purple/[0.05] bottom-16 left-1/4 opacity-30 animate-float-slow" />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_70%)]" />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient glow behind hero */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent-green/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="mb-12">
          <span className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full glass text-xs font-medium text-gray-400 tracking-[0.2em] uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Intelligent Carbon Analytics
          </span>
        </motion.div>

        {/* Headline — BIG, dramatic serif */}
        <motion.h1
          variants={fadeUp}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[6.5rem] font-semibold leading-[1.05] tracking-tight mb-8"
        >
          Measure your
          <br />
          <span className="gradient-text italic">climate impact</span>
        </motion.h1>

        {/* Subheading — clean, readable */}
        <motion.p
          variants={fadeUp}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-16 font-light"
        >
          Real-time visibility into your emissions, actionable reduction
          strategies, and beautifully simple reporting — all in one platform.
        </motion.p>

        {/* CTA Buttons — BIG and bold */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <motion.button
            onClick={onGetStarted}
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212,160,23,0.25)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow btn-lift px-12 py-5 rounded-full bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-bold text-base tracking-wide shadow-glow transition-all duration-500"
          >
            Measure Your Impact — Free
          </motion.button>
          <motion.button
            onClick={onDemo}
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.97 }}
            className="px-12 py-5 rounded-full glass text-white/70 font-semibold text-base hover:text-white transition-all duration-500"
          >
            Try Demo Account
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeScale}
          className="mt-24 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 tracking-wide"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-green/60" />
            EPA & DEFRA Data
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-blue/60" />
            AI-Powered Insights
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-purple/60" />
            100% Private
          </span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={fadeScale}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border border-white/10 flex justify-center pt-2.5"
          >
            <motion.div className="w-0.5 h-2.5 rounded-full bg-accent-green/40" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
