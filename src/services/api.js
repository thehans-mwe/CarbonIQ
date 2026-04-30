/**
 * API client — calls Vercel serverless functions.
 * Falls back to offline calculation if the API is unavailable.
 * Checks navigator.onLine first to skip unnecessary network requests.
 */

import { calculateOffline, offlineRecommendations } from './offlineCalc';

const API_BASE = '/api';

/** True when the browser reports no network connection */
function isOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}

// ── Carbon estimate ──────────────────────────────────────
export async function fetchCarbonEstimate(inputs) {
  // Always have a stable baseline (also used when API calls fail).
  const offlineParts = calculateOffline(inputs);

  // Skip API entirely when browser is offline.
  if (isOffline()) {
    console.info('Offline — using local emission factors');
    return offlineParts;
  }

  // Accuracy note:
  // - Our UI inputs do not fully parameterize Carbon Interface vehicle + flight models.
  // - The previous implementation mixed API and offline factors in a way that could
  //   double-count electricity and natural gas.
  // To keep results accurate and consistent with the inputs, we only let the API
  // adjust the *electricity* category (which matches the user's kWh input).
  try {
    if (Number(inputs.electricityKwh) <= 0) {
      return offlineParts;
    }

    const electricityOfflineKg = calculateOffline({
      ...inputs,
      // Ensure energyKg is only electricity (energyKg depends only on these).
      carMiles: 0,
      gasUsage: 0,
      shortFlights: 0,
      longFlights: 0,
    }).energyKg;

    const gasOfflineKg = offlineParts.energyKg - electricityOfflineKg;

      const res = await fetch(`${API_BASE}/carbon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'electricity',
        electricity_unit: 'kwh',
        electricity_value: Number(inputs.electricityKwh),
          country: inputs.country || 'us',
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const electricityApiKg = data?.data?.attributes?.carbon_kg;

    if (typeof electricityApiKg !== 'number' || Number.isNaN(electricityApiKg)) {
      return offlineParts;
    }

    const newEnergyKg = Math.round((electricityApiKg + gasOfflineKg) * 100) / 100;
    const newTotalKg = Math.round((offlineParts.totalKg - offlineParts.energyKg + newEnergyKg) * 100) / 100;

    return {
      ...offlineParts,
      energyKg: newEnergyKg,
      totalKg: newTotalKg,
      source: 'api',
    };
  } catch (err) {
    console.warn('Carbon API failed, using offline fallback:', err.message);
    return offlineParts;
  }
}

// ── AI Recommendations ───────────────────────────────────
export async function fetchRecommendations(carbonData, inputs) {
  // Skip API entirely when browser is offline
  if (isOffline()) {
    console.info('Offline — using local recommendations');
    return offlineRecommendations(carbonData);
  }

  try {
    const res = await fetch(`${API_BASE}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        carbonData: {
          ...carbonData,
          carMiles: inputs.carMiles,
          fuelType: inputs.fuelType,
          electricityKwh: inputs.electricityKwh,
          gasUsage: inputs.gasUsage,
          shortFlights: inputs.shortFlights,
          longFlights: inputs.longFlights,
          dietType: inputs.dietType,
        },
      }),
    });

    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return { ...data, source: 'ai' };
  } catch (err) {
    console.warn('AI API failed, using offline recommendations:', err.message);
    return offlineRecommendations(carbonData);
  }
}
