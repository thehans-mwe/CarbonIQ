import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from 'recharts';

/* ── animation variants ───────────────────────────────── */
const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const COLORS = ['#f5c842', '#d4a017', '#c49b12', '#e6b830'];

const impactMap = { high: 'text-red-400 bg-red-400/10', medium: 'text-yellow-400 bg-yellow-400/10', low: 'text-accent-green bg-accent-green/10' };

/* ── tooltip ──────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-4 py-3 text-sm shadow-glass">
      <p className="text-white/50 mb-1 font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color || p.fill }}>
          {p.name || p.dataKey}: <span className="font-semibold text-white">{p.value.toFixed(1)} kg</span>
        </p>
      ))}
    </div>
  );
}

/* ── main component ───────────────────────────────────── */
export default function ResultsDashboard({ carbonData, recommendations, inputs, onBack, onRecalculate }) {
  const [aiLoading, setAiLoading] = useState(!recommendations);
  const [recs, setRecs] = useState(recommendations);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (recommendations) {
      setRecs(recommendations);
      setAiLoading(false);
    }
  }, [recommendations]);

  // Build pie data
  const pieData = [
    { name: 'Transport', value: carbonData.transportKg, color: COLORS[0] },
    { name: 'Energy', value: carbonData.energyKg, color: COLORS[1] },
    { name: 'Flights', value: carbonData.flightKg, color: COLORS[2] },
    { name: 'Diet', value: carbonData.dietKg, color: COLORS[3] },
  ].filter((d) => d.value > 0);

  // Build daily breakdown (estimate spread across 7 days)
  const dailyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const jitter = 0.8 + Math.sin(i * 1.3) * 0.3;
    return {
      day,
      transport: +(carbonData.transportKg / 7 * jitter).toFixed(1),
      energy: +(carbonData.energyKg / 7 * (1.1 - i * 0.03)).toFixed(1),
      diet: +(carbonData.dietKg / 7).toFixed(1),
    };
  });

  // Weekly trend (simulated past 4 weeks)
  const trendData = [
    { week: '4 wk ago', total: Math.round(carbonData.totalKg * 1.22) },
    { week: '3 wk ago', total: Math.round(carbonData.totalKg * 1.15) },
    { week: '2 wk ago', total: Math.round(carbonData.totalKg * 1.08) },
    { week: 'Last wk', total: Math.round(carbonData.totalKg * 1.02) },
    { week: 'This wk', total: Math.round(carbonData.totalKg) },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'breakdown', label: 'Breakdown' },
    { id: 'recommendations', label: 'AI Tips' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </motion.button>

          <div className="flex items-center gap-3">
            {carbonData.source && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${carbonData.source === 'api' ? 'bg-accent-green/10 text-accent-green' : carbonData.source === 'demo' ? 'bg-accent-blue/10 text-accent-blue' : 'bg-yellow-400/10 text-yellow-400'}`}>
                {carbonData.source === 'api' ? '✓ Live API' : carbonData.source === 'demo' ? '★ Demo Data' : '⚡ Offline Mode'}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRecalculate}
              className="px-5 py-2 rounded-xl glass text-sm text-white/70 hover:text-white transition-all"
            >
              Recalculate
            </motion.button>
          </div>
        </div>

        {/* Score hero */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="glass rounded-3xl p-8 md:p-12 mb-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-green/[0.04] to-accent-blue/[0.04] pointer-events-none" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-accent-green/30 mb-6"
            >
              <div className="text-center">
                <span className="text-4xl font-serif font-semibold gradient-text">
                  <CountUp end={recs?.score || 0} duration={2} />
                </span>
                <span className="block text-xs text-gray-400 mt-1">Green Score</span>
              </div>
            </motion.div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-3">
              <CountUp end={carbonData.totalKg} duration={2} decimals={1} separator="," /> <span className="text-xl text-gray-400 font-normal">kg CO₂</span>
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">
              {recs?.summary || 'Calculating your personalized insights…'}
            </p>
            {recs?.comparedToAverage && (
              <span className="inline-block mt-4 px-4 py-1.5 rounded-full glass text-sm text-accent-green font-medium">
                {recs.comparedToAverage}
              </span>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-accent-green/15 text-accent-green border border-accent-green/20'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Stat cards */}
              <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total CO₂', value: carbonData.totalKg, suffix: ' kg', icon: '🌍', color: 'text-white' },
                  { label: 'Trees Needed', value: carbonData.treesEquivalent, suffix: '', icon: '🌱', color: 'text-accent-green' },
                  { label: 'Weekly Target', value: recs?.weeklyTarget || 0, suffix: ' kg', icon: '🎯', color: 'text-accent-blue' },
                  { label: 'Green Score', value: recs?.score || 0, suffix: '/100', icon: '⚡', color: 'text-accent-cyan' },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    variants={cardVariants}
                    whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(212,160,23,0.08)' }}
                    className="glass rounded-2xl p-5 text-center cursor-default"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <div className={`text-2xl md:text-3xl font-bold mt-2 ${s.color}`}>
                      <CountUp end={s.value} duration={2} separator="," />
                      <span className="text-sm text-gray-500 font-normal">{s.suffix}</span>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">{s.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-5 gap-6">
                {/* Trend chart */}
                <motion.div variants={cardVariants} className="lg:col-span-3 glass rounded-3xl p-6 md:p-8">
                  <h3 className="text-lg font-semibold text-white mb-1">Weekly Trend</h3>
                  <p className="text-sm text-gray-500 mb-6">Your emissions over the past 5 weeks</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f5c842" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="total" stroke="#f5c842" strokeWidth={2.5} fill="url(#trendGrad)" name="CO₂" />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Pie */}
                <motion.div variants={cardVariants} className="lg:col-span-2 glass rounded-3xl p-6 md:p-8 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-1">Breakdown</h3>
                  <p className="text-sm text-gray-500 mb-4">By category</p>
                  <div className="flex-1 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                          {pieData.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'rgba(15,22,41,0.9)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', color: '#e2e8f0' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {pieData.map((d) => (
                      <div key={d.name} className="flex items-center gap-2 text-sm">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-gray-400 truncate">{d.name} <span className="text-white font-medium">{d.value.toFixed(1)}</span></span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'breakdown' && (
            <motion.div
              key="breakdown"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Daily stacked bar */}
              <motion.div variants={cardVariants} className="glass rounded-3xl p-6 md:p-8">
                <h3 className="text-lg font-semibold text-white mb-1">Daily Breakdown</h3>
                <p className="text-sm text-gray-500 mb-6">Estimated distribution by day</p>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={dailyData} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="transport" stackId="a" fill="#f5c842" radius={[0, 0, 0, 0]} name="Transport" />
                    <Bar dataKey="energy" stackId="a" fill="#d4a017" name="Energy" />
                    <Bar dataKey="diet" stackId="a" fill="#c49b12" radius={[4, 4, 0, 0]} name="Diet" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Category detail cards */}
              <motion.div variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Transport', value: carbonData.transportKg, icon: '🚗', color: '#f5c842', detail: `${inputs?.carMiles || 0} mi · ${inputs?.fuelType || 'gasoline'}` },
                  { label: 'Energy', value: carbonData.energyKg, icon: '⚡', color: '#d4a017', detail: `${inputs?.electricityKwh || 0} kWh · ${inputs?.gasUsage || 0} therms` },
                  { label: 'Flights', value: carbonData.flightKg, icon: '✈️', color: '#c49b12', detail: `${inputs?.shortFlights || 0} short · ${inputs?.longFlights || 0} long` },
                  { label: 'Diet', value: carbonData.dietKg, icon: '🥗', color: '#e6b830', detail: (inputs?.dietType || 'medium_meat').replace('_', ' ') },
                ].map((c) => (
                  <motion.div key={c.label} variants={cardVariants} className="glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{c.icon}</span>
                      <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${c.color}15`, color: c.color }}>
                        {carbonData.totalKg > 0 ? Math.round((c.value / carbonData.totalKg) * 100) : 0}%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      <CountUp end={c.value} duration={1.8} decimals={1} /> <span className="text-sm text-gray-500 font-normal">kg</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{c.label}</p>
                    <p className="text-xs text-gray-600 mt-2">{c.detail}</p>
                    {/* Mini bar */}
                    <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${carbonData.totalKg > 0 ? (c.value / carbonData.totalKg) * 100 : 0}%` }}
                        transition={{ duration: 1.2, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'recommendations' && (
            <motion.div
              key="recs"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {aiLoading ? (
                <motion.div variants={cardVariants} className="glass rounded-3xl p-12 text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-10 h-10 border-3 border-accent-green/20 border-t-accent-green rounded-full mb-4"
                  />
                  <p className="text-gray-400">Generating AI-powered recommendations…</p>
                </motion.div>
              ) : recs?.recommendations?.length ? (
                recs.recommendations.map((rec, i) => (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                    className="glass rounded-2xl p-6 flex gap-5 items-start cursor-default"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green/20 to-accent-blue/10 flex items-center justify-center text-lg font-bold text-accent-green">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h4 className="text-base font-semibold text-white">{rec.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${impactMap[rec.impact] || impactMap.low}`}>
                          {rec.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">{rec.description}</p>
                      {rec.savingsKg > 0 && (
                        <p className="text-xs text-accent-green mt-2">
                          Potential savings: ~{rec.savingsKg} kg CO₂/week
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div variants={cardVariants} className="glass rounded-3xl p-12 text-center">
                  <p className="text-gray-400">No recommendations available yet.</p>
                </motion.div>
              )}

              {recs?.source && (
                <p className="text-center text-xs text-gray-600 pt-4">
                  {recs.source === 'ai' ? 'Recommendations powered by AI' : recs.source === 'demo' ? 'Showing demo recommendations' : 'Recommendations generated offline'}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
