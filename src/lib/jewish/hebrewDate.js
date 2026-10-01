// Hebrew calendar engine (Reingold–Dershowitz arithmetic) plus helpers for
// FaithFlow. Public-domain factual astronomy/math only — no copyrighted text.
// Months are numbered Nisan=1, Iyyar=2, Sivan=3, Tammuz=4, Av=5, Elul=6,
// Tishrei=7, Cheshvan=8, Kislev=9, Tevet=10, Shevat=11, Adar=12, Adar II=13.
// The civil year starts at Tishrei (month 7).

function mod(a, b) {
  return ((a % b) + b) % b;
}

// Rata Die epoch: RD 1 = 1 Jan 1 CE (Gregorian) = JDN 1721426.
const RD_TO_JDN = 1721425; // JDN = RD + 1721425
const HEBREW_EPOCH = -1373428; // RD of 1 Tishrei year 1 (hebcal/hdate reference epoch)

export function hebrew_leap_year(y) {
  return mod(y * 7 + 1, 19) < 7;
}

export function last_month_of_hebrew_year(y) {
  return hebrew_leap_year(y) ? 13 : 12;
}

// Days from the epoch to the molad of Tishrei for year y, after applying the
// Lo ADU Rosh postponement (new year not on Sun/Wed/Fri). Follows the
// hebcal/hdate Rata Die algorithm.
function hebrew_calendar_elapsed_days(y) {
  const monthsElapsed = Math.floor((235 * y - 234) / 19);
  const partsElapsed = 12084 + 13753 * monthsElapsed;
  const day = 29 * monthsElapsed + Math.floor(partsElapsed / 25920);
  return mod(3 * (day + 1), 7) < 3 ? day + 1 : day;
}

export function hebrew_new_year(y) {
  return HEBREW_EPOCH + hebrew_calendar_elapsed_days(y);
}

export function hebrew_year_length(y) {
  return hebrew_new_year(y + 1) - hebrew_new_year(y);
}

export function hebrew_month_length(y, m) {
  // Fixed-length months.
  if (m === 2 || m === 4 || m === 6 || m === 10 || m === 13) return 29;
  if (m === 12 && !hebrew_leap_year(y)) return 29;
  const len = hebrew_year_length(y);
  if (m === 8) return len % 10 === 5 ? 30 : 29; // Cheshvan: 30 in complete years
  if (m === 9) return len % 10 === 3 ? 29 : 30; // Kislev: 29 in deficient years
  return 30;
}

// Month order from Tishrei (start of civil year) through Elul.
function month_order(y) {
  return hebrew_leap_year(y)
    ? [7, 8, 9, 10, 11, 12, 13, 1, 2, 3, 4, 5, 6]
    : [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];
}

// Convert (hebrew year, month, day) -> Rata Die fixed date.
export function hebrew_to_fixed(y, m, day) {
  let rd = hebrew_new_year(y) + day - 1;
  for (const mm of month_order(y)) {
    if (mm === m) break;
    rd += hebrew_month_length(y, mm);
  }
  return rd;
}

// Convert Rata Die fixed date -> { year, month, day }.
export function fixed_to_hebrew(rd) {
  let y = Math.floor((rd - HEBREW_EPOCH) / 365.2468) + 1;
  while (hebrew_new_year(y) > rd) y -= 1;
  while (hebrew_new_year(y + 1) <= rd) y += 1;
  let dayOfYear = rd - hebrew_new_year(y);
  let month = 7;
  let d = dayOfYear;
  for (const mm of month_order(y)) {
    const len = hebrew_month_length(y, mm);
    if (d < len) {
      month = mm;
      break;
    }
    d -= len;
  }
  return { year: y, month, day: d + 1 };
}

// ---- Gregorian <-> JDN/RD helpers ----
function greg_to_jdn(year, month, day) {
  const a = Math.floor((14 - month) / 12);
  const yy = year + 4800 - a;
  const mm = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * mm + 2) / 5) +
    365 * yy +
    Math.floor(yy / 4) -
    Math.floor(yy / 100) +
    Math.floor(yy / 400) -
    32045
  );
}

function jdn_to_greg(jdn) {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
}

function dateToJDN(date) {
  return greg_to_jdn(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

function jdnToDate(jdn) {
  const { year, month, day } = jdn_to_greg(jdn);
  return new Date(year, month - 1, day);
}

export function gregorianToHebrew(date) {
  const rd = dateToJDN(date) - RD_TO_JDN;
  return fixed_to_hebrew(rd);
}

export function hebrewToGregorian(year, month, day) {
  const rd = hebrew_to_fixed(year, month, day);
  return jdnToDate(rd + RD_TO_JDN);
}

export const HEBREW_MONTH_NAMES = {
  1: "Nisan",
  2: "Iyyar",
  3: "Sivan",
  4: "Tammuz",
  5: "Av",
  6: "Elul",
  7: "Tishrei",
  8: "Cheshvan",
  9: "Kislev",
  10: "Tevet",
  11: "Shevat",
  12: "Adar",
  13: "Adar II",
};

// For leap years, Adar I is 12 and Adar II is 13. Display "Adar I/II".
export function hebrewMonthName(year, month) {
  if (hebrew_leap_year(year)) {
    if (month === 12) return "Adar I";
    if (month === 13) return "Adar II";
  }
  return HEBREW_MONTH_NAMES[month] || "";
}

export function formatHebrewDate(date) {
  const h = gregorianToHebrew(date);
  return {
    year: h.year,
    month: h.month,
    day: h.day,
    monthName: hebrewMonthName(h.year, h.month),
    full: `${h.day}. ${hebrewMonthName(h.year, h.month)} ${h.year}`,
    short: `${h.day}. ${hebrewMonthName(h.year, h.month)}`,
  };
}

// Hebrew day of week name (Hebrew), keyed by JS getDay().
export const HEBREW_DAY_NAMES = [
  "Rishon",
  "Sheni",
  "Shlishi",
  "Revi'i",
  "Chamishi",
  "Shishi",
  "Shabbat",
];

// Is the given date Shabbat (Saturday)?
export function isShabbat(date) {
  return date.getDay() === 6;
}