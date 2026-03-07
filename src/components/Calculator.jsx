import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── step config ─────────────────────────────────────── */
const STEPS = [
  { id: 'transport',  label: 'Transport',  icon: '🚗', desc: 'How you get around' },
  { id: 'energy',     label: 'Energy',     icon: '⚡', desc: 'Home energy use' },
  { id: 'flights',    label: 'Flights',    icon: '✈️', desc: 'Air travel this week' },
  { id: 'diet',       label: 'Food',       icon: '🥗', desc: 'What fuels you' },
  { id: 'lifestyle',  label: 'Lifestyle',  icon: '🛍️', desc: 'Shopping & streaming' },
];

const fuelOptions = [
  { value: 'gasoline', label: 'Gasoline', emoji: '⛽' },
  { value: 'diesel',   label: 'Diesel',   emoji: '🛢️' },
  { value: 'hybrid',   label: 'Hybrid',   emoji: '🔋' },
  { value: 'electric', label: 'Electric',  emoji: '⚡' },
];

const dietOptions = [
  { value: 'heavy_meat',  label: 'Heavy meat',  emoji: '🥩' },
  { value: 'medium_meat', label: 'Some meat',   emoji: '🍗' },
  { value: 'vegetarian',  label: 'Vegetarian',  emoji: '🥬' },
  { value: 'vegan',       label: 'Vegan',       emoji: '🌱' },
];

const shoppingOptions = [
  { value: 'minimal',  label: 'Minimal',   emoji: '🧘' },
  { value: 'average',  label: 'Average',   emoji: '🛒' },
  { value: 'frequent', label: 'Frequent',  emoji: '🛍️' },
  { value: 'heavy',    label: 'Heavy',     emoji: '📦' },
];

/* ─── progress bar ────────────────────────────────────── */
function ProgressBar({ step, total }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="relative h-1 rounded-full bg-white/[0.04] overflow-hidden mb-10">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842]"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}

/* ─── step indicators ─────────────────────────────────── */
function StepIndicators({ currentStep, onGoToStep }) {
  return (
    <div className="flex items-center justify-between mb-10 px-1">
      {STEPS.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const clickable = i <= currentStep;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => clickable && onGoToStep(i)}
              className={`relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full text-sm md:text-base transition-all duration-300 ${
                active
                  ? 'bg-[#d4a017] text-black shadow-[0_0_12px_rgba(212,160,23,0.2)]'
                  : done
                  ? 'bg-[#d4a017]/15 text-[#d4a017] cursor-pointer'
                  : 'bg-white/[0.03] text-gray-600 cursor-default'
              }`}
            >
              {done ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <span className="text-xs font-medium">{s.icon}</span>
              )}
            </button>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#d4a017]/40"
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

/* ─── slider input (low-effort) ───────────────────────── */
function SliderInput({ label, icon, unit, hint, min = 0, max, step = 1, value, onChange }) {
  const numVal = Number(value) || 0;
  const pct = Math.min(((numVal - min) / (max - min)) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400 flex items-center gap-2">
          <span>{icon}</span> {label}
        </label>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold text-white tabular-nums">{numVal}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numVal}
          onChange={(e) => onChange(e.target.value)}
          className="sim-slider w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #d4a017 0%, #f5c842 ${pct}%, rgba(255,255,255,0.04) ${pct}%)`,
          }}
        />
      </div>
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
    </div>
  );
}

