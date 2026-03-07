import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const milestones = [
  { value: 2024, label: 'Founded', suffix: '' },
  { value: 2400, label: 'Organizations', suffix: '+' },
  { value: 4.2, label: 'Mt CO₂ Tracked', suffix: 'M' },
];

const values = [
  { icon: '🌍', title: 'Planet First', description: 'Every product decision is measured against its environmental impact.' },
  { icon: '🔬', title: 'Science-Backed', description: 'Our emission factors and models are peer-reviewed and continuously updated.' },
  { icon: '🤝', title: 'Radical Transparency', description: 'Open methodology, clear data lineage, and honest reporting.' },
  { icon: '⚡', title: 'Simplicity', description: 'Complex climate data, delivered in the simplest possible interface.' },
];

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* Milestones: spring scale from center */
const milestoneScale = (i) => ({
  hidden: { opacity: 0, scale: 0.8, y: 15 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 18, delay: i * 0.08 },
  },
});

/* Values: alternating slide direction */
const valueSlide = (i) => {
  const fromLeft = i % 2 === 0;
  return {
    hidden: { opacity: 0, x: fromLeft ? -40 : 40, y: 10 },
    visible: {
      opacity: 1, x: 0, y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 20, delay: i * 0.07 },
    },
  };
};

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="about" className="relative py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-5">
            About Us
          </span>
          <h2 className="font-serif text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-tight mb-4">
            Built for the planet,{' '}
            <span className="gradient-text">by people who care.</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 text-[15px] leading-relaxed">
            CarbonIQ was founded on a simple belief: you can't fix what you don't measure.
            We're making carbon tracking effortless and actionable.
          </p>
          <p className="text-emerald-400/70 text-sm font-medium mt-3">
            Your privacy matters — we don't store, save, or keep any of your personal data. Ever.
          </p>
        </motion.div>

        {/* Stats / milestones */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-3 gap-4 mb-20"
        >
          {milestones.map((m, i) => (
            <motion.div
              key={m.label}
              variants={milestoneScale(i)}
              whileHover={{ y: -6, scale: 1.06, borderColor: 'rgba(212,160,23,0.25)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] py-6 px-4 text-center hover-inner-shine card-corner-draw card-gold-glow"
            >
              <div className="text-2xl md:text-3xl font-bold text-white">
                {inView ? (
                  <CountUp
                    end={m.value}
                    duration={2.2}
                    separator=","
                    decimals={m.value % 1 !== 0 ? 1 : 0}
                  />
                ) : 0}
                <span className="gradient-text">{m.suffix}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.05 }}
          className="mb-20"
        >
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-center mb-10 tracking-tight">
            Our <span className="gradient-text">Values</span>
          </h3>
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={valueSlide(i)}
                whileHover={{ y: -7, scale: 1.05, borderColor: 'rgba(212,160,23,0.25)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 text-center cursor-default card-corner-draw card-gold-glow transition-shadow duration-200 hover-corner-dots"
              >
                <motion.span
                  className="text-2xl block mb-3"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 300, damping: 16 }}
                >{v.icon}</motion.span>
                <h4 className="text-sm font-semibold text-white mb-1.5">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Creator */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.94 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-serif font-semibold mb-10 tracking-tight">
            The <span className="gradient-text">Creator</span>
          </h3>
          <motion.div
            whileHover={{ y: -5, scale: 1.03, borderColor: 'rgba(212,160,23,0.2)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 16 }}
            className="inline-flex flex-col items-center rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 max-w-xs mx-auto hover-halo card-corner-draw card-gold-glow"
          >
            <img
              src="https://api.dicebear.com/8.x/notionists/svg?seed=HansDev42&backgroundColor=0a0a0a"
              alt="Thehan Sandaneth"
              className="w-16 h-16 rounded-2xl ring-1 ring-white/[0.08] mb-4"
              loading="lazy"
            />
            <h4 className="text-sm font-semibold text-white">Thehan Sandaneth</h4>
            <p className="text-[11px] text-[#d4a017] font-medium mt-1 mb-3">Founder & Developer</p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Full-stack developer and climate enthusiast. Built CarbonIQ to make carbon tracking accessible to everyone.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
