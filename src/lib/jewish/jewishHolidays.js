// Jewish holiday computation built on the validated Hebrew calendar engine.
// Returns upcoming holidays (name, type, gregorian start date, duration) for
// the calendar and home views. Public-domain factual data only.

import { gregorianToHebrew, hebrewToGregorian, hebrew_leap_year } from "./hebrewDate";

// Holidays keyed by Hebrew month/day. `month` uses Nisan=1 numbering.
const HOLIDAYS = [
  { month: 7, day: 1, name: "Rosch Haschana", type: "holiday", durationDays: 2, he: "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4" },
  { month: 7, day: 3, name: "Tzom Gedalja", type: "fast", durationDays: 1, he: "\u05E6\u05D5\u05DD \u05D2\u05D3\u05DC\u05D9\u05D4" },
  { month: 7, day: 10, name: "Jom Kippur", type: "fast", durationDays: 1, he: "\u05D9\u05D5\u05DD \u05DB\u05D9\u05E4\u05D5\u05E8" },
  { month: 7, day: 15, name: "Sukkot", type: "holiday", durationDays: 7, he: "\u05E1\u05D5\u05DB\u05D5\u05EA" },
  { month: 7, day: 22, name: "Schemini Atzeret", type: "holiday", durationDays: 1, he: "\u05E9\u05DE\u05D9\u05E0\u05D9 \u05E2\u05E6\u05E8\u05EA" },
  { month: 7, day: 23, name: "Simchat Tora", type: "holiday", durationDays: 1, he: "\u05E9\u05DE\u05D7\u05EA \u05EA\u05D5\u05E8\u05D4" },
  { month: 9, day: 25, name: "Chanukka", type: "holiday", durationDays: 8, he: "\u05D7\u05E0\u05D5\u05DB\u05D4" },
  { month: 10, day: 10, name: "Asara beTevet", type: "fast", durationDays: 1, he: "\u05E2\u05E9\u05E8\u05D4 \u05D1\u05D8\u05D1\u05EA" },
  { month: 11, day: 15, name: "Tu biSchwat", type: "holiday", durationDays: 1, he: "\u05D8\u05F4\u05D5 \u05D1\u05E9\u05D1\u05D8" },
  { month: 2, day: 14, name: "Purim", type: "holiday", durationDays: 1, he: "\u05E4\u05D5\u05E8\u05D9\u05DD" },
  { month: 1, day: 14, name: "Ta'anit Bechorot", type: "fast", durationDays: 1, he: "\u05EA\u05E2\u05E0\u05D9\u05EA \u05D1\u05DB\u05D5\u05E8\u05D5\u05EA" },
  { month: 1, day: 15, name: "Pesach", type: "holiday", durationDays: 8, he: "\u05E4\u05E1\u05D7" },
  { month: 2, day: 18, name: "Lag baOmer", type: "holiday", durationDays: 1, he: "\u05DC\u05F4\u05D2 \u05D1\u05E2\u05D5\u05DE\u05E8" },
  { month: 3, day: 6, name: "Schawuot", type: "holiday", durationDays: 2, he: "\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA" },
  { month: 5, day: 9, name: "Tischa beAv", type: "fast", durationDays: 1, he: "\u05EA\u05E9\u05E2\u05D4 \u05D1\u05D0\u05D1" },
  { month: 5, day: 15, name: "Tu beAv", type: "holiday", durationDays: 1, he: "\u05D8\u05F4\u05D5 \u05D1\u05D0\u05D1" },
];

// Purim falls in Adar II (=13) during leap years, otherwise Adar (=12).
function resolveMonth(month, year) {
  if (month === 12 && hebrew_leap_year(year)) return 13;
  return month;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

// All holiday occurrences in a single Hebrew year, sorted by Gregorian date.
function holidaysInYear(year) {
  const list = [];
  for (const h of HOLIDAYS) {
    const m = resolveMonth(h.month, year);
    const start = hebrewToGregorian(year, m, h.day);
    list.push({
      ...h,
      gregorianStart: start,
      gregorianEnd: addDays(start, h.durationDays - 1),
      hebrewYear: year,
    });
  }
  return list.sort((a, b) => a.gregorianStart - b.gregorianStart);
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

// Is there a holiday covering the given Gregorian date?
export function holidayOnDate(date) {
  const h = gregorianToHebrew(date);
  for (const year of [h.year, h.year - 1]) {
    for (const ev of holidaysInYear(year)) {
      if (date >= startOfDay(ev.gregorianStart) && date <= endOfDay(ev.gregorianEnd)) {
        return ev;
      }
    }
  }
  return null;
}

// The next `count` holidays from today (including one starting today).
export function getUpcomingHolidays(date, count = 5) {
  const h = gregorianToHebrew(date);
  const results = [];
  for (let year = h.year; year <= h.year + 2 && results.length < count; year++) {
    for (const ev of holidaysInYear(year)) {
      if (endOfDay(ev.gregorianEnd) >= date) {
        results.push(ev);
      }
    }
  }
  return results.slice(0, count);
}

// Days until the next holiday from `date` (0 if one is today).
export function daysUntilNextHoliday(date) {
  const list = getUpcomingHolidays(date, 1);
  if (!list.length) return null;
  return Math.max(0, Math.round((startOfDay(list[0].gregorianStart) - startOfDay(date)) / 86400000));
}

export { HOLIDAYS };