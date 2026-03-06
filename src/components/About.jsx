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

const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="about" className="relative py-32" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
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
          {milestones.map((m) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] py-6 px-4 text-center"
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
          transition={{ duration: 0.6, delay: 0.15, ease }}
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
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 text-center cursor-default hover:border-white/[0.1] transition-all duration-300"
              >
                <span className="text-2xl block mb-3">{v.icon}</span>
                <h4 className="text-sm font-semibold text-white mb-1.5">{v.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Creator */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease }}
          className="text-center"
        >
          <h3 className="text-xl md:text-2xl font-serif font-semibold mb-10 tracking-tight">
            The <span className="gradient-text">Creator</span>
          </h3>
          <div className="inline-flex flex-col items-center rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8 max-w-xs mx-auto hover:border-white/[0.1] transition-colors duration-300">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
}
