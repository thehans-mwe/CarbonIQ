/**
 * Offline fallback carbon calculations.
 * Uses EPA 2025, eGRID 2023, DEFRA 2025, IPCC AR5, DOE & IEA emission factors.
 * All results in kg CO₂e (carbon-dioxide equivalent).
 *
 * Sources (verified March 2026):
 *  - EPA "Greenhouse Gas Emissions from a Typical Passenger Vehicle" (Jun 2025)
 *  - EPA eGRID2022 US national total output rate (823.1 lb CO₂/MWh) — Jan 2024
 *  - EPA GHG Emission Factors Hub 2025 (Jan 2025)
 *  - EPA Equivalencies Calculator — vehicle: 22.8 mpg, 8,887 g CO₂/gal; EV: 3.60 mi/kWh (DOE 2023)
 *  - DEFRA 2025 GHG Conversion Factors (Jun 2025)
 *  - Scarborough et al. 2023 (Nature Food) — diet factors
 *  - IEA 2024 — streaming/data-centre energy
 */

// ── Emission factors (defaults) ──────────────────────────
import { getCountryFactors } from './countries';

const DEFAULT_FACTORS = {
  car: {
    gasoline: 0.400,
    diesel: 0.364,
    hybrid: 0.195,
    electric: 0.104,
  },
  electricity: 0.373,
  naturalGas: 5.29,
  flight: {
    shortHaul: 255,
    longHaul: 1102,
  },
  diet: {
    heavy_meat: 7.19,
    medium_meat: 5.63,
    vegetarian: 3.81,
    vegan: 2.89,
  },
  shopping: {
    minimal: 2.5,
    average: 9.0,
    frequent: 19.5,
    heavy: 34.0,
  },
  streaming: 0.036,
};

// Re-exported for components that need to present consistent “what-if” / previews.
export const EMISSION_FACTORS = FACTORS;

// US per-capita weekly benchmarks (for green-score grading)
const GLOBAL_DEFAULT_BENCHMARKS = {
  transport: 77,
  energy: 51,
  flight: 10,
  diet: 39.4,
  lifestyle: 13,
};

function sumBenchmarks(b) {
  return (b.transport || 0) + (b.energy || 0) + (b.flight || 0) + (b.diet || 0) + (b.lifestyle || 0);
}

// ── Calculator ────────────────────────────────────────────
export function calculateOffline(inputs) {
  const {
    carMiles = 0,
    fuelType = 'gasoline',
    electricityKwh = 0,
    gasUsage = 0,
    shortFlights = 0,
    longFlights = 0,
    dietType = 'medium_meat',
    shoppingHabit = 'average',
    streamingHours = 0,
    country = 'us',
  } = inputs;
  // Merge country-specific overrides
  const cFactors = getCountryFactors(country || 'us');
  const FACTORS = {
    ...DEFAULT_FACTORS,
    electricity: cFactors.electricity || DEFAULT_FACTORS.electricity,
    car: {
      ...DEFAULT_FACTORS.car,
      gasoline: cFactors.car?.gasoline || DEFAULT_FACTORS.car.gasoline,
      electric: cFactors.car?.electric || DEFAULT_FACTORS.car.electric,
    },
  };

  const transportKg = Number(carMiles) * (FACTORS.car[fuelType] || FACTORS.car.gasoline);
  const energyKg = Number(electricityKwh) * FACTORS.electricity + Number(gasUsage) * FACTORS.naturalGas;
  const flightKg =
    Number(shortFlights) * FACTORS.flight.shortHaul +
    Number(longFlights) * FACTORS.flight.longHaul;
  const dietKg = (FACTORS.diet[dietType] || FACTORS.diet.medium_meat) * 7; // 7 days
  const lifestyleKg =
    (FACTORS.shopping[shoppingHabit] || FACTORS.shopping.average) +
    Number(streamingHours) * FACTORS.streaming;

  const totalKg = Math.round((transportKg + energyKg + flightKg + dietKg + lifestyleKg) * 100) / 100;

  // EPA: urban tree sequesters ~60 kg CO₂/year (0.060 MT) → ~1.15 kg/week
  const treesEquivalent = Math.round(totalKg / 1.15);

  // Benchmarks for comparison
  const benchmarks = inputs && inputs.country ? getCountryFactors(inputs.country).benchmarks || GLOBAL_DEFAULT_BENCHMARKS : GLOBAL_DEFAULT_BENCHMARKS;

  return {
    totalKg,
    transportKg: Math.round(transportKg * 100) / 100,
    energyKg: Math.round(energyKg * 100) / 100,
    flightKg: Math.round(flightKg * 100) / 100,
    dietKg: Math.round(dietKg * 100) / 100,
    lifestyleKg: Math.round(lifestyleKg * 100) / 100,
    treesEquivalent,
    source: 'offline',
    benchmarks,
  };
}

