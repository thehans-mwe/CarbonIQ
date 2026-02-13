import { motion } from 'framer-motion';

/* Floating abstract shapes */
function FloatingShape({ className, delay = 0, duration = 6 }) {
  return (
    <motion.div
      className={`absolute rounded-full opacity-20 blur-3xl ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.08, 1],
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background shapes */}
      <FloatingShape className="w-[500px] h-[500px] bg-accent-green/30 -top-40 -left-40" delay={0} duration={8} />
      <FloatingShape className="w-[400px] h-[400px] bg-accent-blue/30 top-1/3 -right-32" delay={2} duration={10} />
      <FloatingShape className="w-[300px] h-[300px] bg-accent-purple/20 bottom-20 left-1/4" delay={4} duration={7} />
      <FloatingShape className="w-[200px] h-[200px] bg-accent-cyan/20 top-20 right-1/3" delay={1} duration={9} />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#0a0e1a_70%)]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-gray-300 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Intelligent Carbon Analytics
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-8"
        >
          Track your
          <br />
          <span className="gradient-text">carbon impact</span>
          <br />
          <span className="text-white/60">intelligently.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12"
        >
          CarbonIQ gives your organization real-time visibility into emissions
          data, actionable reduction strategies, and beautifully simple reporting
          &mdash; all in one platform.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            href="#cta"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,232,143,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow px-8 py-4 rounded-2xl bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-semibold text-base tracking-wide shadow-glow transition-all duration-300"
          >
            Start Tracking &mdash; Free
          </motion.a>
          <motion.a
            href="#dashboard"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl glass text-white/80 font-medium text-base hover:text-white transition-all duration-300 hover:border-white/10"
          >
            View Live Demo
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border border-white/20 flex justify-center pt-2"
          >
            <motion.div className="w-1 h-2.5 rounded-full bg-accent-green/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