/* ─── card selector (reusable) ────────────────────────── */
function CardSelector({ options, value, onChange, layoutId }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => {
        const selected = value === o.value;
        return (
          <motion.button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-xl text-left transition-all duration-300 ${
              selected
                ? 'bg-[#d4a017]/10 border border-[#d4a017]/30'
                : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <span className="text-2xl block mb-1.5">{o.emoji}</span>
            <span className={`text-sm font-medium ${selected ? 'text-[#f5c842]' : 'text-gray-400'}`}>
              {o.label}
            </span>
            {selected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#d4a017]/20 flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-[#f5c842]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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

/* ─── select dropdown (clean) ─────────────────────────── */
function CleanSelect({ label, icon, options, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-400 flex items-center gap-2">
        <span>{icon}</span> {label}
      </label>
      <div className="relative input-gold-underline">
        <select
          {...props}
          className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm outline-none appearance-none cursor-pointer transition-all duration-200 focus:border-[#d4a017]/40"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0a0a0a] text-white">
              {o.emoji ? `${o.emoji}  ${o.label}` : o.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}

/* ─── animation variants ──────────────────────────────── */
const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 120 : -120, opacity: 0 }),
};

/* ━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Calculator({ onCalculate, onBack, onDemo }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);

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

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: typeof val === 'object' ? val.target.value : val }));
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
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20 px-6 relative"
    >
      <div className="max-w-xl mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-10 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-3">
            Your past <span className="gradient-text">7 days</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-md leading-relaxed">
            Pre-filled with typical values. Slide to adjust, then calculate.
          </p>
        </motion.div>

        {/* Step indicators */}
        <StepIndicators currentStep={step} onGoToStep={goToStep} />

        {/* Progress bar */}
        <ProgressBar step={step} total={STEPS.length} />

        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.4)] card-corner-draw card-gold-glow"
        >
          {/* Step title */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`title-${step}`}
              custom={dir}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{STEPS[step].icon}</span>
                  <h3 className="text-lg font-semibold text-white">{STEPS[step].label}</h3>
                </div>
                <span className="text-[11px] text-gray-600 font-medium">
                  {step + 1}/{STEPS.length}
                </span>
              </div>
              <p className="text-xs text-gray-500 ml-9">{STEPS[step].desc}</p>
            </motion.div>
          </AnimatePresence>

          {/* Step content */}
          <div className="min-h-[200px]">
            <AnimatePresence mode="wait" custom={dir}>
              {step === 0 && (
                <motion.div key="transport" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
                  <SliderInput
                    label="Miles driven"
                    icon="🛣️"
                    unit="mi"
                    min={0} max={500} step={5}
                    hint="US avg ~100 mi/week"
                    value={form.carMiles}
                    onChange={set('carMiles')}
                  />
                  <CleanSelect
                    label="Fuel type"
                    icon="⛽"
                    options={fuelOptions}
                    value={form.fuelType}
                    onChange={set('fuelType')}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="energy" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
                  <SliderInput
                    label="Electricity"
                    icon="💡"
                    unit="kWh"
                    min={0} max={500} step={5}
                    hint="US avg ~200 kWh/week"
                    value={form.electricityKwh}
                    onChange={set('electricityKwh')}
                  />
                  <SliderInput
                    label="Natural gas"
                    icon="🔥"
                    unit="therms"
                    min={0} max={20} step={0.5}
                    hint="US avg ~3 therms/week"
                    value={form.gasUsage}
                    onChange={set('gasUsage')}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="flights" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
                  <SliderInput
                    label="Short-haul flights (< 3 hrs)"
                    icon="🛫"
                    unit="flights"
                    min={0} max={8} step={1}
                    hint="~244 kg CO₂ each"
                    value={form.shortFlights}
                    onChange={set('shortFlights')}
                  />
                  <SliderInput
                    label="Long-haul flights (3+ hrs)"
                    icon="🌍"
                    unit="flights"
                    min={0} max={6} step={1}
                    hint="~1,020 kg CO₂ each"
                    value={form.longFlights}
                    onChange={set('longFlights')}
                  />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="diet" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                  <p className="text-xs text-gray-500 mb-4">Pick what best describes your diet this week.</p>
                  <CardSelector options={dietOptions} value={form.dietType} onChange={updateDiet} layoutId="diet" />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="lifestyle" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-4">Your shopping habits this week.</p>
                    <CardSelector options={shoppingOptions} value={form.shoppingHabit} onChange={updateShopping} layoutId="shop" />
                  </div>
                  <SliderInput
                    label="Streaming"
                    icon="📺"
                    unit="hrs"
                    min={0} max={60} step={1}
                    hint="Netflix, YouTube, etc."
                    value={form.streamingHours}
                    onChange={set('streamingHours')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/[0.04]">
            <button
              type="button"
              onClick={prevStep}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                step === 0 ? 'opacity-0 pointer-events-none' : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>

            {isLast ? (
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm shadow-[0_2px_16px_rgba(212,160,23,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2.5 btn-gold-line btn-shimmer btn-premium"
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-black/20 border-t-black rounded-full"
                    />
                    Analyzing…
                  </>
                ) : (
                  <>
                    Calculate
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={nextStep}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold text-sm shadow-[0_2px_12px_rgba(212,160,23,0.15)] btn-gold-line btn-shimmer btn-premium"
              >
                Continue
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Demo */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center mt-8">
          <button
            type="button"
            onClick={onDemo}
            className="text-sm text-gray-600 hover:text-gray-400 transition-colors duration-200 underline underline-offset-4 decoration-gray-800 hover:decoration-gray-600"
          >
            Skip — use demo data instead
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
