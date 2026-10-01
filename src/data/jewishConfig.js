// Judaism module configuration. Public-domain factual metadata only:
// the weekly Torah portions (parashiyot), default prayer service slots,
// denomination-specific module toggles and the major holidays used to
// seed the calendar. No copyrighted Hebrew text is stored.

import { gregorianToHebrew, hebrewToGregorian } from "@/lib/jewish/hebrewDate";

// Default daily prayer services (Shacharit / Mincha / Maariv). Users can add
// custom slots (e.g. Musaf on Shabbat) in settings.
export const DEFAULT_PRAYER_SLOTS = [
  { key: "shacharit", labelKey: "jewish.prayer.shacharit", time: "07:00", reminder_enabled: true, custom: false },
  { key: "mincha", labelKey: "jewish.prayer.mincha", time: "13:30", reminder_enabled: false, custom: false },
  { key: "maariv", labelKey: "jewish.prayer.maariv", time: "20:00", reminder_enabled: true, custom: false },
];

// Shabbat preparation checklist shown on the home + Shabbat card.
export const SHABBAT_CHECKLIST = [
  { key: "preparation", labelKey: "jewish.shabbat.checklist.preparation" },
  { key: "candles", labelKey: "jewish.shabbat.checklist.candles" },
  { key: "meal", labelKey: "jewish.shabbat.checklist.meal" },
  { key: "service", labelKey: "jewish.shabbat.checklist.service" },
  { key: "rest", labelKey: "jewish.shabbat.checklist.rest" },
];

// Modules shown per denomination. An empty `denominations` array means the
// module is shared by all Jewish denominations. No tradition is framed as
// "more correct" — these are configurable content toggles.
export const JEWISH_FEATURES = [
  { key: "prayer", labelKey: "jewish.feature.prayer", order: 1, denominations: [] },
  { key: "shabbat", labelKey: "jewish.feature.shabbat", order: 2, denominations: [] },
  { key: "torah", labelKey: "jewish.feature.torah", order: 3, denominations: [] },
  { key: "holidays", labelKey: "jewish.feature.holidays", order: 4, denominations: [] },
  { key: "fasting", labelKey: "jewish.feature.fasting", order: 5, denominations: [] },
  { key: "tefillin", labelKey: "jewish.feature.tefillin", order: 6, denominations: ["judaism_orthodox", "masorti"] },
  { key: "mikveh", labelKey: "jewish.feature.mikveh", order: 7, denominations: ["judaism_orthodox", "masorti"] },
  { key: "kashrut", labelKey: "jewish.feature.kashrut", order: 8, denominations: ["judaism_orthodox", "masorti", "reform"] },
];

export function featuresForDenomination(denomKey) {
  return JEWISH_FEATURES.filter(
    (f) => !f.denominations.length || f.denominations.includes(denomKey)
  ).sort((a, b) => a.order - b.order);
}

export function hasFeature(denomKey, featureKey) {
  const f = JEWISH_FEATURES.find((x) => x.key === featureKey);
  if (!f) return false;
  return !f.denominations.length || f.denominations.includes(denomKey);
}

// Torah reading cycle — the 54 weekly parashiyot (public-domain names).
// In leap years some are doubled; this list covers the annual cycle.
export const PARASHIYOT = [
  "Bereshit", "Noach", "Lech Lecha", "Vayera", "Chayei Sara", "Toldot",
  "Vayetzei", "Vayishlach", "Vayeshev", "Miketz", "Vayigash", "Vayechi",
  "Shemot", "Vaera", "Bo", "Beshalach", "Yitro", "Mishpatim", "Terumah",
  "Tetzaveh", "Ki Tisa", "Vayakhel", "Pekudei", "Vayikra", "Tzav",
  "Shemini", "Tazria", "Metzora", "Acharei Mot", "Kedoshim", "Emor",
  "Behar", "Bechukotai", "Bamidbar", "Naso", "Beha'alotcha", "Shlach",
  "Korach", "Chukat", "Balak", "Pinchas", "Matot", "Masei", "Devarim",
  "Vaetchanan", "Eikev", "Re'eh", "Shoftim", "Ki Teitzei", "Ki Tavo",
  "Nitzavim", "Vayeilech", "Ha'azinu", "V'Zot HaBrachah",
];

export function parashaForDate(date) {
  // Approximate: the cycle restarts on Simchat Torah (Tishrei 23). We map the
  // day-of-year to a parasha index for a gentle, non-binding hint.
  const h = gregorianToHebrew(date);
  const cycleStart = hebrewToGregorian(h.year, 7, 23);
  let dayIndex = Math.round((date - cycleStart) / 86400000);
  if (dayIndex < 0) dayIndex += 365;
  const weekIndex = Math.floor(dayIndex / 7);
  return {
    parasha: PARASHIYOT[weekIndex % PARASHIYOT.length],
    parashaIndex: (weekIndex % PARASHIYOT.length) + 1,
  };
}

// Torah books of the Tanakh (German names, chapter counts for a gentle
// reading-progress tracker).
export const TORAH_BOOKS = [
  { n: 1, name: "Genesis (Bereshit)", chapters: 50 },
  { n: 2, name: "Exodus (Schemot)", chapters: 40 },
  { n: 3, name: "Levitikus (Wajikra)", chapters: 27 },
  { n: 4, name: "Numeri (Bemidbar)", chapters: 36 },
  { n: 5, name: "Deuteronium (Dewarim)", chapters: 34 },
];

export const TORAH_TOTAL_CHAPTERS = TORAH_BOOKS.reduce((s, b) => s + b.chapters, 0); // 187

// Tanakh reading plans.
export const TORAH_READING_PLANS = [
  { key: "parasha_yearly", labelKey: "jewish.torah.plan.parasha_yearly" },
  { key: "tanakh_year", labelKey: "jewish.torah.plan.tanakh_year" },
  { key: "daf_yomi", labelKey: "jewish.torah.plan.daf_yomi" },
  { key: "free", labelKey: "jewish.torah.plan.free" },
];