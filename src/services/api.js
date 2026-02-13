/**
 * API client — calls Vercel serverless functions.
 * Falls back to offline calculation if the API is unavailable.
 */

import { calculateOffline, offlineRecommendations } from './offlineCalc';

const API_BASE = '/api';

// ── Carbon estimate ──────────────────────────────────────
export async function fetchCarbonEstimate(inputs) {
  try {
    // We send multiple estimate requests and aggregate
    const promises = [];

    // Vehicle estimate
    if (Number(inputs.carMiles) > 0) {
      promises.push(
        fetch(`${API_BASE}/carbon`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vehicle',
            distance_unit: 'mi',
            distance_value: Number(inputs.carMiles),
            vehicle_model_id: '7268a9b7-17e8-4c8d-acca-57059252afe9', // generic medium car
          }),
        }).then((r) => r.json())
      );
    }

    // Electricity estimate
    if (Number(inputs.electricityKwh) > 0) {
      promises.push(
        fetch(`${API_BASE}/carbon`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'electricity',
            electricity_unit: 'kwh',
            electricity_value: Number(inputs.electricityKwh),
            country: 'us',
          }),
        }).then((r) => r.json())
      );
    }

    // Flight estimate(s)
    if (Number(inputs.shortFlights) > 0 || Number(inputs.longFlights) > 0) {
      const legs = [];
      for (let i = 0; i < Number(inputs.shortFlights || 0); i++) {
        legs.push({ departure_airport: 'sfo', destination_airport: 'lax' });
      }
      for (let i = 0; i < Number(inputs.longFlights || 0); i++) {
        legs.push({ departure_airport: 'sfo', destination_airport: 'jfk' });
      }
      if (legs.length) {
        promises.push(
          fetch(`${API_BASE}/carbon`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'flight',
              passengers: 1,
              legs,
            }),
          }).then((r) => r.json())
        );
      }
    }

    if (promises.length === 0) {
      // Nothing to call the API for, compute offline
      return calculateOffline(inputs);
    }

    const results = await Promise.allSettled(promises);

    // Check if at least one succeeded
    const succeeded = results.filter(
      (r) => r.status === 'fulfilled' && r.value?.data?.attributes
    );

    if (succeeded.length === 0) throw new Error('All API calls failed');

    // Sum API kg values
    let apiKg = 0;
    succeeded.forEach((r) => {
      apiKg += r.value.data.attributes.carbon_kg || 0;
    });

    // Compute non-API items offline (gas, diet)
    const offlineParts = calculateOffline(inputs);
    const totalKg = Math.round((apiKg + offlineParts.dietKg + (Number(inputs.gasUsage) > 0 ? offlineParts.energyKg - Number(inputs.electricityKwh) * 0.417 + Number(inputs.gasUsage) * 5.3 : 0)) * 100) / 100;

    return {
      ...offlineParts,
      totalKg: totalKg || offlineParts.totalKg,
      source: 'api',
    };
  } catch (err) {
    console.warn('Carbon API failed, using offline fallback:', err.message);
    return calculateOffline(inputs);
  }
}

// ── AI Recommendations ───────────────────────────────────
export async function fetchRecommendations(carbonData, inputs) {
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
