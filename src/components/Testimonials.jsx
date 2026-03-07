import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    name: 'Rachel M.',
    role: 'Environmental Consultant',
    seed: 'rachel-m',
    quote: 'CarbonIQ completely transformed how I track and report carbon emissions for my clients. The AI recommendations alone saved dozens of hours of manual research.',
    stars: 5,
  },
  {
    name: 'Jordan T.',
    role: 'Small Business Owner',
    seed: 'jordan-t',
    quote: 'The dashboard is gorgeous and the data is actually actionable. We reduced our office footprint by 34% in the first quarter using their insights.',
    stars: 5,
  },
  {
    name: 'Priya K.',
    role: 'Graduate Student, Environmental Science',
    seed: 'priya-k',
    quote: 'As a researcher, I love that the emission factors are sourced from EPA and DEFRA. It\'s become my go-to tool for quick carbon estimates.',
    stars: 5,
  },
  {
    name: 'Marcus L.',
    role: 'Freelance Developer',
    seed: 'marcus-l',
    quote: 'I built a green-living challenge with friends using CarbonIQ scores. The interface is so intuitive that even my least tech-savvy friends love it.',
    stars: 5,
  },
  {
    name: 'Nadia S.',
    role: 'Sustainability Coordinator',
    seed: 'nadia-s',
    quote: 'The offline mode is a game-changer for field assessments. Reliable calculations without connectivity, and syncs beautifully when back online.',
    stars: 5,
  },
  {
    name: 'Alex W.',
    role: 'High School Teacher',
    seed: 'alex-w',
    quote: 'I use CarbonIQ in my environmental science class. Students love seeing their actual footprint — it makes climate data tangible and personal.',
    stars: 4,
  },
];

const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* TESTIMONIALS: waterfall cascade — each card drops from above with tilt correction */
const waterfallCard = (i) => {
  const tilt = [3, -2, 4, -3, 2, -4][i] || 0;
  const xShift = [-20, 0, 20, -15, 5, 25][i] || 0;
  return {
    hidden: { opacity: 0, y: -40 - i * 8, x: xShift, rotate: tilt, scale: 0.9, filter: 'blur(6px)' },
    visible: {
      opacity: 1, y: 0, x: 0, rotate: 0, scale: 1, filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 100, damping: 14, delay: i * 0.06 },
    },
  };
};

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < count ? 'text-[#f5c842]' : 'text-gray-800'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section className="relative py-32">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-5">
            Reviews
          </span>
          <h2 className="font-serif text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-tight mb-4">
            Loved by{' '}
            <span className="gradient-text">real users.</span>
          </h2>
          <p className="max-w-lg mx-auto text-gray-500 text-[15px] leading-relaxed">
            People everywhere trust CarbonIQ to measure, understand, and reduce their environmental impact.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={waterfallCard(i)}
              whileHover={{ y: -6, scale: 1.03, rotate: i % 2 === 0 ? 1 : -1, borderColor: 'rgba(212,160,23,0.15)' }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 flex flex-col cursor-default hover:shadow-[0_8px_32px_rgba(212,160,23,0.06)] transition-shadow duration-300"
            >
              {/* Quote mark */}
              <svg className="w-6 h-6 text-[#d4a017]/20 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <img
                  src={`https://api.dicebear.com/8.x/notionists/svg?seed=${t.seed}&backgroundColor=0a0a0a`}
                  alt={t.name}
                  className="w-9 h-9 rounded-full ring-1 ring-white/[0.08] bg-[#0a0a0a]"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.name}</p>
                  <p className="text-[11px] text-gray-600 truncate">{t.role}</p>
                </div>
                <Stars count={t.stars} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-xs text-gray-600"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {testimonials.slice(0, 4).map((t) => (
                <img key={t.name} src={`https://api.dicebear.com/8.x/notionists/svg?seed=${t.seed}&backgroundColor=0a0a0a`} alt="" className="w-6 h-6 rounded-full ring-2 ring-black bg-[#0a0a0a]" loading="lazy" />
              ))}
            </div>
            <span>2,400+ users</span>
          </div>
          <span className="hidden sm:block text-gray-800">·</span>
          <div className="flex items-center gap-1.5">
            <Stars count={5} />
            <span>4.9/5 average rating</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
