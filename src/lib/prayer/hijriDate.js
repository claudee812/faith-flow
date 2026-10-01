// Approximate Hijri (Islamic) date conversion using the tabular/arithmetical
// algorithm. Not astronomically precise (real moon sighting differs by a day
// or two), so labels shown in the UI are marked as approximate. Good enough for
// display, Ramadan detection and day numbering until a precise calendar source
// is connected.

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabīʿ al-Awwal",
  "Rabīʿ ath-Thānī",
  "Jumādā al-Ūlā",
  "Jumādā ath-Thāniya",
  "Rajab",
  "Shaʿbān",
  "Ramaḍān",
  "Shawwāl",
  "Dhū al-Qaʿda",
  "Dhū al-Ḥijja",
];

function toJulianDay(y, m, d) {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

export function gregorianToHijri(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  const jd = toJulianDay(y, m, d);
  const l1 = jd - 1948440 + 10632;
  const n = Math.floor((l1 - 1) / 10631);
  const l2 = l1 - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * l3) / 709);
  const day = l3 - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month: month, day };
}

export function isRamadanActive(date) {
  const h = gregorianToHijri(date);
  return h.month === 9;
}

export function ramadanDayNumber(date) {
  const h = gregorianToHijri(date);
  if (h.month !== 9) return null;
  return h.day;
}

export function getHijriDateString(date) {
  const h = gregorianToHijri(date);
  const monthName = HIJRI_MONTHS[h.month - 1] || "";
  return `${h.day} ${monthName} ${h.year} H`;
}