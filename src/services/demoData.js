/**
 * Preloaded demo account data — used for the "Try Demo" flow
 * so users can see the full dashboard without entering data.
 */

export const DEMO_INPUTS = {
  carMiles: 120,
  fuelType: 'gasoline',
  electricityKwh: 85,
  gasUsage: 4,
  shortFlights: 1,
  longFlights: 0,
  dietType: 'medium_meat',
};

export const DEMO_CARBON = {
  totalKg: 131.46,
  transportKg: 49.32,
  energyKg: 56.65,
  flightKg: 255,
  dietKg: 39.2,
  treesEquivalent: 2191,
  source: 'demo',
};

export const DEMO_RECOMMENDATIONS = {
  score: 72,
  summary:
    'Your weekly footprint of 131 kg CO₂ is below the US average — you\'re on the right track, but there\'s room to improve.',
  recommendations: [
    {
      title: 'Switch to hybrid',
      description:
        'Trading your gasoline car for a hybrid could reduce transport emissions by nearly half on your 120-mile weekly commute.',
      impact: 'high',
      savingsKg: 22,
    },
    {
      title: 'Renewable energy plan',
      description:
        'Ask your utility about a 100% renewable electricity plan — some cost the same or less than standard rates.',
      impact: 'high',
      savingsKg: 30,
    },
    {
      title: 'Offset that flight',
      description:
        'Your short-haul flight added 255 kg. Purchase verified offsets for ~$6 to neutralize the impact.',
      impact: 'medium',
      savingsKg: 255,
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
      savingsKg: 3,
    },
  ],
  weeklyTarget: 112,
  comparedToAverage: '34% below US average',
  source: 'demo',
};

export const DEMO_DAILY_BREAKDOWN = [
  { day: 'Mon', transport: 9, energy: 8, diet: 5.6 },
  { day: 'Tue', transport: 7, energy: 7, diet: 5.6 },
  { day: 'Wed', transport: 8, energy: 9, diet: 5.6 },
  { day: 'Thu', transport: 6, energy: 8, diet: 5.6 },
  { day: 'Fri', transport: 10, energy: 7, diet: 5.6 },
  { day: 'Sat', transport: 5, energy: 9, diet: 5.6 },
  { day: 'Sun', transport: 4, energy: 8, diet: 5.6 },
];
