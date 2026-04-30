import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateOffline } from '../services/offlineCalc';

const STEPS = [
  { id: 'transport', label: 'Transport', icon: '🚗', desc: 'How you get around' },
  { id: 'energy', label: 'Energy', icon: '⚡', desc: 'Home energy use' },
  { id: 'flights', label: 'Flights', icon: '✈️', desc: 'Air travel this week' },
  { id: 'diet', label: 'Food', icon: '🥗', desc: 'What fuels you' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '🛍️', desc: 'Shopping & streaming' },
];

const fuelOptions = [
  { value: 'gasoline', label: 'Gasoline', emoji: '⛽' },
  { value: 'diesel', label: 'Diesel', emoji: '🛢️' },
  { value: 'hybrid', label: 'Hybrid', emoji: '🔋' },
  { value: 'electric', label: 'Electric', emoji: '⚡' },
];

const dietOptions = [
  { value: 'heavy_meat', label: 'Heavy meat', emoji: '🥩' },
  { value: 'medium_meat', label: 'Some meat', emoji: '🍗' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
];

const shoppingOptions = [
  { value: 'minimal', label: 'Minimal', emoji: '🧘' },
  { value: 'average', label: 'Average', emoji: '🛒' },
  { value: 'frequent', label: 'Frequent', emoji: '🛍️' },
  { value: 'heavy', label: 'Heavy', emoji: '📦' },
];

const countryOptions = [
  { value: 'us', label: 'United States', emoji: '🇺🇸' },
  { value: 'uk', label: 'United Kingdom', emoji: '🇬🇧' },
  { value: 'de', label: 'Germany', emoji: '🇩🇪' },
  { value: 'au', label: 'Australia', emoji: '🇦🇺' },
  { value: 'cn', label: 'China', emoji: '🇨🇳' },
  { value: 'in', label: 'India', emoji: '🇮🇳' },
];

function ProgressBar({ step, total }) {
  const pct = ((step + 1) / total) * 100;
  return (
    <div className="relative h-1 rounded-full bg-white/[0.04] overflow-hidden mb-6">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842]"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.45 }}
      />
    </div>
  );
}

function StepIndicators({ currentStep, onGoToStep }) {
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      {STEPS.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const clickable = i <= currentStep;
        return (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => clickable && onGoToStep(i)}
              className={`relative flex items-center justify-center w-8 h-8 rounded-full text-sm transition-all duration-200 ${
                active ? 'bg-[#d4a017] text-black' : done ? 'bg-[#d4a017]/15 text-[#d4a017]' : 'bg-white/[0.03] text-gray-600'
              }`}
            >
              {done ? (
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                <span className="text-xs">{s.icon}</span>
              )}
            </button>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-2 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div className="h-full bg-[#d4a017]/40" initial={{ width: 0 }} animate={{ width: done ? '100%' : '0%' }} transition={{ duration: 0.45 }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SliderInput({ label, icon, unit, min = 0, max = 100, step = 1, value, onChange, hint }) {
  const numVal = Number(value) || 0;
  const pct = Math.min(((numVal - min) / (max - min)) * 100, 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-400 flex items-center gap-2"><span>{icon}</span> {label}</label>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-white tabular-nums">{numVal}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={numVal}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer sim-slider"
        style={{ background: `linear-gradient(to right, #d4a017 0%, #f5c842 ${pct}%, rgba(255,255,255,0.04) ${pct}%)` }}
      />
      {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
    </div>
  );
}

function CardSelector({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`p-4 rounded-xl text-left transition-all duration-200 ${value === o.value ? 'bg-[#d4a017]/10 border border-[#d4a017]/30' : 'bg-white/[0.02] border border-white/[0.06]'}`}
        >
          <div className="text-2xl mb-1.5">{o.emoji}</div>
          <div className={`text-sm font-medium ${value === o.value ? 'text-[#f5c842]' : 'text-gray-400'}`}>{o.label}</div>
        </button>
      ))}
    </div>
  );
}

