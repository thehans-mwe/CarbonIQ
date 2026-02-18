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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-700'}`}
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
    <section className="relative py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-accent-purple/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium text-accent-purple tracking-[0.2em] uppercase mb-6">
            Reviews
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
            Loved by{' '}
            <span className="gradient-text italic">real users.</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 mt-6 text-base leading-relaxed">
            People everywhere trust CarbonIQ to measure, understand, and reduce
            their environmental impact.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              whileHover={{
                y: -6,
                boxShadow: '0 16px 48px rgba(0,0,0,0.25)',
                transition: { duration: 0.3 },
              }}
              className="glass rounded-3xl p-7 flex flex-col cursor-default group relative overflow-hidden"
            >
              {/* Subtle gradient on hover */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-accent-green/10 to-accent-purple/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex-1 flex flex-col">
                {/* Quote */}
                <svg className="w-8 h-8 text-accent-green/20 mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-300 text-[15px] leading-relaxed mb-6 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <img
                    src={`https://api.dicebear.com/8.x/notionists/svg?seed=${t.seed}&backgroundColor=0a0a0a`}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-white/10 bg-navy-700"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{t.name}</p>
                    <p className="text-xs text-gray-500 truncate">{t.role}</p>
                  </div>
                  <Stars count={t.stars} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map((t) => (
                <img key={t.name} src={`https://api.dicebear.com/8.x/notionists/svg?seed=${t.seed}&backgroundColor=0a0a0a`} alt="" className="w-7 h-7 rounded-full ring-2 ring-navy-900 bg-navy-700" loading="lazy" />
              ))}
            </div>
            <span>2,400+ users</span>
          </div>
          <span className="hidden sm:block text-gray-700">|</span>
          <div className="flex items-center gap-1.5">
            <Stars count={5} />
            <span>4.9/5 average rating</span>
          </div>
          <span className="hidden sm:block text-gray-700">|</span>
          <span>Trusted by individuals & organizations</span>
        </motion.div>
      </div>
    </section>
  );
}
