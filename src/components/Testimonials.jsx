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

const ease = [0.16, 1, 0.3, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* Cards pop in with scale + spring — each row staggers visibly */
const cardPop = (i) => {
  const directions = [
    { x: -20, y: 20 },   // top-left
    { x: 0, y: 30 },     // top-center
    { x: 20, y: 20 },    // top-right
    { x: -20, y: 20 },   // bottom-left
    { x: 0, y: 30 },     // bottom-center
    { x: 20, y: 20 },    // bottom-right
  ];
  const d = directions[i] || { x: 0, y: 30 };
  return {
    hidden: { opacity: 0, x: d.x, y: d.y, scale: 0.9 },
    visible: {
      opacity: 1, x: 0, y: 0, scale: 1,
      transition: { type: 'spring', stiffness: 200, damping: 18, delay: i * 0.05 },
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
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
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
              variants={cardPop(i)}
              whileHover={{ y: -7, scale: 1.03, borderColor: 'rgba(212,160,23,0.2)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 16 }}
              className="group rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 flex flex-col cursor-default card-corner-draw card-gold-glow transition-shadow duration-200 hover-underline-expand"
            >
              {/* Quote mark */}
              <svg className="w-6 h-6 text-[#d4a017]/20 group-hover:text-[#d4a017]/50 transition-colors duration-300 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2, ease }}
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
