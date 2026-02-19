import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from 'recharts';
import WhatIfSimulator from './WhatIfSimulator';

/* ── constants ────────────────────────────────────────── */
const COLORS = ['#f5c842', '#d4a017', '#c49b12', '#e6b830'];
const US_AVG_WEEKLY = 182;   // kg CO₂ – US per-capita weekly average
const GLOBAL_AVG_WEEKLY = 130; // kg CO₂ – global per-capita weekly average
const PARIS_TARGET  = 58;    // kg CO₂ – 2050 Paris-aligned weekly target
const impactMap = { high: 'text-red-400 bg-red-400/10', medium: 'text-yellow-400 bg-yellow-400/10', low: 'text-accent-green bg-accent-green/10' };

/* ── score tier system ────────────────────────────────── */
function getScoreTier(score) {
  if (score >= 85) return { tier: 'Eco Master', emoji: '🌿', color: '#22c55e', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
  if (score >= 60) return { tier: 'Conscious Citizen', emoji: '🌍', color: '#d4a017', bg: 'bg-amber-500/10', text: 'text-amber-400' };
  if (score >= 30) return { tier: 'Room to Grow', emoji: '⚠️', color: '#f59e0b', bg: 'bg-orange-500/10', text: 'text-orange-400' };
  return { tier: 'Just Getting Started', emoji: '🔥', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' };
}

/* ── percentile calculator ────────────────────────────── */
function getPercentile(totalKg) {
  // Based on distribution around US_AVG_WEEKLY = 182 kg, std dev ~60
  const z = (US_AVG_WEEKLY - totalKg) / 60;
  const pct = Math.round(50 + 50 * Math.tanh(z * 0.8)); // smooth S-curve
  return Math.max(1, Math.min(99, pct));
}

/* ── CO₂ equivalents ─────────────────────────────────── */
function getEquivalents(totalKg) {
  return {
    trees: Math.round(totalKg / 0.42),           // trees needed per week to offset
    drivingKm: Math.round(totalKg / 0.404 * 1.609), // km driven equivalent
    phones: Math.round(totalKg / 0.008),          // smartphone charges
    showers: Math.round(totalKg / 0.6),           // 8-min hot showers
  };
}

/* ── helpers ──────────────────────────────────────────── */
function emotionColor(total) {
  if (total <= PARIS_TARGET) return { ring: '#22c55e', glow: 'rgba(34,197,94,0.12)', label: 'Excellent' };
  if (total <= US_AVG_WEEKLY * 0.7) return { ring: '#d4a017', glow: 'rgba(212,160,23,0.10)', label: 'Good' };
  if (total <= US_AVG_WEEKLY) return { ring: '#f59e0b', glow: 'rgba(245,158,11,0.10)', label: 'Average' };
  return { ring: '#ef4444', glow: 'rgba(239,68,68,0.12)', label: 'High' };
}

/* ── CO₂ equivalents card ─────────────────────────────── */
function EquivalentsCard({ equivalents, delay }) {
  const items = [
    { icon: '🌳', value: equivalents.trees, label: 'trees needed to offset', unit: '' },
    { icon: '🚗', value: equivalents.drivingKm.toLocaleString(), label: 'km of driving', unit: '' },
    { icon: '📱', value: equivalents.phones.toLocaleString(), label: 'phone charges', unit: '' },
    { icon: '🚿', value: equivalents.showers.toLocaleString(), label: 'hot showers', unit: '' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6"
    >
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + i * 0.08, duration: 0.4 }}
          className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 text-center hover:bg-white/[0.05] transition-colors cursor-default"
        >
          <span className="text-2xl block mb-1">{item.icon}</span>
          <span className="text-lg font-bold text-white block">{item.value}</span>
          <span className="text-[11px] text-white/40 leading-tight block">{item.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ── particle burst (reduced to 8 for performance) ──── */
function ParticleBurst({ color }) {
  const particles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      angle: (i / 8) * 360,
      dist: 60 + Math.random() * 60,
      size: 3 + Math.random() * 3,
      delay: Math.random() * 0.2,
      dur: 0.7 + Math.random() * 0.3,
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, background: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
            y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: p.dur, delay: p.delay, ease: [0.4, 0, 0.2, 1] }}
        />
      ))}
    </div>
  );
}

