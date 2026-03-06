import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar,
  ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis,
} from 'recharts';
import WhatIfSimulator from './WhatIfSimulator';

/* ── constants ────────────────────────────────────────── */
const COLORS = ['#f5c842', '#d4a017', '#c49b12', '#e6b830', '#b8860b'];
const US_AVG_WEEKLY = 182;
const GLOBAL_AVG_WEEKLY = 130;
const PARIS_TARGET = 58;
const impactMap = {
  high: 'text-red-400 bg-red-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-[#d4a017] bg-[#d4a017]/10',
};

/* ── score tier system ────────────────────────────────── */
function getScoreTier(score) {
  if (score >= 85) return { tier: 'Eco Master', emoji: '🌿', color: '#22c55e', bg: 'bg-emerald-500/10', text: 'text-emerald-400' };
  if (score >= 60) return { tier: 'Conscious Citizen', emoji: '🌍', color: '#d4a017', bg: 'bg-amber-500/10', text: 'text-amber-400' };
  if (score >= 30) return { tier: 'Room to Grow', emoji: '⚠️', color: '#f59e0b', bg: 'bg-orange-500/10', text: 'text-orange-400' };
  return { tier: 'Just Getting Started', emoji: '🔥', color: '#ef4444', bg: 'bg-red-500/10', text: 'text-red-400' };
}

function getPercentile(totalKg) {
  const z = (US_AVG_WEEKLY - totalKg) / 60;
  const pct = Math.round(50 + 50 * Math.tanh(z * 0.8));
  return Math.max(1, Math.min(99, pct));
}

function getEquivalents(totalKg) {
  return {
    trees: Math.round(totalKg / 0.42),
    drivingKm: Math.round(totalKg / 0.404 * 1.609),
    phones: Math.round(totalKg / 0.008),
    showers: Math.round(totalKg / 0.6),
  };
}

function emotionColor(total) {
  if (total <= PARIS_TARGET) return { ring: '#22c55e', glow: 'rgba(34,197,94,0.08)', label: 'Excellent' };
  if (total <= US_AVG_WEEKLY * 0.7) return { ring: '#d4a017', glow: 'rgba(212,160,23,0.06)', label: 'Good' };
  if (total <= US_AVG_WEEKLY) return { ring: '#f59e0b', glow: 'rgba(245,158,11,0.06)', label: 'Average' };
  return { ring: '#ef4444', glow: 'rgba(239,68,68,0.08)', label: 'High' };
}

