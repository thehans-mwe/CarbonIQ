import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── step config ─────────────────────────────────────── */
const STEPS = [
  { id: 'transport',  label: 'Transport',  icon: '🚗', emoji: '🛣️', desc: 'How do you get around?' },
  { id: 'energy',     label: 'Energy',     icon: '⚡', emoji: '💡', desc: 'Your home energy usage' },
  { id: 'flights',    label: 'Flights',    icon: '✈️', emoji: '🌍', desc: 'Air travel this week' },
  { id: 'diet',       label: 'Food',       icon: '🥗', emoji: '🍽️', desc: 'What fuels you?' },
  { id: 'lifestyle',  label: 'Lifestyle',  icon: '🛍️', emoji: '♻️', desc: 'Shopping, streaming & habits' },
];

const fuelOptions = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel',   label: 'Diesel' },
  { value: 'hybrid',   label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
];

const dietOptions = [
  { value: 'heavy_meat',  label: 'Heavy meat eater',   emoji: '🥩' },
  { value: 'medium_meat', label: 'Average (some meat)', emoji: '🍗' },
  { value: 'vegetarian',  label: 'Vegetarian',          emoji: '🥬' },
  { value: 'vegan',       label: 'Vegan',               emoji: '🌱' },
];

const shoppingOptions = [
  { value: 'minimal',  label: 'Minimal buyer',    emoji: '🧘' },
  { value: 'average',  label: 'Average shopper',  emoji: '🛒' },
  { value: 'frequent', label: 'Frequent shopper',  emoji: '🛍️' },
  { value: 'heavy',    label: 'Heavy consumer',    emoji: '📦' },
];

/* ─── lightweight CSS-only ambient shapes ─────────────── */
function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div className="absolute w-[300px] h-[300px] rounded-full top-[10%] -left-[5%] animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.04) 0%, transparent 70%)' }} />
      <div className="absolute w-[200px] h-[200px] rounded-full top-[60%] -right-[3%] animate-float-medium" style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.05) 0%, transparent 70%)' }} />
    </div>
  );
}

/* ─── animated progress bar ───────────────────────────── */
function ProgressBar({ step, total }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="relative h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-8">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, #d4a017, #f5c842, #d4a017)',
          backgroundSize: '200% 100%',
        }}
        animate={{ width: `${pct}%`, backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }}
        transition={{
          width: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
          backgroundPosition: { duration: 3, repeat: Infinity, ease: 'linear' },
        }}
      />
      {/* glow */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 60%, rgba(245,200,66,0.5))',
          filter: 'blur(4px)',
        }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ─── step indicators ─────────────────────────────────── */