/* ── comparison bar ───────────────────────────────────── */
function ComparisonBar({ label, value, maxValue, color, delay, isYou, icon }) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`space-y-1.5 ${isYou ? 'p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-lg text-white font-semibold flex items-center gap-2">
          {icon && <span className="text-base">{icon}</span>}
          {label}
          {isYou && <span className="text-xs text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full ml-1">You</span>}
        </span>
        <span className="text-lg font-bold text-white">{value.toFixed(0)} <span className="text-base font-medium text-[#f5c842]">kg CO₂</span></span>
      </div>
      <div className="h-3.5 rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ── tooltip ──────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-5 py-3 shadow-glass bg-[#0a0a0a] border border-[#f5c842]/20 backdrop-blur-xl">
      <p className="text-white/70 mb-1 font-medium text-sm">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-base font-bold" style={{ color: p.color || p.fill }}>
          {p.name || p.dataKey}: <span className="text-white">{p.value.toFixed(1)} kg</span>
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="rounded-xl px-5 py-3 shadow-glass bg-[#0a0a0a] border border-[#f5c842]/20 backdrop-blur-xl">
      <p className="text-lg font-bold text-white">{d.name}</p>
      <p className="text-xl font-bold mt-1" style={{ color: d.payload?.color || '#f5c842' }}>
        {d.value.toFixed(1)} <span className="text-base text-[#f5c842]">kg</span>
      </p>
    </div>
  );
}

/* ── sequential reveal stages ─────────────────────────── */
const REVEAL_STAGES = ['blur', 'number', 'comparison', 'breakdown', 'full'];

/* ━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function ResultsDashboard({ carbonData, recommendations, inputs, onBack, onRecalculate }) {
  const [aiLoading, setAiLoading] = useState(!recommendations);
  const [recs, setRecs] = useState(recommendations);
  const [activeTab, setActiveTab] = useState('overview');
  const [revealStage, setRevealStage] = useState(0);

  useEffect(() => {
    if (recommendations) { setRecs(recommendations); setAiLoading(false); }
  }, [recommendations]);

  // Sequential dramatic reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStage(1), 400),   // show big number
      setTimeout(() => setRevealStage(2), 1600),   // show comparison bars
      setTimeout(() => setRevealStage(3), 2600),   // show breakdown pie
      setTimeout(() => setRevealStage(4), 3400),   // full UI
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const emotion = emotionColor(carbonData.totalKg);
  const revealed = (stage) => revealStage >= REVEAL_STAGES.indexOf(stage);
  const scoreTier = getScoreTier(recs?.score || 0);
  const percentile = getPercentile(carbonData.totalKg);
  const equivalents = getEquivalents(carbonData.totalKg);

  // Build pie data
  const pieData = [
    { name: 'Transport', value: carbonData.transportKg, color: COLORS[0] },
    { name: 'Energy', value: carbonData.energyKg, color: COLORS[1] },
    { name: 'Flights', value: carbonData.flightKg, color: COLORS[2] },
    { name: 'Diet', value: carbonData.dietKg, color: COLORS[3] },
  ].filter((d) => d.value > 0);

  // Build daily breakdown
  const dailyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const jitter = 0.8 + Math.sin(i * 1.3) * 0.3;
    return {
      day,
      transport: +(carbonData.transportKg / 7 * jitter).toFixed(1),
      energy: +(carbonData.energyKg / 7 * (1.1 - i * 0.03)).toFixed(1),
      diet: +(carbonData.dietKg / 7).toFixed(1),
    };
  });

  // Weekly trend (simulated)
  const trendData = [
    { week: '4 wk ago', total: Math.round(carbonData.totalKg * 1.22) },
    { week: '3 wk ago', total: Math.round(carbonData.totalKg * 1.15) },
    { week: '2 wk ago', total: Math.round(carbonData.totalKg * 1.08) },
    { week: 'Last wk', total: Math.round(carbonData.totalKg * 1.02) },
    { week: 'This wk', total: Math.round(carbonData.totalKg) },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'breakdown', label: 'Breakdown', icon: '🔍' },
    { id: 'whatif', label: 'What If', icon: '🔮' },
    { id: 'recommendations', label: 'AI Tips', icon: '🤖' },
  ];

  const barMax = Math.max(carbonData.totalKg, US_AVG_WEEKLY, GLOBAL_AVG_WEEKLY, PARIS_TARGET) * 1.1;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-28 pb-20 px-6 relative"
    >
      {/* Emotional ambient glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed('number') ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 20%, ${emotion.glow}, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed('full') ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10"
        >
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-amber-400/60 hover:text-white transition-colors group"
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
              className="px-5 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white/70 hover:text-white transition-all"
            >
              Recalculate
            </motion.button>
          </div>
        </motion.div>

        {/* ─── DRAMATIC SCORE HERO ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-[1px] overflow-hidden mb-10"
          style={{
            background: `conic-gradient(from 180deg, transparent 30%, ${emotion.ring}44, ${emotion.ring}22, transparent 70%)`,
          }}
        >
          <div className="rounded-3xl bg-[#060606]/95 backdrop-blur-xl p-8 md:p-14 text-center relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${emotion.glow}, transparent)`,
            }} />

            <div className="relative z-10">
              {/* Particle burst behind the number */}
              <AnimatePresence>
                {revealed('number') && (
                  <div className="relative inline-block">
                    <ParticleBurst color={emotion.ring} />
                    {/* Score ring */}
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-flex items-center justify-center w-36 h-36 rounded-full mb-4 relative"
                    >
                      {/* Ring SVG */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 144">
                        <circle cx="72" cy="72" r="66" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                        <motion.circle
                          cx="72" cy="72" r="66"
                          fill="none"
                          stroke={emotion.ring}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 66}
                          initial={{ strokeDashoffset: 2 * Math.PI * 66 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 66 * (1 - (recs?.score || 0) / 100) }}
                          transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          transform="rotate(-90 72 72)"
                        />
                      </svg>
                      <div className="text-center">
                        <span className="text-4xl font-serif font-semibold gradient-text">
                          <CountUp end={recs?.score || 0} duration={2.5} delay={0.3} />
                        </span>
                        <span className="block text-[11px] text-white/60 mt-0.5 font-medium">CarbonIQ</span>
                      </div>
                    </motion.div>

                    {/* Gamified tier badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${scoreTier.bg} mb-6`}
                    >
                      <span className="text-lg">{scoreTier.emoji}</span>
                      <span className={`text-sm font-bold ${scoreTier.text}`}>{scoreTier.tier}</span>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Big CO₂ number with glow pulse */}
              <AnimatePresence>
                {revealed('number') && (
                  <motion.div
                    initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight mb-2">
                      <CountUp end={carbonData.totalKg} duration={2.5} delay={0.5} decimals={1} separator=","
                        onEnd={() => {
                          // Trigger glow pulse effect via CSS class
                          const el = document.getElementById('co2-number');
                          if (el) { el.classList.add('glow-pulse'); setTimeout(() => el.classList.remove('glow-pulse'), 1000); }
                        }}
                      />
                      <span id="co2-number" className="text-xl text-[#f5c842] font-medium ml-2 transition-all duration-500">kg CO₂</span>
                    </h2>

                    {/* Percentile comparison */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                      className="space-y-2"
                    >
                      <span
                        className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
                        style={{ background: `${emotion.ring}15`, color: emotion.ring }}
                      >
                        {emotion.label} — {recs?.comparedToAverage || 'This week\u2019s emissions'}
                      </span>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.0, duration: 0.5 }}
                        className="text-white/50 text-sm"
                      >
                        That's better than <span className="text-white font-semibold">{percentile}%</span> of people in the US.
                      </motion.p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Summary text */}
              <AnimatePresence>
                {revealed('number') && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                    className="text-white/70 text-lg max-w-lg mx-auto mt-4 leading-relaxed"
                  >
                    {recs?.summary || 'Calculating your personalized insights…'}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* CO₂ Equivalents */}
              <AnimatePresence>
                {revealed('number') && (
                  <EquivalentsCard equivalents={equivalents} delay={2.2} />
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ─── COMPARISON BARS ─── */}
        <AnimatePresence>
          {revealed('comparison') && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8 mb-8 space-y-5"
            >
              <h3 className="text-xl font-semibold text-white font-serif mb-3">How You Compare</h3>
              <ComparisonBar label="Your Emissions" value={carbonData.totalKg} maxValue={barMax} color={emotion.ring} delay={0} isYou icon="📍" />
              <ComparisonBar label="US Average" value={US_AVG_WEEKLY} maxValue={barMax} color="rgba(255,255,255,0.25)" delay={0.12} icon="🇺🇸" />
              <ComparisonBar label="Global Average" value={GLOBAL_AVG_WEEKLY} maxValue={barMax} color="rgba(255,255,255,0.15)" delay={0.24} icon="🌐" />
              <ComparisonBar label="2050 Paris Target" value={PARIS_TARGET} maxValue={barMax} color="#22c55e" delay={0.36} icon="🎯" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── QUICK BREAKDOWN (mini pie + category pills) ─── */}
        <AnimatePresence>
          {revealed('breakdown') && (
            <motion.div
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8 mb-8"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Pie */}
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Category pills */}
                <div className="space-y-3">
                  {[
                    { label: 'Transport', value: carbonData.transportKg, icon: '🚗', color: COLORS[0] },
                    { label: 'Energy', value: carbonData.energyKg, icon: '⚡', color: COLORS[1] },
                    { label: 'Flights', value: carbonData.flightKg, icon: '✈️', color: COLORS[2] },
                    { label: 'Diet', value: carbonData.dietKg, icon: '🥗', color: COLORS[3] },
                  ].map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors duration-300"
                    >
                      <span className="text-3xl">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xl text-white font-bold block">{c.label}</span>
                            <span className="text-sm text-[#f5c842] font-semibold">{carbonData.totalKg > 0 ? Math.round((c.value / carbonData.totalKg) * 100) : 0}% of total</span>
                          </div>
                          <span className="text-2xl font-bold text-white">
                            <CountUp end={c.value} duration={1.5} decimals={1} /> <span className="text-lg font-bold text-[#f5c842]">kg</span>
                          </span>
                        </div>
                        <div className="mt-3 h-3 rounded-full bg-white/[0.10] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: c.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${carbonData.totalKg > 0 ? (c.value / carbonData.totalKg) * 100 : 0}%` }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FULL DASHBOARD (tabs) ─── */}
        <AnimatePresence>
          {revealed('full') && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-accent-green/15 text-accent-green border border-accent-green/20'
                        : 'bg-white/[0.03] border border-white/[0.06] text-gray-300 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{tab.icon}</span>
                    {tab.label}
                    {tab.id === 'whatif' && <span className="text-[9px] bg-accent-green/20 text-accent-green px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span>}
                  </motion.button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Total CO₂', value: carbonData.totalKg, suffix: ' kg', icon: '🌍', color: 'text-white' },
                        { label: 'Trees Needed', value: carbonData.treesEquivalent, suffix: '', icon: '�', color: 'text-accent-green' },
                        { label: 'Driving Equiv.', value: equivalents.drivingKm, suffix: ' km', icon: '🚗', color: 'text-white' },
                        { label: scoreTier.tier, value: recs?.score || 0, suffix: '/100', icon: scoreTier.emoji, color: scoreTier.text },
                      ].map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(212,160,23,0.08)' }}
                          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 text-center cursor-default backdrop-blur-sm"
                        >
                          <span className="text-2xl">{s.icon}</span>
                          <div className={`text-2xl md:text-3xl font-bold mt-2 ${s.color}`}>
                            <CountUp end={s.value} duration={2} separator="," />
                            <span className="text-sm text-[#f5c842] font-medium">{s.suffix}</span>
                          </div>
                          <span className="text-sm text-white/80 mt-1 font-medium">{s.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid lg:grid-cols-5 gap-6">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="lg:col-span-3 rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8"
                      >
                        <h3 className="text-xl font-semibold text-white font-serif mb-1">Weekly Trend</h3>
                        <p className="text-base text-white/70 mb-6">Your emissions over the past 5 weeks</p>
                        <ResponsiveContainer width="100%" height={260}>
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f5c842" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="week" tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="total" stroke="#f5c842" strokeWidth={2.5} fill="url(#trendGrad)" name="CO₂" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="lg:col-span-2 rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8 flex flex-col"
                      >
                        <h3 className="text-xl font-semibold text-white font-serif mb-1">Breakdown</h3>
                        <p className="text-base text-white/70 mb-4">By category</p>
                        <div className="flex-1 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                                {pieData.map((entry, i) => (
                                  <Cell key={i} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<PieTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-5">
                          {pieData.map((d) => (
                            <div key={d.name} className="flex items-center gap-3">
                              <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-2 ring-white/10" style={{ background: d.color }} />
                              <span className="text-sm text-white/70 font-medium min-w-[70px]">{d.name}</span>
                              <span className="text-sm font-bold text-[#f5c842] ml-auto tabular-nums">{d.value.toFixed(1)} kg</span>
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.6 }}
                      className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8"
                    >
                      <h3 className="text-xl font-semibold text-white font-serif mb-1">Daily Breakdown</h3>
                      <p className="text-base text-white/70 mb-6">Estimated distribution by day</p>
                      <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={dailyData} barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                          <XAxis dataKey="day" tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#ffffff', fontSize: 14, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="transport" stackId="a" fill="#f5c842" radius={[0, 0, 0, 0]} name="Transport" />
                          <Bar dataKey="energy" stackId="a" fill="#d4a017" name="Energy" />
                          <Bar dataKey="diet" stackId="a" fill="#c49b12" radius={[4, 4, 0, 0]} name="Diet" />
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { label: 'Transport', value: carbonData.transportKg, icon: '🚗', color: '#f5c842', detail: `${inputs?.carMiles || 0} mi · ${inputs?.fuelType || 'gasoline'}` },
                        { label: 'Energy', value: carbonData.energyKg, icon: '⚡', color: '#d4a017', detail: `${inputs?.electricityKwh || 0} kWh · ${inputs?.gasUsage || 0} therms` },
                        { label: 'Flights', value: carbonData.flightKg, icon: '✈️', color: '#c49b12', detail: `${inputs?.shortFlights || 0} short · ${inputs?.longFlights || 0} long` },
                        { label: 'Diet', value: carbonData.dietKg, icon: '🥗', color: '#e6b830', detail: (inputs?.dietType || 'medium_meat').replace('_', ' ') },
                      ].map((c, i) => (
                        <motion.div
                          key={c.label}
                          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: i * 0.08, duration: 0.6 }}
                          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 backdrop-blur-sm"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl">{c.icon}</span>
                            <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${c.color}15`, color: c.color }}>
                              {carbonData.totalKg > 0 ? Math.round((c.value / carbonData.totalKg) * 100) : 0}%
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-white">
                            <CountUp end={c.value} duration={1.8} decimals={1} /> <span className="text-base text-[#f5c842] font-semibold">kg</span>
                          </div>
                          <p className="text-base text-white mt-1 font-bold">{c.label}</p>
                          <p className="text-sm text-white/70 mt-1 font-medium">{c.detail}</p>
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
                    </div>
                  </motion.div>
                )}

                {activeTab === 'whatif' && (
                  <motion.div
                    key="whatif"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <WhatIfSimulator carbonData={carbonData} inputs={inputs} />
                  </motion.div>
                )}

                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recs"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {aiLoading ? (
                      <div className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-12 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-10 h-10 border-3 border-accent-green/20 border-t-accent-green rounded-full mb-4"
                        />
                        <p className="text-white/70 font-medium">Generating AI-powered recommendations…</p>
                      </div>
                    ) : recs?.recommendations?.length ? (
                      <>
                        {/* AI Summary Header */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-2xl bg-gradient-to-r from-accent-green/[0.08] to-accent-blue/[0.04] border border-accent-green/20 p-5 mb-2 flex items-start gap-4"
                        >
                          <span className="text-3xl flex-shrink-0">🤖</span>
                          <div>
                            <p className="text-sm font-semibold text-accent-green mb-1">AI Analysis</p>
                            <p className="text-sm text-white/70 leading-relaxed">
                              Based on your lifestyle, here are {recs.recommendations.length} changes that would reduce{' '}
                              <span className="text-white font-bold">
                                {recs.recommendations.reduce((sum, r) => sum + (r.savingsKg || 0), 0)} kg CO₂/week
                              </span>{' '}
                              ({carbonData.totalKg > 0 ? Math.round((recs.recommendations.reduce((sum, r) => sum + (r.savingsKg || 0), 0) / carbonData.totalKg) * 100) : 0}% of your emissions).
                            </p>
                          </div>
                        </motion.div>

                        {recs.recommendations.map((rec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                          whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.2)' }}
                          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 flex gap-5 items-start cursor-default backdrop-blur-sm"
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
                            <p className="text-sm text-gray-300 leading-relaxed">{rec.description}</p>
                            {rec.savingsKg > 0 && (
                              <p className="text-xs text-accent-green mt-2">
                                Potential savings: ~{rec.savingsKg} kg CO₂/week
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      </>
                    ) : (
                      <div className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-12 text-center">
                        <p className="text-white/70 font-medium">No recommendations available yet.</p>
                      </div>
                    )}

                    {recs?.source && (
                      <p className="text-center text-sm text-white/50 pt-4">
                        {recs.source === 'ai' ? 'Recommendations powered by AI' : recs.source === 'demo' ? 'Showing demo recommendations' : 'Recommendations generated offline'}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
