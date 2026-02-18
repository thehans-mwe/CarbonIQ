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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
};

/* ── custom tooltip ───────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-glass">
      <p className="text-white/60 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: <span className="font-semibold text-white">{p.value} tCO₂</span>
        </p>
      ))}
    </div>
  );
}

/* ── stat card ────────────────────────────────────── */
function StatCard({ label, value, suffix, icon, inView }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,232,143,0.12)' }}
      className="glass rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 cursor-default"
    >
      <span className="text-2xl mb-3">{icon}</span>
      <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        {inView ? <CountUp end={value} duration={2.4} separator="," /> : 0}
        <span className="gradient-text">{suffix}</span>
      </span>
      <span className="text-sm text-gray-400 mt-2">{label}</span>
    </motion.div>
  );
}

/* ── main dashboard ───────────────────────────────── */
export default function Dashboard() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      {/* subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-green/[0.04] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-medium text-accent-green tracking-widest uppercase mb-6">
            Live Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Your impact,{' '}
            <span className="gradient-text">visualized.</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 mt-6 text-lg">
            Real-time analytics that transform raw emissions data into clear,
            actionable insights.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} inView={inView} />
          ))}
        </motion.div>

        {/* Charts row */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-5 gap-6"
        >
          {/* Area chart – takes 3 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-3 glass rounded-3xl p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Emissions vs Offset</h3>
                <p className="text-sm text-gray-500 mt-1">Last 7 months trend</p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-accent-green/10 text-accent-green font-medium">
                ↓ 42% YoY
              </span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="emGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c49b12" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#c49b12" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="offGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f5c842" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="emissions" stroke="#c49b12" strokeWidth={2.5} fill="url(#emGrad)" />
                <Area type="monotone" dataKey="offset" stroke="#f5c842" strokeWidth={2.5} fill="url(#offGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Pie chart – takes 2 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-2 glass rounded-3xl p-6 md:p-8 flex flex-col"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">Footprint Breakdown</h3>
              <p className="text-sm text-gray-500 mt-1">By category</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(15,22,41,0.9)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '12px',
                      color: '#e2e8f0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-gray-400">
                    {d.name} <span className="text-white font-medium">{d.value}%</span>
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
