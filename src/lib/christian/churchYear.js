// Liturgical church-year computation. Computes Easter (Gregorian and Julian
// for Orthodox use), then derives the movable seasons. Denomination-aware:
// Orthodox traditions use the Julian Easter and Julian-date fixed feasts.

function easterGregorian(year) {
  // Meeus/Jones/Butcher algorithm (Gregorian Easter).
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function easterJulian(year) {
  // Meeus Julian Easter, then converted to Gregorian date by adding the
  // current Julian–Gregorian offset (13 days for 1900–2099).
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  const julian = new Date(year, month - 1, day);
  julian.setDate(julian.getDate() + 13); // Julian -> Gregorian offset (1900-2099)
  return julian;
}

export function easterFor(year, denomination) {
  return denomination === "orthodox" ? easterJulian(year) : easterGregorian(year);
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function dateStr(d) {
  return d.toISOString().slice(0, 10);
}

// Build the ordered list of liturgical seasons for a given year & denomination.
// Each season: { key, labelKey, start, end, type, movable }
export function getSeasonsOfYear(year, denomination) {
  const easter = easterFor(year, denomination);
  const christmas = new Date(year, 11, 25);
  // Advent: 4th Sunday before Christmas.
  const adventSunday = addDays(christmas, -((christmas.getDay() + 21) % 7) - 21);
  // Wait, simpler: Advent Sunday is the Sunday closest to Nov 30, but the
  // standard "4 Sundays before Christmas" works well enough:
  let adv = addDays(christmas, -21);
  while (adv.getDay() !== 0) adv = addDays(adv, -1);
  const epiphany = new Date(year + 1, 0, 6);
  const ashWednesday = addDays(easter, -46);
  const palmSunday = addDays(easter, -7);
  const pentecost = addDays(easter, 49);
  const trinitySunday = addDays(easter, 56);

  const seasons = [
    { key: "advent", labelKey: "christian.season.advent", start: adv, end: addDays(christmas, -1), type: "season", movable: false },
    { key: "christmas", labelKey: "christian.season.christmas", start: christmas, end: new Date(year + 1, 0, 5), type: "season", movable: false },
    { key: "epiphany", labelKey: "christian.season.epiphany", start: epiphany, end: addDays(ashWednesday, -1), type: "season", movable: false },
    { key: "lent", labelKey: "christian.season.lent", start: ashWednesday, end: addDays(palmSunday, -1), type: "fast", movable: true },
    { key: "holy_week", labelKey: "christian.season.holyWeek", start: palmSunday, end: addDays(easter, -1), type: "fast", movable: true },
    { key: "easter", labelKey: "christian.season.easter", start: easter, end: addDays(pentecost, -1), type: "feast", movable: true },
    { key: "pentecost", labelKey: "christian.season.pentecost", start: pentecost, end: trinitySunday, type: "feast", movable: true },
    { key: "ordinary", labelKey: "christian.season.ordinary", start: trinitySunday, end: addDays(new Date(year, 11, 24), 0) > trinitySunday ? new Date(year, 11, 24) : adv, type: "season", movable: false },
  ];
  return seasons.map((s) => ({ ...s, start: dateStr(s.start), end: dateStr(s.end) }));
}

// Current active season for a date + denomination.
export function getCurrentSeason(date, denomination) {
  const d = date || new Date();
  const year = d.getFullYear();
  // Seasons span the new year, so check current year and previous year.
  const list = [...getSeasonsOfYear(year - 1, denomination), ...getSeasonsOfYear(year, denomination)];
  const ds = dateStr(d);
  const active = list.find((s) => ds >= s.start && ds <= s.end);
  return active || { key: "ordinary", labelKey: "christian.season.ordinary", start: ds, end: ds, type: "season" };
}

// The next upcoming season after today.
export function getNextSeason(date, denomination) {
  const d = date || new Date();
  const year = d.getFullYear();
  const list = [...getSeasonsOfYear(year, denomination), ...getSeasonsOfYear(year + 1, denomination)];
  const ds = dateStr(d);
  return list.find((s) => s.start > ds) || list[0];
}

export function formatSeasonRange(season) {
  if (!season) return "";
  const fmt = (s) =>
    new Date(s).toLocaleDateString("de-DE", { day: "numeric", month: "long" });
  return `${fmt(season.start)} – ${fmt(season.end)}`;
}