import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/* ── Emission factors (from offlineCalc.js) ──────────── */
const FACTORS = {
  car: { gasoline: 0.404, diesel: 0.367, hybrid: 0.213, electric: 0.092 },
  electricity: 0.386,
  naturalGas: 5.31,
  diet: { heavy_meat: 7.19, medium_meat: 5.63, vegetarian: 3.81, vegan: 2.89 },
};

/* ── Slider component ────────────────────────────────── */
function SimSlider({ label, icon, value, onChange, min, max, step, unit, savings }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-white/80">{label}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white">{value}{unit}</span>
          {savings > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full"
            >
              −{savings.toFixed(1)} kg
            </motion.span>
          )}
        </div>
      </div>
      <div className="relative">
        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden pointer-events-none">
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${pct}%`,
              background: savings > 0
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #d4a017, #f5c842)',
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full cursor-pointer sim-slider"
        />
      </div>
    </div>
  );
}

/* ━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function WhatIfSimulator({ carbonData, inputs }) {
  const original = carbonData.totalKg;

  // Derive initial values from actual inputs
  const initBikeDays = 0;
  const initTransitDays = 0;
  const initDiet = inputs?.dietType || 'medium_meat';
  const initElecReduction = 0;

  const [bikeDays, setBikeDays] = useState(initBikeDays);
  const [transitDays, setTransitDays] = useState(initTransitDays);
  const [dietSwitch, setDietSwitch] = useState(initDiet);
  const [elecReduction, setElecReduction] = useState(initElecReduction);

  // Calculate savings
  const { newTotal, savings, transportSaved, energySaved, dietSaved } = useMemo(() => {
    const fuelType = inputs?.fuelType || 'gasoline';
    const dailyMiles = (Number(inputs?.carMiles) || 0) / 7;
    const factor = FACTORS.car[fuelType] || FACTORS.car.gasoline;

    // Transport: biking/transit replaces car days
    const daysReplaced = Math.min(bikeDays + transitDays, 7);
    const transportSaved = dailyMiles * factor * daysReplaced * (bikeDays > 0 ? 1 : 0.7); // transit still has some emissions

    // Energy: % reduction in electricity
    const elecKwh = Number(inputs?.electricityKwh) || 0;
    const energySaved = (elecReduction / 100) * elecKwh * FACTORS.electricity;

    // Diet: switching to a lighter diet
    const currentDietDaily = FACTORS.diet[initDiet] || FACTORS.diet.medium_meat;
    const newDietDaily = FACTORS.diet[dietSwitch] || currentDietDaily;
    const dietSaved = Math.max(0, (currentDietDaily - newDietDaily) * 7);

    const totalSaved = transportSaved + energySaved + dietSaved;
    const newTotal = Math.max(0, original - totalSaved);

    return { newTotal, savings: totalSaved, transportSaved, energySaved, dietSaved };
  }, [bikeDays, transitDays, dietSwitch, elecReduction, inputs, original, initDiet]);

  const savingsPct = original > 0 ? Math.round((savings / original) * 100) : 0;

  const dietOptions = [
    { value: 'heavy_meat', label: 'Heavy meat', emoji: '🥩' },
    { value: 'medium_meat', label: 'Some meat', emoji: '🍗' },
    { value: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl bg-[#060606]/80 border border-white/[0.06] backdrop-blur-xl p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🔮</span>
        <h3 className="text-xl font-semibold text-white font-serif">What If Simulator</h3>
      </div>
      <p className="text-sm text-white/50 mb-6">Drag the sliders to see how small changes reduce your footprint in real time.</p>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Sliders */}
        <div className="lg:col-span-3 space-y-6">
          <SimSlider
            label="Bike to work instead of driving"
            icon="🚲"
            value={bikeDays}
            onChange={setBikeDays}
            min={0} max={7} step={1}
            unit=" days/wk"
            savings={transportSaved * (bikeDays > 0 ? 1 : 0)}
          />

          <SimSlider
            label="Use public transport"
            icon="🚌"
            value={transitDays}
            onChange={setTransitDays}
            min={0} max={7} step={1}
            unit=" days/wk"
            savings={transitDays > 0 ? transportSaved * 0.3 : 0}
          />

          <SimSlider
            label="Reduce electricity usage"
            icon="💡"
            value={elecReduction}
            onChange={setElecReduction}
            min={0} max={50} step={5}
            unit="%"
            savings={energySaved}
          />

          {/* Diet selector */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🥗</span>
              <span className="text-sm font-medium text-white/80">Switch diet to</span>
              {dietSaved > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full ml-auto"
                >
                  −{dietSaved.toFixed(1)} kg
                </motion.span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {dietOptions.map((d) => {
                const isActive = dietSwitch === d.value;
                const isCurrent = initDiet === d.value;
                return (
                  <button
                    key={d.value}
                    onClick={() => setDietSwitch(d.value)}
                    className={`p-3 rounded-xl text-center transition-all duration-300 ${
                      isActive
                        ? 'bg-accent-green/15 border-2 border-accent-green/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]'
                        : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    <span className="text-xl block">{d.emoji}</span>
                    <span className={`text-[11px] font-medium block mt-1 ${isActive ? 'text-accent-green' : 'text-gray-400'}`}>
                      {d.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] text-white/30 block">current</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Live results panel */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <div className="relative w-full rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 text-center">
            {/* Animated result */}
            <motion.div
              key={newTotal.toFixed(1)}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {savings > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3"
                >
                  <span className="text-xs font-medium text-white/40 line-through">{original.toFixed(1)} kg</span>
                </motion.div>
              )}

              <div className="text-4xl font-serif font-bold text-white mb-1">
                {newTotal.toFixed(1)}
                <span className="text-lg text-[#f5c842] font-medium ml-1">kg CO₂</span>
              </div>

              {savings > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 mt-3">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                    </svg>
                    <span className="text-sm font-bold text-emerald-400">
                      −{savings.toFixed(1)} kg ({savingsPct}% reduction)
                    </span>
                  </div>

                  {/* Equivalence */}
                  <div className="mt-4 space-y-1.5 text-left">
                    <p className="text-xs text-white/40 flex items-center gap-2">
                      <span>🌳</span>
                      <span>That saves <span className="text-emerald-400 font-semibold">{Math.round(savings / 0.42)}</span> fewer trees needed</span>
                    </p>
                    <p className="text-xs text-white/40 flex items-center gap-2">
                      <span>🚗</span>
                      <span>Like removing <span className="text-emerald-400 font-semibold">{Math.round(savings / 0.404 * 1.609)}</span> km of driving</span>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <p className="text-sm text-white/40 mt-2">
                  Adjust the sliders to explore reductions
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
