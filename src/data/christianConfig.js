// Christianity module configuration. Public-domain factual metadata only:
// the 66-book canon with chapter counts, the default prayer routine slots,
// denomination-specific module toggles, rosary mysteries and a small set of
// fixed-date memorials used to seed ChristianCalendarEvent. No copyrighted
// Bible text is stored.

// Default daily prayer routine (Morning / Noon / Evening). Users can add more.
export const DEFAULT_PRAYER_SLOTS = [
  { key: "morning", labelKey: "christian.prayer.morning", time: "07:00", reminder_enabled: true, custom: false },
  { key: "noon", labelKey: "christian.prayer.noon", time: "12:00", reminder_enabled: false, custom: false },
  { key: "evening", labelKey: "christian.prayer.evening", time: "20:00", reminder_enabled: true, custom: false },
];

// 66-book Protestant canon with chapter counts (Luther German names).
// Catholic/Orthodox deuterocanonical books are not stored as canonical text;
// those traditions see additional modules (saints, rosary) instead.
export const BIBLE_BOOKS = [
  { n: 1, name: "Genesis", testament: "AT", chapters: 50 },
  { n: 2, name: "Exodus", testament: "AT", chapters: 40 },
  { n: 3, name: "Levitikus", testament: "AT", chapters: 27 },
  { n: 4, name: "Numeri", testament: "AT", chapters: 36 },
  { n: 5, name: "Deuteronium", testament: "AT", chapters: 34 },
  { n: 6, name: "Josua", testament: "AT", chapters: 24 },
  { n: 7, name: "Richter", testament: "AT", chapters: 21 },
  { n: 8, name: "Rut", testament: "AT", chapters: 4 },
  { n: 9, name: "1. Samuel", testament: "AT", chapters: 31 },
  { n: 10, name: "2. Samuel", testament: "AT", chapters: 24 },
  { n: 11, name: "1. Könige", testament: "AT", chapters: 22 },
  { n: 12, name: "2. Könige", testament: "AT", chapters: 25 },
  { n: 13, name: "1. Chronik", testament: "AT", chapters: 29 },
  { n: 14, name: "2. Chronik", testament: "AT", chapters: 36 },
  { n: 15, name: "Esra", testament: "AT", chapters: 10 },
  { n: 16, name: "Nehemia", testament: "AT", chapters: 13 },
  { n: 17, name: "Ester", testament: "AT", chapters: 10 },
  { n: 18, name: "Hiob", testament: "AT", chapters: 42 },
  { n: 19, name: "Psalmen", testament: "AT", chapters: 150 },
  { n: 20, name: "Sprüche", testament: "AT", chapters: 31 },
  { n: 21, name: "Prediger", testament: "AT", chapters: 12 },
  { n: 22, name: "Hohelied", testament: "AT", chapters: 8 },
  { n: 23, name: "Jesaja", testament: "AT", chapters: 66 },
  { n: 24, name: "Jeremia", testament: "AT", chapters: 52 },
  { n: 25, name: "Klagelieder", testament: "AT", chapters: 5 },
  { n: 26, name: "Hesekiel", testament: "AT", chapters: 48 },
  { n: 27, name: "Daniel", testament: "AT", chapters: 12 },
  { n: 28, name: "Hosea", testament: "AT", chapters: 14 },
  { n: 29, name: "Joel", testament: "AT", chapters: 3 },
  { n: 30, name: "Amos", testament: "AT", chapters: 9 },
  { n: 31, name: "Obadja", testament: "AT", chapters: 1 },
  { n: 32, name: "Jona", testament: "AT", chapters: 4 },
  { n: 33, name: "Micha", testament: "AT", chapters: 7 },
  { n: 34, name: "Nahum", testament: "AT", chapters: 3 },
  { n: 35, name: "Habakuk", testament: "AT", chapters: 3 },
  { n: 36, name: "Zefanja", testament: "AT", chapters: 3 },
  { n: 37, name: "Haggai", testament: "AT", chapters: 2 },
  { n: 38, name: "Sacharja", testament: "AT", chapters: 14 },
  { n: 39, name: "Maleachi", testament: "AT", chapters: 4 },
  { n: 40, name: "Matthäus", testament: "NT", chapters: 28 },
  { n: 41, name: "Markus", testament: "NT", chapters: 16 },
  { n: 42, name: "Lukas", testament: "NT", chapters: 24 },
  { n: 43, name: "Johannes", testament: "NT", chapters: 21 },
  { n: 44, name: "Apostelgeschichte", testament: "NT", chapters: 28 },
  { n: 45, name: "Römer", testament: "NT", chapters: 16 },
  { n: 46, name: "1. Korinther", testament: "NT", chapters: 16 },
  { n: 47, name: "2. Korinther", testament: "NT", chapters: 13 },
  { n: 48, name: "Galater", testament: "NT", chapters: 6 },
  { n: 49, name: "Epheser", testament: "NT", chapters: 6 },
  { n: 50, name: "Philipper", testament: "NT", chapters: 4 },
  { n: 51, name: "Kolosser", testament: "NT", chapters: 4 },
  { n: 52, name: "1. Thessalonicher", testament: "NT", chapters: 5 },
  { n: 53, name: "2. Thessalonicher", testament: "NT", chapters: 3 },
  { n: 54, name: "1. Timotheus", testament: "NT", chapters: 6 },
  { n: 55, name: "2. Timotheus", testament: "NT", chapters: 4 },
  { n: 56, name: "Titus", testament: "NT", chapters: 3 },
  { n: 57, name: "Philemon", testament: "NT", chapters: 1 },
  { n: 58, name: "Hebräer", testament: "NT", chapters: 13 },
  { n: 59, name: "Jakobus", testament: "NT", chapters: 5 },
  { n: 60, name: "1. Petrus", testament: "NT", chapters: 5 },
  { n: 61, name: "2. Petrus", testament: "NT", chapters: 3 },
  { n: 62, name: "1. Johannes", testament: "NT", chapters: 5 },
  { n: 63, name: "2. Johannes", testament: "NT", chapters: 1 },
  { n: 64, name: "3. Johannes", testament: "NT", chapters: 1 },
  { n: 65, name: "Judas", testament: "NT", chapters: 1 },
  { n: 66, name: "Offenbarung", testament: "NT", chapters: 22 },
];

