/**
 * Offline fallback carbon calculations.
 * Uses EPA / DEFRA average emission factors so the app works
 * even when the Carbon Interface API is unreachable.
 *
 * All results in kg CO₂e.
 */

// ── Emission factors ─────────────────────────────────────
const FACTORS = {
  car: {
    gasoline: 0.411,   // kg CO₂ per mile
    diesel: 0.372,
    hybrid: 0.228,
    electric: 0.1,     // grid-dependent average
  },
  electricity: 0.417,  // kg CO₂ per kWh  (US grid average)
  naturalGas: 5.3,     // kg CO₂ per therm
  flight: {
    shortHaul: 255,    // kg CO₂ per short-haul flight (~500 mi)
    longHaul: 1100,    // kg CO₂ per long-haul flight (~3500 mi)
  },
  diet: {
    heavy_meat: 7.2,   // kg CO₂ per day
    medium_meat: 5.6,
    vegetarian: 3.8,
    vegan: 2.9,
  },
};

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
  } = inputs;

  const transportKg = Number(carMiles) * (FACTORS.car[fuelType] || FACTORS.car.gasoline);
  const energyKg =
    Number(electricityKwh) * FACTORS.electricity +
    Number(gasUsage) * FACTORS.naturalGas;
  const flightKg =
    Number(shortFlights) * FACTORS.flight.shortHaul +
    Number(longFlights) * FACTORS.flight.longHaul;
  const dietKg = (FACTORS.diet[dietType] || FACTORS.diet.medium_meat) * 7; // 7 days

  const totalKg = Math.round((transportKg + energyKg + flightKg + dietKg) * 100) / 100;

  return {
    totalKg,
    transportKg: Math.round(transportKg * 100) / 100,
    energyKg: Math.round(energyKg * 100) / 100,
    flightKg: Math.round(flightKg * 100) / 100,
    dietKg: Math.round(dietKg * 100) / 100,
    treesEquivalent: Math.round(totalKg / 0.06),      // ~60g CO₂ absorbed/tree/day × 7d
    source: 'offline',
  };
}

// ── Offline AI recommendations fallback ──────────────────
export function offlineRecommendations(carbonData) {
  const recs = [];

  if (carbonData.transportKg > 30) {
    recs.push({
      title: 'Reduce driving',
      description: 'Consider carpooling, biking, or public transit for short trips to cut transport emissions significantly.',
      impact: 'high',
      savingsKg: Math.round(carbonData.transportKg * 0.3),
    });
  }

  if (carbonData.energyKg > 20) {
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

  recs.push({
    title: 'Track consistently',
    description: 'Logging your activity weekly helps identify patterns and keeps you accountable for reduction goals.',
    impact: 'low',
    savingsKg: 0,
  });

  // green score: 100 = zero, 0 = very high
  const weeklyAvg = 200; // US average weekly kg CO₂
  const score = Math.max(0, Math.min(100, Math.round((1 - carbonData.totalKg / (weeklyAvg * 1.5)) * 100)));

  return {
    score,
    summary: carbonData.totalKg < weeklyAvg
      ? `Your weekly footprint of ${carbonData.totalKg} kg CO₂ is below the US average — great work!`
      : `Your weekly footprint of ${carbonData.totalKg} kg CO₂ is above average. Small changes can make a big difference.`,
    recommendations: recs.slice(0, 5),
    weeklyTarget: Math.round(carbonData.totalKg * 0.85),
    comparedToAverage: carbonData.totalKg < weeklyAvg
      ? `${Math.round(((weeklyAvg - carbonData.totalKg) / weeklyAvg) * 100)}% below US average`
      : `${Math.round(((carbonData.totalKg - weeklyAvg) / weeklyAvg) * 100)}% above US average`,
    source: 'offline',
  };
}
