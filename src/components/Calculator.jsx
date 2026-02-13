import { useState } from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const fuelOptions = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
];

const dietOptions = [
  { value: 'heavy_meat', label: 'Heavy meat eater' },
  { value: 'medium_meat', label: 'Average (some meat)' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
];

function InputField({ label, unit, icon, ...props }) {
  return (
    <motion.div variants={itemVariants} className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{icon}</span>
        <input
          {...props}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-accent-green/40 transition-all duration-300 text-base"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
            {unit}
          </span>
        )}
      </div>
    </motion.div>
  );
}

function SelectField({ label, icon, options, ...props }) {
  return (
    <motion.div variants={itemVariants} className="relative">
      <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">{icon}</span>
        <select
          {...props}
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass text-white outline-none focus:ring-2 focus:ring-accent-green/40 transition-all duration-300 text-base appearance-none cursor-pointer bg-transparent"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-navy-800 text-white">
              {o.label}
            </option>
          ))}
        </select>
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Calculator({ onCalculate, onBack, onDemo }) {
  const [form, setForm] = useState({
    carMiles: '',
    fuelType: 'gasoline',
    electricityKwh: '',
    gasUsage: '',
    shortFlights: '',
    longFlights: '',
    dietType: 'medium_meat',
  });

  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onCalculate(form);
    setLoading(false);
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20 px-6"
    >
      <div className="max-w-2xl mx-auto">
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
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-accent-green tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            Carbon Calculator
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Your past <span className="gradient-text">7 days</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Enter your activity for the last week. We'll calculate your carbon
            footprint and give you personalized tips.
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Transport section */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">🚗</span> Transportation
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Miles driven this week"
                icon="🛣️"
                unit="mi"
                type="number"
                min="0"
                placeholder="0"
                value={form.carMiles}
                onChange={update('carMiles')}
              />
              <SelectField
                label="Vehicle fuel type"
                icon="⛽"
                options={fuelOptions}
                value={form.fuelType}
                onChange={update('fuelType')}
              />
            </div>
          </motion.div>

          {/* Energy section */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">⚡</span> Home Energy
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Electricity used"
                icon="💡"
                unit="kWh"
                type="number"
                min="0"
                placeholder="0"
                value={form.electricityKwh}
                onChange={update('electricityKwh')}
              />
              <InputField
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
            </div>
          </motion.div>

          {/* Flights section */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 md:p-8 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <span className="text-xl">✈️</span> Air Travel
            </h3>
            <div className="grid sm:grid-cols-2 gap-5">
              <InputField
                label="Short-haul flights"
                icon="🛫"
                unit="flights"
                type="number"
                min="0"
                placeholder="0"
                value={form.shortFlights}
                onChange={update('shortFlights')}
              />
              <InputField
                label="Long-haul flights"
                icon="🌍"
                unit="flights"
                type="number"
                min="0"
                placeholder="0"
                value={form.longFlights}
                onChange={update('longFlights')}
              />
            </div>
          </motion.div>

          {/* Diet section */}
          <motion.div variants={itemVariants} className="glass rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-5">
              <span className="text-xl">🥗</span> Diet
            </h3>
            <SelectField
              label="What best describes your diet this week?"
              icon="🍽️"
              options={dietOptions}
              value={form.dietType}
              onChange={update('dietType')}
            />
          </motion.div>

          {/* Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,232,143,0.25)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto btn-glow px-10 py-4 rounded-2xl bg-gradient-to-r from-accent-green to-accent-blue text-navy-900 font-semibold text-base tracking-wide shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block w-5 h-5 border-2 border-navy-900/30 border-t-navy-900 rounded-full"
                  />
                  Calculating…
                </>
              ) : (
                'Calculate My Footprint'
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onDemo}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl glass text-white/70 font-medium text-base hover:text-white transition-all duration-300"
            >
              Try Demo Account
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.section>
  );
}