export const BIBLE_TOTAL_CHAPTERS = BIBLE_BOOKS.reduce((s, b) => s + b.chapters, 0); // 1189

// Modules shown per denomination. An empty `denominations` array means the
// module is shared by all Christian denominations. No denomination is framed
// as "more correct" — these are configurable content toggles.
export const CHRISTIAN_FEATURES = [
  { key: "prayer", labelKey: "christian.feature.prayer", order: 1, denominations: [] },
  { key: "bible", labelKey: "christian.feature.bible", order: 2, denominations: [] },
  { key: "service", labelKey: "christian.feature.service", order: 3, denominations: [] },
  { key: "church_year", labelKey: "christian.feature.churchYear", order: 4, denominations: [] },
  { key: "journal", labelKey: "christian.feature.journal", order: 5, denominations: [] },
  { key: "rosary", labelKey: "christian.feature.rosary", order: 6, denominations: ["catholic"] },
  { key: "mass", labelKey: "christian.feature.mass", order: 7, denominations: ["catholic", "orthodox"] },
  { key: "saints", labelKey: "christian.feature.saints", order: 8, denominations: ["catholic", "orthodox"] },
  { key: "confession", labelKey: "christian.feature.confession", order: 9, denominations: ["catholic", "orthodox"] },
  { key: "orthodox_fasts", labelKey: "christian.feature.orthodoxFasts", order: 10, denominations: ["orthodox"] },
  { key: "daily_office", labelKey: "christian.feature.dailyOffice", order: 11, denominations: ["anglican", "catholic"] },
  { key: "worship", labelKey: "christian.feature.worship", order: 12, denominations: ["free_church", "protestant"] },
];

export function featuresForDenomination(denomKey) {
  return CHRISTIAN_FEATURES.filter(
    (f) => !f.denominations.length || f.denominations.includes(denomKey)
  ).sort((a, b) => a.order - b.order);
}