function StepIndicators({ currentStep, onGoToStep }) {
  return (
    <div className="flex items-center justify-between mb-10 px-2">
      {STEPS.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <motion.button
              type="button"
              onClick={() => i <= currentStep && onGoToStep(i)}
              whileHover={i <= currentStep ? { scale: 1.1 } : {}}
              whileTap={i <= currentStep ? { scale: 0.95 } : {}}
              className={`relative flex items-center justify-center w-11 h-11 rounded-full text-lg transition-all duration-500 ${
                active
                  ? 'bg-gradient-to-br from-accent-green to-accent-blue shadow-glow text-navy-900 ring-4 ring-accent-green/20'
                  : done
                  ? 'bg-accent-green/20 text-accent-green cursor-pointer'
                  : 'bg-white/[0.04] text-gray-600 cursor-default'
              }`}
            >
              {done ? (
                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </motion.svg>
              ) : (
                s.icon
              )}
              {/* active ring pulse */}
              {active && (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-accent-green/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
            {/* connector */}
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-3 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-accent-green to-accent-blue"
                  initial={{ width: 0 }}
                  animate={{ width: done ? '100%' : '0%' }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── glowing input ───────────────────────────────────── */
function GlowInput({ label, unit, icon, ...props }) {
  return (
    <div className="relative group">
      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">{icon}</span>
        <input
          {...props}
          className="w-full pr-5 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-white text-lg placeholder-gray-600 outline-none transition-colors duration-300 input-glow focus:border-accent-green/40 focus:bg-white/[0.05]"
          style={{ paddingLeft: '3.5rem' }}
        />
        {unit && (
          <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-semibold tracking-wider uppercase">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── glowing select ──────────────────────────────────── */
function GlowSelect({ label, icon, options, ...props }) {
  return (
    <div className="relative group">
      <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-wide">{label}</label>
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">{icon}</span>
        <select
          {...props}
          className="w-full pr-12 py-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-white text-lg outline-none transition-colors duration-300 appearance-none cursor-pointer bg-transparent input-glow focus:border-accent-green/40 focus:bg-white/[0.05]"
          style={{ paddingLeft: '3.5rem' }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0a0a0a] text-white">
              {o.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

/* ─── diet card selector ──────────────────────────────── */
function DietCards({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {dietOptions.map((d) => {
        const selected = value === d.value;
        return (
          <motion.button
            key={d.value}
            type="button"
            onClick={() => onChange(d.value)}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`relative p-6 rounded-2xl text-left transition-all duration-500 overflow-hidden ${
              selected
                ? 'bg-accent-green/10 border-2 border-accent-green/40 shadow-[0_0_40px_rgba(212,160,23,0.12)]'
                : 'bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.04]'
            }`}
          >
            {selected && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-green/[0.08] to-transparent"
                layoutId="dietHighlight"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            <span className="relative z-10">
              <span className="text-3xl block mb-3">{d.emoji}</span>
              <span className={`text-base font-semibold block ${selected ? 'text-accent-green' : 'text-gray-300'}`}>
                {d.label}
              </span>
            </span>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── lifestyle/shopping card selector ─────────────────── */
function ShoppingCards({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      {shoppingOptions.map((d) => {
        const selected = value === d.value;
        return (
          <motion.button
            key={d.value}
            type="button"
            onClick={() => onChange(d.value)}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
            className={`relative p-6 rounded-2xl text-left transition-all duration-500 overflow-hidden ${
              selected
                ? 'bg-accent-green/10 border-2 border-accent-green/40 shadow-[0_0_40px_rgba(212,160,23,0.12)]'
                : 'bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.15] hover:bg-white/[0.04]'
            }`}
          >
            {selected && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-accent-green/[0.08] to-transparent"
                layoutId="shopHighlight"
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
            <span className="relative z-10">
              <span className="text-3xl block mb-3">{d.emoji}</span>
              <span className={`text-base font-semibold block ${selected ? 'text-accent-green' : 'text-gray-300'}`}>
                {d.label}
              </span>
            </span>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-accent-green/20 flex items-center justify-center"
              >
                <svg className="w-3.5 h-3.5 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─── slide variants ──────────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 200 : -200, opacity: 0 }),
};

/* ━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Calculator({ onCalculate, onBack, onDemo }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const [form, setForm] = useState({
    carMiles: '50',
    fuelType: 'gasoline',
    electricityKwh: '60',
    gasUsage: '2',
    shortFlights: '0',
    longFlights: '0',
    dietType: 'medium_meat',
    shoppingHabit: 'average',
    streamingHours: '10',
  });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const updateDiet = useCallback((val) => setForm((f) => ({ ...f, dietType: val })), []);
  const updateShopping = useCallback((val) => setForm((f) => ({ ...f, shoppingHabit: val })), []);

  const nextStep = () => { setDir(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prevStep = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); };
  const goToStep = (i) => { setDir(i > step ? 1 : -1); setStep(i); };

  const handleSubmit = async () => {
    setLoading(true);
    await onCalculate(form);
    setLoading(false);
  };

  const isLast = step === STEPS.length - 1;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-28 pb-20 px-6 relative"
    >
      <FloatingShapes />

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to home
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full glass text-xs font-medium text-accent-green tracking-widest uppercase mb-8">
            <motion.span
              className="w-2 h-2 rounded-full bg-accent-green"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Carbon Calculator
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-semibold tracking-tight mb-5">
            Your past <span className="gradient-text italic">7 days</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto leading-relaxed">
            Walk through each category — pre-filled with typical values.
            Adjust what's different, then see your impact.
          </p>
        </motion.div>

        {/* Step indicators */}
        <StepIndicators currentStep={step} onGoToStep={goToStep} />

        {/* Progress bar */}
        <ProgressBar step={step} total={STEPS.length} />

        {/* ── Main floating card with animated gradient border ── */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl p-[1px] overflow-hidden animated-border-gradient"
        >
          <div className="rounded-3xl card-surface p-10 md:p-12 relative overflow-hidden">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-green/[0.03] via-transparent to-accent-blue/[0.03] pointer-events-none" />

            {/* Step title */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`title-${step}`}
                custom={dir}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 mb-10"
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{STEPS[step].icon}</span>
                  <div>
                    <h3 className="text-2xl font-semibold text-white font-serif">{STEPS[step].label}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{STEPS[step].desc}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-auto font-semibold bg-white/[0.04] px-3 py-1.5 rounded-full">
                    {step + 1} / {STEPS.length}
                  </span>
                </div>
                <div className="h-[1px] bg-gradient-to-r from-accent-green/20 via-accent-blue/10 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Step content with horizontal slide */}
            <div className="relative z-10 min-h-[220px]">
              <AnimatePresence mode="wait" custom={dir}>
                {step === 0 && (
                  <motion.div
                    key="transport"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <GlowInput
                      label="Miles driven this week"
                      icon="🛣️"
                      unit="mi"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.carMiles}
                      onChange={update('carMiles')}
                    />
                    <GlowSelect
                      label="Vehicle fuel type"
                      icon="⛽"
                      options={fuelOptions}
                      value={form.fuelType}
                      onChange={update('fuelType')}
                    />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="energy"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <GlowInput
                      label="Electricity used"
                      icon="💡"
                      unit="kWh"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.electricityKwh}
                      onChange={update('electricityKwh')}
                    />
                    <GlowInput
                      label="Natural gas used"
                      icon="🔥"
                      unit="therms"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="0"
                      value={form.gasUsage}
                      onChange={update('gasUsage')}
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="flights"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <GlowInput
                      label="Short-haul flights (< 3 hrs)"
                      icon="🛫"
                      unit="flights"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.shortFlights}
                      onChange={update('shortFlights')}
                    />
                    <GlowInput
                      label="Long-haul flights (3+ hrs)"
                      icon="🌍"
                      unit="flights"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.longFlights}
                      onChange={update('longFlights')}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="diet"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="text-sm text-gray-400 mb-5">What best describes your diet this week?</p>
                    <DietCards value={form.dietType} onChange={updateDiet} />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="lifestyle"
                    custom={dir}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <p className="text-sm text-gray-400 mb-5">How would you describe your shopping habits?</p>
                      <ShoppingCards value={form.shoppingHabit} onChange={updateShopping} />
                    </div>
                    <GlowInput
                      label="Hours of streaming per week"
                      icon="📺"
                      unit="hrs"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.streamingHours}
                      onChange={update('streamingHours')}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="relative z-10 flex items-center justify-between mt-12 pt-8 border-t border-white/[0.06]">
              <motion.button
                type="button"
                onClick={prevStep}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  step === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Previous
              </motion.button>

              {isLast ? (
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 50px rgba(212,160,23,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  className="relative btn-glow btn-lift px-10 py-4 rounded-full bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-bold text-base tracking-wide shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 overflow-hidden"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="inline-block w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full"
                      />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      Calculate My Footprint
                      <motion.svg
                        className="w-4 h-4"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </motion.svg>
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,160,23,0.15)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-lift flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-bold text-sm shadow-glow"
                >
                  Continue
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Demo button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-8"
        >
          <motion.button
            type="button"
            onClick={onDemo}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 font-medium text-sm hover:text-white/80 hover:border-white/[0.12] transition-all duration-500"
          >
            Try Demo Account
          </motion.button>
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-gray-600 mt-6"
        >
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500 text-[10px] font-mono">Tab</kbd> to move between fields
        </motion.p>
      </div>
    </motion.section>
  );
}
