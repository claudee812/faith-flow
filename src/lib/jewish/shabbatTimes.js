// Shabbat candle-lighting and havdalah times. A real implementation needs the
// user's location and a sunrise/sunset algorithm. Without a location we show
// clearly-labeled approximate times so the UI is never broken or misleading.
//
// API abstraction: swap `computeShabbatTimes` for a geolocation-based
// implementation (e.g. sunrise-sunset.org or a Hebcal API) later — the
// component layer only reads { candles, havdalah, isMock }.

// Friday of the week containing `date`.
export function fridayOf(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay(); // 0 Sun .. 6 Sat
  const diff = (dow + 6) % 7; // days since Friday
  d.setDate(d.getDate() - diff);
  return d;
}

// Approximate candle lighting (18 min before a nominal Friday sunset) and
// havdalah (after a nominal Saturday nightfall). Marked mock until a real
// location-based source is wired in.
export function computeShabbatTimes(date) {
  const friday = fridayOf(date);
  // Nominal Central-European sunset ~18:00 in autumn, ~21:00 in summer.
  const month = friday.getMonth();
  const sunsetHour = month >= 3 && month <= 8 ? 21 : month >= 9 || month <= 1 ? 16 : 19;
  const sunsetMin = month >= 3 && month <= 8 ? 0 : 15;
  const candles = new Date(friday);
  candles.setHours(sunsetHour, sunsetMin - 18, 0, 0);
  const havdalah = new Date(friday);
  havdalah.setDate(havdalah.getDate() + 1);
  havdalah.setHours(sunsetHour + 1, sunsetMin, 0, 0);
  return {
    friday,
    candles,
    havdalah,
    isMock: true,
    sourceLabel: "jewish.shabbat.source.mock",
  };
}

// Is the given moment during Shabbat (Friday sunset → Saturday nightfall)?
export function isShabbatActive(date, times) {
  const t = times || computeShabbatTimes(date);
  return date >= t.candles && date <= t.havdalah;
}