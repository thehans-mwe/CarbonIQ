// Country-specific emission factors and benchmarks
// Values are approximations intended as editable defaults — replace with authoritative data if needed.
const COUNTRIES = {
  us: {
    code: 'us', name: 'United States', flag: '🇺🇸',
    electricity: 0.373, // kg CO2/kWh (eGRID2022 national)
    carGasoline: 0.400, // kg CO2/mi
    carElectric: 0.104, // kg CO2/mi (avg EV efficiency × grid)
    benchmarks: {
      transport: 77,
      energy: 51,
      flight: 10,
      diet: 39.4,
      lifestyle: 13,
    },
  },
  uk: {
    code: 'uk', name: 'United Kingdom', flag: '🇬🇧',
    electricity: 0.233,
    carGasoline: 0.32,
    carElectric: 0.06,
    benchmarks: { transport: 60, energy: 38, flight: 8, diet: 30, lifestyle: 10 },
  },
  de: {
    code: 'de', name: 'Germany', flag: '🇩🇪',
    electricity: 0.401,
    carGasoline: 0.34,
    carElectric: 0.09,
    benchmarks: { transport: 65, energy: 45, flight: 9, diet: 33, lifestyle: 11 },
  },
  cn: {
    code: 'cn', name: 'China', flag: '🇨🇳',
    electricity: 0.78,
    carGasoline: 0.42,
    carElectric: 0.18,
    benchmarks: { transport: 55, energy: 80, flight: 6, diet: 25, lifestyle: 9 },
  },
  in: {
    code: 'in', name: 'India', flag: '🇮🇳',
    electricity: 0.82,
    carGasoline: 0.36,
    carElectric: 0.22,
    benchmarks: { transport: 30, energy: 70, flight: 2, diet: 20, lifestyle: 6 },
  },
  au: {
    code: 'au', name: 'Australia', flag: '🇦🇺',
    electricity: 0.74,
    carGasoline: 0.38,
    carElectric: 0.16,
    benchmarks: { transport: 68, energy: 60, flight: 12, diet: 35, lifestyle: 12 },
  },
};

export function getCountryInfo(code = 'us') {
  return COUNTRIES[(code || 'us').toLowerCase()] || COUNTRIES.us;
}

export function getCountryFactors(code = 'us') {
  const c = getCountryInfo(code);
  return {
    electricity: c.electricity,
    car: {
      gasoline: c.carGasoline,
      electric: c.carElectric,
    },
    benchmarks: c.benchmarks,
  };
}

export const COUNTRY_OPTIONS = Object.values(COUNTRIES).map((c) => ({ value: c.code, label: c.name, emoji: c.flag }));

export default COUNTRIES;
