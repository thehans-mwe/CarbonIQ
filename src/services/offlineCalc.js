/**
 * Offline fallback carbon calculations.
 * Uses EPA / DEFRA / IPCC emission factors so the app works
 * even when the Carbon Interface API is unreachable.
 *
 * All results in kg CO₂e (carbon-dioxide equivalent).
 */

// ── Emission factors (EPA 2024 / DEFRA 2024 / IPCC AR6) ──
const FACTORS = {
  car: {
    gasoline: 0.404,   // kg CO₂e per mile — EPA avg passenger vehicle
    diesel: 0.367,     // slightly lower CO₂ but higher NOx
    hybrid: 0.213,     // ~47% less than gasoline (EPA)
    electric: 0.092,   // US grid avg 0.386 kg/kWh × 0.3 kWh/mi (DOE)
  },
  electricity: 0.386,  // kg CO₂e per kWh — EPA eGRID US national avg 2024
  naturalGas: 5.31,    // kg CO₂e per therm — EPA GHG factors hub
  flight: {
    shortHaul: 244,    // kg CO₂e per pax short-haul (~500 mi) — DEFRA 2024 economy
    longHaul: 1020,    // kg CO₂e per pax long-haul (~3 500 mi) — DEFRA 2024 economy
  },
  diet: {
    heavy_meat: 7.19,  // kg CO₂e per day — Scarborough et al. 2023
    medium_meat: 5.63,
    vegetarian: 3.81,
    vegan: 2.89,
  },
  shopping: {
    minimal: 2.0,      // kg CO₂e per week — minimal consumer
    average: 8.5,      // kg CO₂e per week — avg consumer (clothes, goods, deliveries)
    frequent: 18.0,    // kg CO₂e per week — frequent online/retail shopper
    heavy: 32.0,       // kg CO₂e per week — heavy consumer
  },
  streaming: 0.036,    // kg CO₂e per hour — IEA 2023 data-center energy per stream-hour
};

// US per-capita weekly benchmarks (used for green-score grading)
const BENCHMARKS = {
  transport: 78,       // 193 mi/wk × 0.404 (avg American)
  energy: 55,          // ~100 kWh + ~2.5 therms
  flight: 10,          // annualised per-capita
  diet: 39.4,          // medium-meat × 7
  lifestyle: 12,       // avg shopping + streaming
};

const WEEKLY_AVG = BENCHMARKS.transport + BENCHMARKS.energy + BENCHMARKS.flight + BENCHMARKS.diet; // ~182

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
  } = inputs;

  const transportKg = Number(carMiles) * (FACTORS.car[fuelType] || FACTORS.car.gasoline);
  const energyKg =
    Number(electricityKwh) * FACTORS.electricity +
    Number(gasUsage) * FACTORS.naturalGas;
  const flightKg =
    Number(shortFlights) * FACTORS.flight.shortHaul +
    Number(longFlights) * FACTORS.flight.longHaul;
  const dietKg = (FACTORS.diet[dietType] || FACTORS.diet.medium_meat) * 7; // 7 days
  const lifestyleKg =
    (FACTORS.shopping[shoppingHabit] || FACTORS.shopping.average) +
    Number(streamingHours) * FACTORS.streaming;

  const totalKg = Math.round((transportKg + energyKg + flightKg + dietKg + lifestyleKg) * 100) / 100;

  // A mature tree absorbs ~22 kg CO₂/year → ~0.42 kg/week
  const treesEquivalent = Math.round(totalKg / 0.42);

  return {
    totalKg,
    transportKg: Math.round(transportKg * 100) / 100,
    energyKg: Math.round(energyKg * 100) / 100,
    flightKg: Math.round(flightKg * 100) / 100,
    dietKg: Math.round(dietKg * 100) / 100,
    lifestyleKg: Math.round(lifestyleKg * 100) / 100,
    treesEquivalent,
    source: 'offline',
  };
}

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
