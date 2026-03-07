import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from 'recharts';

/* ── mock data ────────────────────────────────────── */
const areaData = [
  { month: 'Jan', emissions: 4200, offset: 1200 },
  { month: 'Feb', emissions: 3800, offset: 1600 },
  { month: 'Mar', emissions: 3600, offset: 1900 },
  { month: 'Apr', emissions: 3200, offset: 2200 },
  { month: 'May', emissions: 2800, offset: 2500 },
  { month: 'Jun', emissions: 2400, offset: 2800 },
  { month: 'Jul', emissions: 2100, offset: 3000 },
];

const pieData = [
  { name: 'Transport', value: 35, color: '#f5c842' },
  { name: 'Energy', value: 28, color: '#d4a017' },
  { name: 'Supply Chain', value: 22, color: '#c49b12' },
  { name: 'Operations', value: 15, color: '#e6b830' },
];

const stats = [
  { label: 'CO₂ Reduced', value: 42, suffix: '%', icon: '↓' },
  { label: 'Trees Equivalent', value: 12480, suffix: '', icon: '🌱' },
  { label: 'Green Score', value: 94, suffix: '/100', icon: '⚡' },
  { label: 'Active Trackers', value: 2340, suffix: '+', icon: '📊' },
];

/* ── DASHBOARD: elastic spring bounce cards + zoom-rotate charts ── */
const ease = [0.22, 1, 0.36, 1];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

/* Each stat card drops from a different height with elastic overshoot */
const elasticBounce = (i) => ({
  hidden: { opacity: 0, y: -(50 + i * 20), scale: 0.7 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 120 + i * 30, damping: 10 + i * 2, delay: i * 0.08 },
  },
});

/* Area chart zooms in with slight rotation */
const zoomRotateLeft = {
  hidden: { opacity: 0, scale: 0.85, rotate: -2, x: -30, filter: 'blur(8px)' },
  visible: { opacity: 1, scale: 1, rotate: 0, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
};

/* Pie chart flips in from the right */
const flipInRight = {
  hidden: { opacity: 0, rotateY: 15, x: 40, filter: 'blur(6px)' },
  visible: { opacity: 1, rotateY: 0, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
};

/* ── custom tooltip ───────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-4 py-2.5 bg-[#0a0a0a] border border-white/[0.08] shadow-xl">
      <p className="text-white/50 mb-1 font-medium text-xs">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color }}>
          {p.dataKey}: <span className="text-white">{p.value.toLocaleString()} tCO₂</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-lg px-4 py-2.5 bg-[#0a0a0a] border border-white/[0.08] shadow-xl">
      <p className="text-sm font-semibold text-white">{d.name}</p>
      <p className="text-lg font-bold mt-0.5" style={{ color: d.payload?.color || '#f5c842' }}>
        {d.value}<span className="text-xs text-gray-400 ml-1">%</span>
      </p>
    </div>
  );
}

/* ── stat card ────────────────────────────────────── */
function StatCard({ label, value, suffix, icon, inView, index }) {
  return (
    <motion.div
      variants={elasticBounce(index)}
      whileHover={{ y: -8, scale: 1.05, rotateZ: index % 2 === 0 ? 1 : -1, borderColor: 'rgba(212,160,23,0.2)' }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-6 text-center transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(212,160,23,0.08)] cursor-default"
    >
      <motion.span
        className="text-2xl block mb-3"
        initial={{ scale: 0, rotate: -45 }}
        animate={inView ? { scale: [0, 1.3, 1], rotate: [- 45, 10, 0] } : {}}
        transition={{ delay: 0.4 + index * 0.12, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >{icon}</motion.span>
      <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        {inView ? <CountUp end={value} duration={2.2} separator="," /> : 0}
        <span className="gradient-text">{suffix}</span>
      </span>
      <span className="block text-sm text-gray-500 mt-2 font-medium">{label}</span>
    </motion.div>
  );
}

/* ── main dashboard ───────────────────────────────── */
export default function Dashboard() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* Subtle background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(212,160,23,0.03) 0%, transparent 100%)' }}
        />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16"
        >
          <span className="inline-block text-[10px] font-semibold text-gray-500 tracking-[0.25em] uppercase mb-5">
            Live Dashboard
          </span>
          <h2 className="font-serif text-3xl md:text-[2.75rem] font-semibold tracking-tight leading-tight mb-4">
            Your impact,{' '}
            <span className="gradient-text">visualized.</span>
          </h2>
          <p className="max-w-lg mx-auto text-gray-500 text-[15px] leading-relaxed">
            Real-time analytics that transform raw emissions data into clear, actionable insights.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} inView={inView} index={i} />
          ))}
        </motion.div>

        {/* Charts row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-5 gap-5"
          style={{ perspective: 1200 }}
        >
          {/* Area chart — 3 cols (zoom-rotate entrance) */}
          <motion.div
            variants={zoomRotateLeft}
            whileHover={{ borderColor: 'rgba(212,160,23,0.15)', scale: 1.01 }}
            className="lg:col-span-3 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(212,160,23,0.06)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white">Emissions vs Offset</h3>
                <p className="text-xs text-gray-500 mt-0.5">Last 7 months trend</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                ↓ 42% YoY
              </span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c49b12" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#c49b12" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="offGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5c842" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="emissions" stroke="#c49b12" strokeWidth={2} fill="url(#emGrad)" />
                <Area type="monotone" dataKey="offset" stroke="#f5c842" strokeWidth={2} fill="url(#offGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart — 2 cols (flip-in entrance) */}
          <motion.div
            variants={flipInRight}
            whileHover={{ borderColor: 'rgba(212,160,23,0.15)', scale: 1.01 }}
            className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 flex flex-col transition-shadow duration-300 hover:shadow-[0_12px_48px_rgba(212,160,23,0.06)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-3">
              <h3 className="text-sm font-semibold text-white">Footprint Breakdown</h3>
              <p className="text-xs text-gray-500 mt-0.5">By category</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2.5 mt-3">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-gray-400">
                    {d.name} <span className="text-white font-semibold">{d.value}%</span>
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
