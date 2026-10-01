// Hebrew calendar engine for FaithFlow.
//
// Backed by @hebcal/hdate — a validated, GPL-2.0 implementation of the
// Reingold–Dershowitz Rata Die algorithm (the same authoritative source
// used by hebcal.com). We expose a small, stable wrapper API so the rest
// of the app never depends on the library's internals directly.
//
// Months are numbered Nisan=1, Iyyar=2, Sivan=3, Tammuz=4, Av=5, Elul=6,
// Tishrei=7, Cheshvan=8, Kislev=9, Tevet=10, Shevat=11, Adar=12, Adar II=13.
// The civil year starts at Tishrei (month 7).

import {
  hebrew2abs,
  abs2hebrew,
  greg2abs,
  abs2greg,
  isLeapYear,
  daysInMonth,
  getMonthName,
} from "@hebcal/hdate";

export function hebrew_leap_year(y) {
  return isLeapYear(y);
}

export function last_month_of_hebrew_year(y) {
  return isLeapYear(y) ? 13 : 12;
}

// Rata Die of 1 Tishrei for the given Hebrew year.
export function hebrew_new_year(y) {
  return hebrew2abs(y, 7, 1);
}

export function hebrew_year_length(y) {
  return hebrew_new_year(y + 1) - hebrew_new_year(y);
}

export function hebrew_month_length(y, m) {
  return daysInMonth(m, y);
}

// (hebrew year, month, day) -> Rata Die fixed date.
export function hebrew_to_fixed(y, m, day) {
  return hebrew2abs(y, m, day);
}

// Rata Die fixed date -> { year, month, day }.
export function fixed_to_hebrew(rd) {
  const { yy, mm, dd } = abs2hebrew(rd);
  return { year: yy, month: mm, day: dd };
}

// JS Date -> { year, month, day } (Hebrew).
export function gregorianToHebrew(date) {
  const abs = greg2abs(date);
  const { yy, mm, dd } = abs2hebrew(abs);
  return { year: yy, month: mm, day: dd };
}

// (hebrew year, month, day) -> JS Date (midnight local).
export function hebrewToGregorian(year, month, day) {
  const abs = hebrew2abs(year, month, day);
  return abs2greg(abs);
}

export const HEBREW_MONTH_NAMES = {
  1: "Nissan",
  2: "Ijjar",
  3: "Siwan",
  4: "Tammus",
  5: "Aw",
  6: "Elul",
  7: "Tischrei",
  8: "Cheschwan",
  9: "Kislew",
  10: "Tewet",
  11: "Schwat",
  12: "Adar",
  13: "Adar II",
};

// German-friendly display name. In a leap year month 12 is "Adar I".
export function hebrewMonthName(year, month) {
  if (isLeapYear(year)) {
    if (month === 12) return "Adar I";
    if (month === 13) return "Adar II";
  }
  return HEBREW_MONTH_NAMES[month] || getMonthName(month, year);
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

// Hebrew day-of-week names (transliterated), keyed by JS getDay().
export const HEBREW_DAY_NAMES = [
  "Jom Rischon",
  "Jom Scheni",
  "Jom Schlischi",
  "Jom Revi'i",
  "Jom Chamischi",
  "Jom Schischi",
  "Schabbat",
];

// Is the given date Shabbat (Saturday)?
export function isShabbat(date) {
  return date.getDay() === 6;
}