function CleanSelect({ label, icon, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="text-sm text-gray-400 flex items-center gap-2"><span>{icon}</span> {label}</label>
      <button type="button" onClick={() => setOpen((p) => !p)} className="w-full px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left flex items-center justify-between">
        <div className="flex items-center gap-2.5">{current?.emoji && <span>{current.emoji}</span>}<span>{current?.label || 'Select'}</span></div>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="mt-2 rounded-xl border border-white/[0.08] bg-[#0c0c0c]/95 overflow-hidden z-50">
            {options.map((o) => (
              <li key={o.value}>
                <button type="button" onClick={() => { onChange({ target: { value: o.value } }); setOpen(false); }} className={`w-full px-4 py-3 text-sm text-left ${o.value === value ? 'bg-[#d4a017]/15 text-[#f5c842]' : 'text-gray-300 hover:bg-[#d4a017]/10 hover:text-white'}`}>
                  {o.emoji && <span className="mr-2">{o.emoji}</span>}{o.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 120 : -120, opacity: 0 }),
};

export default function Calculator({ onCalculate = async () => {}, onBack = () => {}, onDemo = () => {} }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    carMiles: '50',
    country: typeof window !== 'undefined' ? (localStorage.getItem('carboniq_country') || 'us') : 'us',
    fuelType: 'gasoline',
    electricityKwh: '60',
    gasUsage: '2',
    shortFlights: '0',
    longFlights: '0',
    dietType: 'medium_meat',
    shoppingHabit: 'average',
    streamingHours: '10',
  });

  useEffect(() => {
    try {
      const key = 'carboniq_country';
      const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
      if (!stored) {
        const lang = (navigator.language || navigator.userLanguage || 'en-US').toLowerCase();
        const map = { 'en-us': 'us', 'en-gb': 'uk', 'de': 'de', 'de-de': 'de', 'zh-cn': 'cn', 'zh': 'cn', 'en-au': 'au', 'en-in': 'in', 'hi-in': 'in' };
        let code = 'us';
        for (const k of Object.keys(map)) { if (lang.startsWith(k)) { code = map[k]; break; } }
        localStorage.setItem(key, code);
        setForm((f) => ({ ...f, country: code }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try { if (form?.country) localStorage.setItem('carboniq_country', form.country); } catch (e) {}
  }, [form.country]);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: typeof val === 'object' ? val.target.value : val }));
  const updateDiet = useCallback((v) => setForm((f) => ({ ...f, dietType: v })), []);
  const updateShopping = useCallback((v) => setForm((f) => ({ ...f, shoppingHabit: v })), []);

  const nextStep = () => { setDir(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prevStep = () => { setDir(-1); setStep((s) => Math.max(s - 1, 0)); };
  const goToStep = (i) => { setDir(i > step ? 1 : -1); setStep(i); };

  const handleSubmit = async () => {
    setLoading(true);
    await onCalculate(form);
    setLoading(false);
  };

  const isLast = step === STEPS.length - 1;
  const preview = useMemo(() => calculateOffline(form), [form]);

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="min-h-screen pt-24 pb-16 relative">
      <div className="section-shell">
        <div className="max-w-xl mx-auto">
          <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Back
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6">
            <h1 className="font-serif text-3xl font-semibold mb-2">Your past <span className="gradient-text">7 days</span></h1>
            <p className="text-sm text-gray-500">Pre-filled with typical values. Slide to adjust, then calculate.</p>
          </motion.div>

          <div className="max-w-xl mx-auto mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f5c842]">Choose your nation</p>
              <p className="text-xs text-gray-500 mt-1">This changes the comparison data and emission factors shown below.</p>
            </div>
            <CleanSelect label="Nation" icon="🌍" options={countryOptions} value={form.country} onChange={set('country')} />
          </div>

          <StepIndicators currentStep={step} onGoToStep={goToStep} />
          <ProgressBar step={step} total={STEPS.length} />

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-2xl p-6 panel-surface">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div key={`title-${step}`} custom={dir} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }} className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3"><span className="text-xl">{STEPS[step].icon}</span><h3 className="text-lg font-semibold">{STEPS[step].label}</h3></div>
                  <span className="text-xs text-gray-500">{step + 1}/{STEPS.length}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{STEPS[step].desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="min-h-[200px]">
              <AnimatePresence mode="wait" custom={dir}>
                {step === 0 && (
                  <motion.div key="transport" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                    <SliderInput label="Miles driven" icon="🛣️" unit="mi" min={0} max={500} step={5} value={form.carMiles} onChange={set('carMiles')} hint="US avg ~100 mi/week" />
                    <CleanSelect label="Fuel type" icon="⛽" options={fuelOptions} value={form.fuelType} onChange={set('fuelType')} />
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div key="energy" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                    <SliderInput label="Electricity" icon="💡" unit="kWh" min={0} max={500} step={5} value={form.electricityKwh} onChange={set('electricityKwh')} hint="kWh/week" />
                    <SliderInput label="Natural gas" icon="🔥" unit="therms" min={0} max={20} step={0.5} value={form.gasUsage} onChange={set('gasUsage')} hint="therms/week" />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="flights" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                    <SliderInput label="Short-haul flights (< 3 hrs)" icon="🛫" unit="flights" min={0} max={8} step={1} value={form.shortFlights} onChange={set('shortFlights')} />
                    <SliderInput label="Long-haul flights (3+ hrs)" icon="🌍" unit="flights" min={0} max={6} step={1} value={form.longFlights} onChange={set('longFlights')} />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="diet" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                    <p className="text-xs text-gray-500 mb-3">Pick what best describes your diet this week.</p>
                    <CardSelector options={dietOptions} value={form.dietType} onChange={updateDiet} />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="lifestyle" custom={dir} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-3">Your shopping habits this week.</p>
                      <CardSelector options={shoppingOptions} value={form.shoppingHabit} onChange={updateShopping} />
                    </div>
                    <SliderInput label="Streaming" icon="📺" unit="hrs" min={0} max={60} step={1} value={form.streamingHours} onChange={set('streamingHours')} hint="Netflix, YouTube, etc." />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-6 p-4 rounded-xl panel-surface-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.25em]">Live estimate</p>
                  <p className="text-xs text-white/50">Updates instantly as you adjust inputs.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-serif font-bold text-white tabular-nums">{preview.totalKg.toFixed(1)} <span className="text-sm text-[#f5c842]/80">kg CO₂</span></div>
                  <p className="text-[10px] text-white/30">Offline model preview</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {[
                  { k: 'transportKg', label: 'Transport', icon: '🚗', color: '#f5c842' },
                  { k: 'energyKg', label: 'Energy', icon: '⚡', color: '#d4a017' },
                  { k: 'flightKg', label: 'Flights', icon: '✈️', color: '#c49b12' },
                  { k: 'dietKg', label: 'Food', icon: '🥗', color: '#e6b830' },
                  { k: 'lifestyleKg', label: 'Lifestyle', icon: '🛍️', color: '#b8860b' },
                ].filter((x) => (preview[x.k] || 0) > 0).map((x) => (
                  <div key={x.k} className="flex items-center gap-2">
                    <span className="text-base" style={{ color: x.color }}>{x.icon}</span>
                    <span className="text-white/70">{x.label}:</span>
                    <span className="ml-auto text-white font-semibold tabular-nums">{preview[x.k].toFixed(1)} <span className="text-[10px] text-white/30">kg</span></span>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="flex items-center justify-between mt-6 pt-4 panel-divider">
              <button type="button" onClick={prevStep} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${step === 0 ? 'opacity-50 pointer-events-none' : 'text-gray-500 hover:text-white'}`}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                Back
              </button>

              {isLast ? (
                <motion.button type="button" onClick={handleSubmit} disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold">
                  {loading ? 'Analyzing…' : 'Calculate'}
                </motion.button>
              ) : (
                <motion.button type="button" onClick={nextStep} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-6 py-2 rounded-full bg-gradient-to-r from-[#d4a017] to-[#f5c842] text-black font-semibold">
                  Continue
                </motion.button>
              )}
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }} className="text-center mt-6">
              <button type="button" onClick={onDemo} className="text-sm text-gray-500 hover:text-white underline">Skip — use demo data instead</button>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