export function hasFeature(denomKey, featureKey) {
  const f = CHRISTIAN_FEATURES.find((x) => x.key === featureKey);
  if (!f) return false;
  return !f.denominations.length || f.denominations.includes(denomKey);
}

// Rosary mysteries and the traditional day-of-week schedule.
export const ROSARY_MYSTERY_SCHEDULE = {
  0: "glorious", // Sunday
  1: "joyful",
  2: "sorrowful",
  3: "glorious",
  4: "joyful",
  5: "sorrowful",
  6: "glorious",
};

export const ROSARY_MYSTERY_LABELS = {
  joyful: "christian.rosary.joyful",
  sorrowful: "christian.rosary.sorrowful",
  glorious: "christian.rosary.glorious",
  luminous: "christian.rosary.luminous",
};

export const ROSARY_DECADES = {
  joyful: [
    "christian.rosary.joyful.1",
    "christian.rosary.joyful.2",
    "christian.rosary.joyful.3",
    "christian.rosary.joyful.4",
    "christian.rosary.joyful.5",
  ],
  sorrowful: [
    "christian.rosary.sorrowful.1",
    "christian.rosary.sorrowful.2",
    "christian.rosary.sorrowful.3",
    "christian.rosary.sorrowful.4",
    "christian.rosary.sorrowful.5",
  ],
  glorious: [
    "christian.rosary.glorious.1",
    "christian.rosary.glorious.2",
    "christian.rosary.glorious.3",
    "christian.rosary.glorious.4",
    "christian.rosary.glorious.5",
  ],
  luminous: [
    "christian.rosary.luminous.1",
    "christian.rosary.luminous.2",
    "christian.rosary.luminous.3",
    "christian.rosary.luminous.4",
    "christian.rosary.luminous.5",
  ],
};

// Gentle service preparation checklist.
export const SERVICE_CHECKLIST = [
  { key: "arrived", labelKey: "christian.service.checklist.arrived" },
  { key: "worship", labelKey: "christian.service.checklist.worship" },
  { key: "fellowship", labelKey: "christian.service.checklist.fellowship" },
];

// Fixed-date memorials / feasts (used to seed ChristianCalendarEvent). Movable
// seasons are computed at runtime in churchYear.js.
export const FIXED_FEASTS = [
  { name: "Weihnachten", date: "12-25", type: "feast", denominations: [] },
  { name: "1. Weihnachtstag", date: "12-26", type: "feast", denominations: [] },
  { name: "Epiphanias", date: "01-06", type: "feast", denominations: [] },
  { name: "Darstellung des Herrn", date: "02-02", type: "feast", denominations: ["catholic", "orthodox"] },
  { name: "Hl. Josef", date: "03-19", type: "memorial", denominations: ["catholic"] },
  { name: "Verkündigung des Herrn", date: "03-25", type: "feast", denominations: [] },
  { name: "Hl. Johannes der Täufer", date: "06-24", type: "feast", denominations: ["catholic", "orthodox"] },
  { name: "Hl. Petrus und Paulus", date: "06-29", type: "feast", denominations: ["catholic", "orthodox"] },
  { name: "Verklärung des Herrn", date: "08-06", type: "feast", denominations: ["orthodox", "catholic"] },
  { name: "Mariä Himmelfahrt", date: "08-15", type: "feast", denominations: ["catholic", "orthodox"] },
  { name: "Allerheiligen", date: "11-01", type: "feast", denominations: ["catholic", "orthodox"] },
  { name: "Orthodoxes Weihnachten", date: "01-07", type: "feast", denominations: ["orthodox"] },
];

export const PRAYER_CATEGORIES = [
  { key: "gratitude", labelKey: "christian.journal.cat.gratitude" },
  { key: "intercession", labelKey: "christian.journal.cat.intercession" },
  { key: "petition", labelKey: "christian.journal.cat.petition" },
  { key: "confession", labelKey: "christian.journal.cat.confession" },
  { key: "praise", labelKey: "christian.journal.cat.praise" },
  { key: "other", labelKey: "christian.journal.cat.other" },
];