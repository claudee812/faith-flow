// Configurable Islamic prayer-time calculation methods.
// Each method defines the angle (degrees below horizon) used for Fajr and Isha,
// plus optional minute- or angle-based overrides for Maghrib/Isha used by some
// authorities. This is the configuration surface a future real API call would
// also accept, so the UI stays stable when switching from mock/calc to live data.

export const CALC_METHODS = [
  { key: "MWL", name: "Muslim World League", fajr: 18, isha: 17 },
  { key: "ISNA", name: "ISNA (Nordamerika)", fajr: 15, isha: 15 },
  { key: "Egypt", name: "Egyptische Behörde", fajr: 19.5, isha: 17.5 },
  { key: "Makkah", name: "Umm al-Qurā, Makkah", fajr: 18.5, isha: null, ishaMinutes: 90 },
  { key: "Karachi", name: "Univ. of Karachi", fajr: 18, isha: 18 },
  { key: "Tehran", name: "Teheran", fajr: 17.7, isha: 14, maghrib: 4.5 },
  { key: "Jafari", name: "Shia Ithnā-ʿAshari (Jafari)", fajr: 16, isha: 14, maghrib: 4.5 },
];

export const ASR_MADHHABS = [
  { key: "shafi", name: "Standard (Shafiʿi, Maliki, Hanbali)", factor: 1 },
  { key: "hanafi", name: "Hanafi", factor: 2 },
];

export function getMethod(key) {
  return CALC_METHODS.find((m) => m.key === key) || CALC_METHODS[0];
}

export function getMadhhabFactor(key) {
  const m = ASR_MADHHABS.find((x) => x.key === key);
  return m ? m.factor : 1;
}