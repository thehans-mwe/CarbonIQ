import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

const team = [
  {
    name: 'Alex Rivera',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    bio: 'Former climate scientist at NASA. Built CarbonIQ to bridge the gap between data and action.',
  },
  {
    name: 'Maya Thompson',
    role: 'Co-Founder & CTO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
    bio: 'Ex-Google engineering lead. Passionate about using technology to solve the climate crisis.',
  },
  {
    name: 'Omar Hassan',
    role: 'Head of AI',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    bio: 'PhD in ML from Stanford. Previously built predictive models at DeepMind.',
  },
  {
    name: 'Priya Sharma',
    role: 'Head of Sustainability',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
    bio: 'Former IPCC advisor. Ensures our methodology meets the highest scientific standards.',
  },
];

const milestones = [
  { value: 2024, label: 'Founded', suffix: '' },
  { value: 2400, label: 'Organizations', suffix: '+' },
  { value: 18, label: 'Countries', suffix: '' },
  { value: 4.2, label: 'Mt CO₂ Tracked', suffix: 'M' },
];

const values = [
  { icon: '🌍', title: 'Planet First', description: 'Every product decision is measured against its environmental impact.' },
  { icon: '🔬', title: 'Science-Backed', description: 'Our emission factors and models are peer-reviewed and continuously updated.' },
  { icon: '🤝', title: 'Radical Transparency', description: 'Open methodology, clear data lineage, and honest reporting.' },
  { icon: '⚡', title: 'Simplicity', description: 'Complex climate data, delivered in the simplest possible interface.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="about" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-cyan/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-green/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan tracking-widest uppercase mb-6">
            About Us
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Built for the planet,{' '}
            <br className="hidden md:block" />
            <span className="gradient-text">by people who care.</span>
          </h2>
          <p className="max-w-2xl mx-auto text-gray-400 mt-6 text-lg leading-relaxed">
            CarbonIQ was founded on a simple belief: you can't fix what you don't
            measure. We're a team of climate scientists, engineers, and designers
            on a mission to make carbon tracking effortless and actionable.
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-24"
        >
          {milestones.map((m) => (
            <motion.div
              key={m.label}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 text-center cursor-default"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-white">
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
              <p className="text-sm text-gray-400 mt-2">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="mb-24"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">
            Our <span className="gradient-text">Values</span>
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={itemVariants}
                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}
                className="glass rounded-2xl p-6 text-center cursor-default group"
              >
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{v.icon}</span>
                <h4 className="text-base font-semibold text-white mb-2">{v.title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 tracking-tight">
            The <span className="gradient-text">Team</span>
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(0,0,0,0.25)' }}
                className="glass rounded-3xl p-6 text-center cursor-default group relative overflow-hidden"
              >
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-accent-green/10 to-accent-blue/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="relative z-10">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-2 ring-white/10 group-hover:ring-accent-green/30 transition-all duration-300"
                    loading="lazy"
                  />
                  <h4 className="text-base font-semibold text-white">{member.name}</h4>
                  <p className="text-xs text-accent-green font-medium mt-1 mb-3">{member.role}</p>
                  <p className="text-sm text-gray-400 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
