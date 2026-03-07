import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/* ── data ──────────────────────────────────────────────── */
const features = [
  {
    title: 'Real-Time Analytics',
    description: 'Live dashboards breaking down your emissions by transport, energy, diet, and lifestyle — updated as you answer.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=340&fit=crop&q=80',
  },
  {
    title: 'AI-Powered Insights',
    description: 'GPT-4o detects patterns and recommends the highest-impact reduction strategies personalized to your lifestyle.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=340&fit=crop&q=80',
  },
  {
    title: 'EPA-Grade Accuracy',
    description: 'Emission factors sourced from EPA 2025, DEFRA 2025, and IPCC AR5 — the same data governments rely on.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&h=340&fit=crop&q=80',
  },
  {
    title: 'What-If Simulator',
    description: 'Slide controls to instantly see how switching to an EV or going vegetarian changes your footprint.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=340&fit=crop&q=80',
  },
];

/* ── FEATURES: directional entrances per grid position ── */
const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* Each card slides from its nearest edge */
const cardVariants = [
  // top-left: slides from left
  { hidden: { opacity: 0, x: -50, scale: 0.94 }, visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } } },
  // top-right: slides from right
  { hidden: { opacity: 0, x: 50, scale: 0.94 }, visible: { opacity: 1, x: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } } },
  // bottom-left: rises from below-left
  { hidden: { opacity: 0, y: 50, x: -20 }, visible: { opacity: 1, y: 0, x: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } } },
  // bottom-right: rises from below-right
  { hidden: { opacity: 0, y: 50, x: 20 }, visible: { opacity: 1, y: 0, x: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } } },
];

/* ── component ─────────────────────────────────────────── */
export default function Features() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', x + '%');
    e.currentTarget.style.setProperty('--mouse-y', y + '%');
  };

  return (
    <section id="features" className="relative py-32">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d4a017]/20 bg-[#d4a017]/[0.06] text-[10px] font-bold text-[#d4a017] tracking-[0.2em] uppercase mb-5 badge-pulse">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Why CarbonIQ
          </span>
          <h2 className="font-serif text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-tight mb-4">
            Everything you need to{' '}
            <span className="gradient-text-shift">decarbonize.</span>
          </h2>
          <p className="text-gray-500 text-[15px] max-w-lg mx-auto leading-relaxed">
            Powerful tools packed into a beautiful interface — zero learning curve, maximum impact.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={cardVariants[i]}
              whileHover={{ y: -8, scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
              onMouseMove={handleMouseMove}
              className="group relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden card-corner-draw card-gold-glow card-mouse-glow transition-colors duration-200 hover-gold-top"
            >
              {/* Feature number */}
              <span className="feature-number">{String(i + 1).padStart(2, '0')}</span>

              {/* Hover gold sweep line */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4a017]/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-600" />
              </div>
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
                <div className="absolute bottom-4 left-5">
                  <div className="w-9 h-9 rounded-lg bg-black/60 backdrop-blur-sm border border-white/[0.08] flex items-center justify-center text-[#d4a017] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {f.icon}
                  </div>
                </div>
              </div>

              {/* Copy */}
              <div className="p-6 pt-4 relative z-[1]">
                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