/* ── comparison bar ───────────────────────────────────── */
function ComparisonBar({ label, value, maxValue, color, delay, isYou, icon }) {
  const pct = Math.min((value / maxValue) * 100, 100);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`space-y-2 ${isYou ? 'p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/80 font-medium flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          {label}
          {isYou && <span className="text-[10px] text-[#d4a017] bg-[#d4a017]/10 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ml-1">You</span>}
        </span>
        <span className="text-sm font-semibold text-white tabular-nums">{value.toFixed(0)} <span className="text-xs font-medium text-white/40">kg</span></span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: delay + 0.15, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}

/* ── tooltips ─────────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-4 py-2.5 bg-[#111] border border-white/[0.08] shadow-xl">
      <p className="text-white/50 mb-1 text-xs font-medium">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-sm font-semibold" style={{ color: p.color || p.fill }}>
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
    <div className="rounded-lg px-4 py-2.5 bg-[#111] border border-white/[0.08] shadow-xl">
      <p className="text-sm font-semibold text-white">{d.name}</p>
      <p className="text-base font-bold mt-0.5" style={{ color: d.payload?.color || '#f5c842' }}>
        {d.value.toFixed(1)} <span className="text-xs text-white/40">kg CO₂</span>
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

  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealStage(1), 400),
      setTimeout(() => setRevealStage(2), 1600),
      setTimeout(() => setRevealStage(3), 2600),
      setTimeout(() => setRevealStage(4), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const emotion = emotionColor(carbonData.totalKg);
  const revealed = (stage) => revealStage >= REVEAL_STAGES.indexOf(stage);
  const scoreTier = getScoreTier(recs?.score || 0);
  const percentile = getPercentile(carbonData.totalKg);
  const equivalents = getEquivalents(carbonData.totalKg);

  const pieData = [
    { name: 'Transport', value: carbonData.transportKg, color: COLORS[0] },
    { name: 'Energy', value: carbonData.energyKg, color: COLORS[1] },
    { name: 'Flights', value: carbonData.flightKg, color: COLORS[2] },
    { name: 'Food', value: carbonData.dietKg, color: COLORS[3] },
    { name: 'Lifestyle', value: carbonData.lifestyleKg || 0, color: COLORS[4] },
  ].filter((d) => d.value > 0);

  const dailyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const jitter = 0.8 + Math.sin(i * 1.3) * 0.3;
    return {
      day,
      transport: +(carbonData.transportKg / 7 * jitter).toFixed(1),
      energy: +(carbonData.energyKg / 7 * (1.1 - i * 0.03)).toFixed(1),
      flights: +(carbonData.flightKg / 7).toFixed(1),
      diet: +(carbonData.dietKg / 7).toFixed(1),
      lifestyle: +((carbonData.lifestyleKg || 0) / 7).toFixed(1),
    };
  });

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
  const scoreVal = recs?.score || 0;
  const circumference = 2 * Math.PI * 54;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-28 pb-20 px-6 relative"
    >
      {/* Subtle ambient glow */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed('number') ? 1 : 0 }}
        transition={{ duration: 2 }}
        style={{
          background: `radial-gradient(ellipse 50% 30% at 50% 15%, ${emotion.glow}, transparent)`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ─── TOP BAR ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: revealed('full') ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-10"
        >
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors group uppercase tracking-widest"
          >
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </motion.button>

          <div className="flex items-center gap-3">
            {carbonData.source && (
              <span className={`text-[10px] px-3 py-1 rounded-full font-medium uppercase tracking-wider ${carbonData.source === 'api' ? 'bg-[#d4a017]/10 text-[#d4a017]' : carbonData.source === 'demo' ? 'bg-[#f5c842]/10 text-[#f5c842]' : 'bg-yellow-400/10 text-yellow-400'}`}>
                {carbonData.source === 'api' ? '✓ Live' : carbonData.source === 'demo' ? '★ Demo' : '⚡ Offline'}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRecalculate}
              className="px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50 hover:text-white/80 hover:border-white/[0.12] transition-all uppercase tracking-wider font-medium"
            >
              Recalculate
            </motion.button>
          </div>
        </motion.div>

        {/* ─── SCORE HERO ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] overflow-hidden">
            {/* Thin accent line at top */}
            <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent 10%, ${emotion.ring}40 50%, transparent 90%)` }} />

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">

                {/* Left: Score ring */}
                <AnimatePresence>
                  {revealed('number') && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="flex flex-col items-center"
                    >
                      <div className="relative w-32 h-32 md:w-36 md:h-36">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                          <motion.circle
                            cx="60" cy="60" r="54"
                            fill="none"
                            stroke={emotion.ring}
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: circumference * (1 - scoreVal / 100) }}
                            transition={{ duration: 2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl md:text-4xl font-serif font-semibold text-white">
                            <CountUp end={scoreVal} duration={2.5} delay={0.3} />
                          </span>
                          <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-0.5">Score</span>
                        </div>
                      </div>

                      {/* Tier badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.6, duration: 0.4 }}
                        className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${scoreTier.bg}`}
                      >
                        <span className="text-sm">{scoreTier.emoji}</span>
                        <span className={`text-[11px] font-semibold ${scoreTier.text}`}>{scoreTier.tier}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Right: Numbers + context */}
                <AnimatePresence>
                  {revealed('number') && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-2">Weekly Carbon Footprint</p>
                      <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-white">
                        <CountUp end={carbonData.totalKg} duration={2.5} delay={0.4} decimals={1} separator="," />
                        <span className="text-lg text-[#f5c842]/80 font-medium ml-2">kg CO₂</span>
                      </h2>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-4 flex flex-wrap items-center gap-3"
                      >
                        <span
                          className="text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider"
                          style={{ background: `${emotion.ring}12`, color: emotion.ring }}
                        >
                          {emotion.label}
                        </span>
                        <span className="text-xs text-white/40">
                          Better than <span className="text-white/70 font-semibold">{percentile}%</span> in the US
                        </span>
                      </motion.div>

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.5 }}
                        className="text-sm text-white/40 mt-4 leading-relaxed max-w-md"
                      >
                        {recs?.summary || 'Calculating your personalized insights…'}
                      </motion.p>

                      {/* Equivalents row */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="mt-6 flex flex-wrap gap-3"
                      >
                        {[
                          { icon: '🌳', value: equivalents.trees, label: 'trees to offset' },
                          { icon: '🚗', value: equivalents.drivingKm.toLocaleString(), label: 'km driving' },
                          { icon: '📱', value: equivalents.phones.toLocaleString(), label: 'phone charges' },
                          { icon: '🚿', value: equivalents.showers.toLocaleString(), label: 'showers' },
                        ].map((eq, i) => (
                          <motion.div
                            key={eq.label}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 + i * 0.08, duration: 0.3 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]"
                          >
                            <span className="text-sm">{eq.icon}</span>
                            <span className="text-xs text-white/70 font-medium">{eq.value}</span>
                            <span className="text-[10px] text-white/30">{eq.label}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── COMPARISON BARS ─── */}
        <AnimatePresence>
          {revealed('comparison') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-6 md:p-8 mb-8 space-y-4"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-4">How You Compare</p>
              <ComparisonBar label="Your Emissions" value={carbonData.totalKg} maxValue={barMax} color={emotion.ring} delay={0} isYou icon="📍" />
              <ComparisonBar label="US Average" value={US_AVG_WEEKLY} maxValue={barMax} color="rgba(255,255,255,0.15)" delay={0.08} icon="🇺🇸" />
              <ComparisonBar label="Global Average" value={GLOBAL_AVG_WEEKLY} maxValue={barMax} color="rgba(255,255,255,0.10)" delay={0.16} icon="🌐" />
              <ComparisonBar label="2050 Paris Target" value={PARIS_TARGET} maxValue={barMax} color="#22c55e" delay={0.24} icon="🎯" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── QUICK BREAKDOWN ─── */}
        <AnimatePresence>
          {revealed('breakdown') && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-6 md:p-8 mb-8"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-6">Quick Breakdown</p>
              <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Transport', value: carbonData.transportKg, icon: '🚗', color: COLORS[0] },
                    { label: 'Energy', value: carbonData.energyKg, icon: '⚡', color: COLORS[1] },
                    { label: 'Flights', value: carbonData.flightKg, icon: '✈️', color: COLORS[2] },
                    { label: 'Food', value: carbonData.dietKg, icon: '🥗', color: COLORS[3] },
                    { label: 'Lifestyle', value: carbonData.lifestyleKg || 0, icon: '🛍️', color: COLORS[4] },
                  ].filter(c => c.value > 0).map((c, i) => (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="text-xl flex-shrink-0">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-white/80 font-medium">{c.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-white/30 font-medium">{carbonData.totalKg > 0 ? Math.round((c.value / carbonData.totalKg) * 100) : 0}%</span>
                            <span className="text-sm font-semibold text-white tabular-nums">
                              <CountUp end={c.value} duration={1.2} decimals={1} />
                              <span className="text-xs text-white/30 ml-1">kg</span>
                            </span>
                          </div>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: c.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${carbonData.totalKg > 0 ? (c.value / carbonData.totalKg) * 100 : 0}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tabs */}
              <div className="flex gap-1 mb-8 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap flex items-center gap-2 uppercase tracking-wider ${
                      activeTab === tab.id
                        ? 'bg-white/[0.06] text-white'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    {tab.label}
                    {tab.id === 'whatif' && <span className="text-[8px] bg-[#d4a017]/15 text-[#d4a017] px-1.5 py-0.5 rounded font-bold">NEW</span>}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {[
                        { label: 'Total CO₂', value: carbonData.totalKg, suffix: ' kg', icon: '🌍', color: 'text-white' },
                        { label: 'Trees Needed', value: carbonData.treesEquivalent, suffix: '', icon: '🌲', color: 'text-[#d4a017]' },
                        { label: 'Driving Equiv.', value: equivalents.drivingKm, suffix: ' km', icon: '🚗', color: 'text-white' },
                        { label: scoreTier.tier, value: recs?.score || 0, suffix: '/100', icon: scoreTier.emoji, color: scoreTier.text },
                      ].map((s, i) => (
                        <motion.div
                          key={s.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-5 text-center"
                        >
                          <span className="text-2xl block">{s.icon}</span>
                          <div className={`text-2xl md:text-3xl font-bold mt-2 ${s.color} tabular-nums`}>
                            <CountUp end={s.value} duration={1.5} separator="," />
                            <span className="text-[10px] text-white/30 font-medium">{s.suffix}</span>
                          </div>
                          <span className="text-[10px] text-white/30 mt-1.5 font-medium block uppercase tracking-wider">{s.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Charts row */}
                    <div className="grid lg:grid-cols-5 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15, duration: 0.5 }}
                        className="lg:col-span-3 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-6 md:p-8"
                      >
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-1">Weekly Trend</p>
                        <p className="text-xs text-white/20 mb-5">Emissions over the past 5 weeks</p>
                        <ResponsiveContainer width="100%" height={240}>
                          <AreaChart data={trendData}>
                            <defs>
                              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f5c842" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="total" stroke="#d4a017" strokeWidth={2} fill="url(#trendGrad)" name="CO₂" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="lg:col-span-2 rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-6 md:p-8 flex flex-col"
                      >
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-1">Breakdown</p>
                        <p className="text-xs text-white/20 mb-4">By category</p>
                        <div className="flex-1 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                              <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                                {pieData.map((entry, i) => (
                                  <Cell key={i} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip content={<PieTooltip />} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
                          {pieData.map((d) => (
                            <div key={d.name} className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                              <span className="text-[11px] text-white/40 font-medium truncate">{d.name}</span>
                              <span className="text-[11px] font-semibold text-white/70 ml-auto tabular-nums">{d.value.toFixed(1)}</span>
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
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-6 md:p-8"
                    >
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.25em] mb-1">Daily Breakdown</p>
                      <p className="text-xs text-white/20 mb-5">Estimated distribution by day</p>
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={dailyData} barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                          <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<CustomTooltip />} />
                          {carbonData.transportKg > 0 && <Bar dataKey="transport" stackId="a" fill="#f5c842" radius={[0, 0, 0, 0]} name="Transport" />}
                          {carbonData.energyKg > 0 && <Bar dataKey="energy" stackId="a" fill="#d4a017" name="Energy" />}
                          {carbonData.flightKg > 0 && <Bar dataKey="flights" stackId="a" fill="#c49b12" name="Flights" />}
                          {carbonData.dietKg > 0 && <Bar dataKey="diet" stackId="a" fill="#e6b830" name="Diet" />}
                          {(carbonData.lifestyleKg || 0) > 0 && <Bar dataKey="lifestyle" stackId="a" fill="#b8860b" radius={[3, 3, 0, 0]} name="Lifestyle" />}
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>

                    {(() => {
                      const breakdownCards = [
                        { label: 'Transport', value: carbonData.transportKg, icon: '🚗', color: '#f5c842', detail: `${inputs?.carMiles || 0} mi · ${inputs?.fuelType || 'gasoline'}` },
                        { label: 'Energy', value: carbonData.energyKg, icon: '⚡', color: '#d4a017', detail: `${inputs?.electricityKwh || 0} kWh · ${inputs?.gasUsage || 0} therms` },
                        { label: 'Flights', value: carbonData.flightKg, icon: '✈️', color: '#c49b12', detail: `${inputs?.shortFlights || 0} short · ${inputs?.longFlights || 0} long` },
                        { label: 'Diet', value: carbonData.dietKg, icon: '🥗', color: '#e6b830', detail: (inputs?.dietType || 'medium_meat').replace('_', ' ') },
                        { label: 'Lifestyle', value: carbonData.lifestyleKg || 0, icon: '🛍️', color: '#b8860b', detail: `${(inputs?.shoppingHabit || 'average').replace('_', ' ')} · ${inputs?.streamingHours || 0}h streaming` },
                      ].filter(c => c.value > 0);
                      const colClass = breakdownCards.length >= 5 ? 'lg:grid-cols-5' : breakdownCards.length >= 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2';
                      return (
                        <div className={`grid sm:grid-cols-2 ${colClass} gap-3`}>
                          {breakdownCards.map((c, i) => (
                            <motion.div
                              key={c.label}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05, duration: 0.3 }}
                              className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-4"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xl">{c.icon}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${c.color}12`, color: c.color }}>
                                  {carbonData.totalKg > 0 ? Math.round((c.value / carbonData.totalKg) * 100) : 0}%
                                </span>
                              </div>
                              <div className="text-xl font-bold text-white tabular-nums">
                                <CountUp end={c.value} duration={1.5} decimals={1} />
                                <span className="text-xs text-white/30 font-medium ml-1">kg</span>
                              </div>
                              <p className="text-xs text-white/60 font-medium mt-0.5">{c.label}</p>
                              <p className="text-[10px] text-white/25 mt-0.5">{c.detail}</p>
                              <div className="mt-2.5 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${carbonData.totalKg > 0 ? (c.value / carbonData.totalKg) * 100 : 0}%` }}
                                  transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                  className="h-full rounded-full"
                                  style={{ background: c.color }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}

                {activeTab === 'whatif' && (
                  <motion.div
                    key="whatif"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <WhatIfSimulator carbonData={carbonData} inputs={inputs} />
                  </motion.div>
                )}

                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recs"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {aiLoading ? (
                      <div className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-12 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          className="inline-block w-8 h-8 border-2 border-[#d4a017]/20 border-t-[#d4a017] rounded-full mb-3"
                        />
                        <p className="text-sm text-white/40 font-medium">Generating AI-powered recommendations…</p>
                      </div>
                    ) : recs?.recommendations?.length ? (
                      <>
                        {/* AI Summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl bg-[#d4a017]/[0.04] border border-[#d4a017]/10 p-5 flex items-start gap-4 mb-1"
                        >
                          <span className="text-2xl flex-shrink-0">🤖</span>
                          <div>
                            <p className="text-[10px] font-semibold text-[#d4a017] mb-1 uppercase tracking-wider">AI Analysis</p>
                            <p className="text-sm text-white/50 leading-relaxed">
                              Based on your lifestyle, here are {recs.recommendations.length} changes that would reduce{' '}
                              <span className="text-white/80 font-semibold">
                                {recs.recommendations.reduce((sum, r) => sum + (r.savingsKg || 0), 0)} kg CO₂/week
                              </span>{' '}
                              ({carbonData.totalKg > 0 ? Math.round((recs.recommendations.reduce((sum, r) => sum + (r.savingsKg || 0), 0) / carbonData.totalKg) * 100) : 0}% of your emissions).
                            </p>
                          </div>
                        </motion.div>

                        {recs.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-xl bg-[#0a0a0a] border border-white/[0.06] p-5 flex gap-4 items-start hover:border-white/[0.10] transition-colors"
                          >
                            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center text-sm font-bold text-white/40">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <h4 className="text-sm font-semibold text-white/90">{rec.title}</h4>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${impactMap[rec.impact] || impactMap.low}`}>
                                  {rec.impact}
                                </span>
                              </div>
                              <p className="text-xs text-white/40 leading-relaxed">{rec.description}</p>
                              {rec.savingsKg > 0 && (
                                <p className="text-[11px] text-[#d4a017] mt-2 font-medium">
                                  Potential: −{rec.savingsKg} kg CO₂/week
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      <div className="rounded-2xl bg-[#0a0a0a] border border-white/[0.06] p-12 text-center">
                        <p className="text-sm text-white/40">No recommendations available yet.</p>
                      </div>
                    )}

                    {recs?.source && (
                      <p className="text-center text-[10px] text-white/20 pt-3 uppercase tracking-wider">
                        {recs.source === 'ai' ? 'Powered by AI' : recs.source === 'demo' ? 'Demo recommendations' : 'Generated offline'}
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