// Export core/default emission factors for use by other components (simulator, UI)
export const EMISSION_FACTORS = DEFAULT_FACTORS;

// ── Offline AI recommendations fallback ──────────────────
export function offlineRecommendations(carbonData) {
  const recs = [];

  // Category-specific advice with accurate thresholds
  if (carbonData.transportKg > 25) {
    recs.push({
      title: 'Reduce driving',
      description: 'Consider carpooling, biking, or public transit for short trips to cut transport emissions significantly.',
      impact: 'high',
      savingsKg: Math.round(carbonData.transportKg * 0.3),
    });
  }
  if (carbonData.transportKg > 0 && carbonData.transportKg <= 25) {
    recs.push({
      title: 'Keep up efficient transport',
      description: 'Your driving footprint is low — maintaining this or switching to an EV could reduce it further.',
      impact: 'low',
      savingsKg: Math.round(carbonData.transportKg * 0.15),
    });
  }

  if (carbonData.energyKg > 40) {
    recs.push({
      title: 'Optimize energy use',
      description: 'Switch to LED bulbs, unplug idle devices, and set your thermostat 2°F lower to save energy and emissions.',
      impact: 'medium',
      savingsKg: Math.round(carbonData.energyKg * 0.15),
    });
  }

  if (carbonData.flightKg > 0) {
    recs.push({
      title: 'Offset your flights',
      description: 'Purchase verified carbon offsets or consider train travel for distances under 500 miles.',
      impact: 'high',
      savingsKg: Math.round(carbonData.flightKg * 0.5),
    });
  }

  if (carbonData.dietKg > 35) {
    recs.push({
      title: 'Try plant-forward meals',
      description: 'Replacing 3 meat meals per week with plant-based options can cut dietary emissions by 25%.',
      impact: 'medium',
      savingsKg: Math.round(carbonData.dietKg * 0.25),
    });
  }

  if ((carbonData.lifestyleKg || 0) > 15) {
    recs.push({
      title: 'Shop more consciously',
      description: 'Buy second-hand, reduce impulse purchases, and consolidate online orders to cut shipping emissions.',
      impact: 'medium',
      savingsKg: Math.round((carbonData.lifestyleKg || 0) * 0.3),
    });
  }

  recs.push({
    title: 'Track consistently',
    description: 'Logging your activity weekly helps identify patterns and keeps you accountable for reduction goals.',
    impact: 'low',
    savingsKg: 0,
  });

  // ── Green Score (0-100) ────────────────────────────────
  // Weighted category scoring against US benchmarks
  const catScores = {
    transport: Math.max(0, Math.min(100, Math.round((1 - carbonData.transportKg / (BENCHMARKS.transport * 2)) * 100))),
    energy:    Math.max(0, Math.min(100, Math.round((1 - carbonData.energyKg    / (BENCHMARKS.energy * 2))    * 100))),
    flight:    Math.max(0, Math.min(100, Math.round((1 - carbonData.flightKg    / (BENCHMARKS.flight * 6))    * 100))),
    diet:      Math.max(0, Math.min(100, Math.round((1 - carbonData.dietKg      / (BENCHMARKS.diet * 2))      * 100))),
    lifestyle: Math.max(0, Math.min(100, Math.round((1 - (carbonData.lifestyleKg || 0) / (BENCHMARKS.lifestyle * 2)) * 100))),
  };
  const weights = { transport: 0.25, energy: 0.25, flight: 0.15, diet: 0.2, lifestyle: 0.15 };
  const score = Math.max(0, Math.min(100, Math.round(
    catScores.transport * weights.transport +
    catScores.energy    * weights.energy +
    catScores.flight    * weights.flight +
    catScores.diet      * weights.diet +
    catScores.lifestyle * weights.lifestyle
  )));

  return {
    score,
    summary: carbonData.totalKg < WEEKLY_AVG
      ? `Your weekly footprint of ${carbonData.totalKg} kg CO₂ is below the US average of ~${WEEKLY_AVG} kg — great work!`
      : `Your weekly footprint of ${carbonData.totalKg} kg CO₂ is above the US average of ~${WEEKLY_AVG} kg. Small changes can make a big difference.`,
    recommendations: recs.slice(0, 5),
    weeklyTarget: Math.round(carbonData.totalKg * 0.85),
    comparedToAverage: carbonData.totalKg < WEEKLY_AVG
      ? `${Math.round(((WEEKLY_AVG - carbonData.totalKg) / WEEKLY_AVG) * 100)}% below US average`
      : `${Math.round(((carbonData.totalKg - WEEKLY_AVG) / WEEKLY_AVG) * 100)}% above US average`,
    source: 'offline',
  };
}
