/**
 * Preloaded demo account data — used for the "Try Demo" flow
 * so users can see the full dashboard without entering data.
 */

export const DEMO_INPUTS = {
  carMiles: 100,
  fuelType: 'gasoline',
  electricityKwh: 90,
  gasUsage: 3,
  shortFlights: 0,
  longFlights: 0,
  dietType: 'medium_meat',
  shoppingHabit: 'average',
  streamingHours: 10,
};

export const DEMO_CARBON = {
  totalKg: 124.8,    // 40.4 + 50.67 + 0 + 39.41 + 8.86 (with lifestyle)
  transportKg: 40.4,
  energyKg: 50.67,
  flightKg: 0,
  dietKg: 39.41,
  lifestyleKg: 8.86, // avg shopping (8.5) + streaming 10hrs (0.36)
  treesEquivalent: 297, // 124.8 / 0.42
  source: 'demo',
};

export const DEMO_RECOMMENDATIONS = {
  score: 68,
  summary:
    'Your weekly footprint of 115.94 kg CO₂ is below the US average of ~182 kg — that puts you ahead of the curve!',
  recommendations: [
    {
      title: 'Switch to hybrid',
      description:
        'Trading your gasoline car for a hybrid could cut transport emissions by nearly half on your 100-mile weekly commute.',
      impact: 'high',
      savingsKg: 19,
    },
    {
      title: 'Renewable energy plan',
      description:
        'Ask your utility about a 100% renewable electricity plan — some cost the same or less than standard rates.',
      impact: 'high',
      savingsKg: 26,
    },
    {
      title: 'Meatless Mondays',
      description:
        'Replace one meat-heavy meal day with plant-based options to cut dietary emissions by ~15%.',
      impact: 'medium',
      savingsKg: 6,
    },
    {
      title: 'Smart thermostat',
      description:
        'A programmable thermostat can lower gas usage by 10-15% with zero effort after setup.',
      impact: 'low',
      savingsKg: 2,
    },
    {
      title: 'Track consistently',
      description:
        'Logging your activity weekly helps identify patterns and keeps you accountable for reduction goals.',
      impact: 'low',
      savingsKg: 0,
    },
  ],
  weeklyTarget: 99,
  comparedToAverage: '36% below US average',
  source: 'demo',
};

export const DEMO_DAILY_BREAKDOWN = [
  { day: 'Mon', transport: 7, energy: 7.5, diet: 5.6 },
  { day: 'Tue', transport: 6, energy: 7, diet: 5.6 },
  { day: 'Wed', transport: 7, energy: 7.5, diet: 5.6 },
  { day: 'Thu', transport: 5, energy: 7, diet: 5.6 },
  { day: 'Fri', transport: 7, energy: 7.5, diet: 5.6 },
  { day: 'Sat', transport: 4, energy: 7, diet: 5.6 },
  { day: 'Sun', transport: 4.4, energy: 7.2, diet: 5.6 },
];
