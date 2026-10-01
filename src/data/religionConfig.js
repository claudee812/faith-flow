// Central source of truth for religions and their denominations.
// Used by onboarding, the theme system, navigation and (via seeding) the
// Religion / Denomination entities. Add a new religion here and it flows
// through the whole app — no page-level hardcoding.

export const RELIGIONS = [
  {
    key: "islam",
    name: "Islam",
    name_translations: { de: "Islam", en: "Islam", ar: "الإسلام", he: "אסלאם" },
    description: "Gebet, Fastenzeiten und der Mondkalender im Zentrum.",
    theme_key: "islam",
    icon: "MoonStar",
    accent_symbol: "crescent",
    order: 1,
  },
  {
    key: "christianity",
    name: "Christentum",
    name_translations: { de: "Christentum", en: "Christianity", ar: "المسيحية", he: "נצרות" },
    description: "Liturgischer Jahreskreis, Licht und Stille.",
    theme_key: "christianity",
    icon: "Church",
    accent_symbol: "cross",
    order: 2,
  },
  {
    key: "judaism",
    name: "Judentum",
    name_translations: { de: "Judentum", en: "Judaism", ar: "اليهودية", he: "יהדות" },
    description: "Hebräischer Kalender, Torah-Lesen und Erinnerung.",
    theme_key: "judaism",
    icon: "StarOfDavid",
    accent_symbol: "star",
    order: 3,
  },
  {
    key: "other",
    name: "Weitere Religionen",
    name_translations: { de: "Weitere Religionen", en: "Other religions", ar: "ديانات أخرى", he: "דתות אחרות" },
    description: "Spirituelle Routinen, religionsneutral begleitet.",
    theme_key: "islam",
    icon: "Sparkles",
    accent_symbol: "spark",
    order: 4,
  },
];

export const DENOMINATIONS = [
  // Islam
  { key: "sunni", religion_key: "islam", name: "Sunnitisch", name_translations: { de: "Sunnitisch", en: "Sunni", ar: "سني", he: "סוני" }, order: 1 },
  { key: "shia", religion_key: "islam", name: "Schiitisch", name_translations: { de: "Schiitisch", en: "Shia", ar: "شيعي", he: "שיעי" }, order: 2 },
  { key: "islam_other", religion_key: "islam", name: "Andere", name_translations: { de: "Andere", en: "Other", ar: "أخرى", he: "אחר" }, order: 3 },
  // Christianity
  { key: "catholic", religion_key: "christianity", name: "Katholisch", name_translations: { de: "Katholisch", en: "Catholic", ar: "كاثوليكي", he: "קתולי" }, order: 1 },
  { key: "orthodox", religion_key: "christianity", name: "Orthodox", name_translations: { de: "Orthodox", en: "Orthodox", ar: "أرثوذكس", he: "אורתודוקסי" }, order: 2 },
  { key: "protestant", religion_key: "christianity", name: "Evangelisch / Protestantisch", name_translations: { de: "Evangelisch / Protestantisch", en: "Protestant", ar: "بروتستانتي", he: "פרוטסטנטי" }, order: 3 },
  { key: "anglican", religion_key: "christianity", name: "Anglikanisch", name_translations: { de: "Anglikanisch", en: "Anglican", ar: "أنجليكاني", he: "אנגליקני" }, order: 4 },
  { key: "free_church", religion_key: "christianity", name: "Freikirchlich", name_translations: { de: "Freikirchlich", en: "Free church", ar: "كنيسة حرة", he: "כנסייה חופשית" }, order: 5 },
  { key: "christianity_other", religion_key: "christianity", name: "Andere", name_translations: { de: "Andere", en: "Other", ar: "أخرى", he: "אחר" }, order: 6 },
  // Judaism
  { key: "judaism_orthodox", religion_key: "judaism", name: "Orthodox", name_translations: { de: "Orthodox", en: "Orthodox", ar: "أرثوذكسي", he: "אורתודוקסי" }, order: 1 },
  { key: "masorti", religion_key: "judaism", name: "Konservativ / Masorti", name_translations: { de: "Konservativ / Masorti", en: "Conservative / Masorti", ar: "محافظ / ماسورتي", he: "מסורתי / קונסרבטיבי" }, order: 2 },
  { key: "reform", religion_key: "judaism", name: "Reform", name_translations: { de: "Reform", en: "Reform", ar: "إصلاحي", he: "רפורמי" }, order: 3 },
  { key: "reconstructionist", religion_key: "judaism", name: "Rekonstruktionistisch", name_translations: { de: "Rekonstruktionistisch", en: "Reconstructionist", ar: "إعادة بناء", he: "רקונסטרוקציוניסטי" }, order: 4 },
  { key: "judaism_other", religion_key: "judaism", name: "Andere", name_translations: { de: "Andere", en: "Other", ar: "أخرى", he: "אחר" }, order: 5 },
  // Other — neutral
  { key: "other_neutral", religion_key: "other", name: "Spirituell / Allgemein", name_translations: { de: "Spirituell / Allgemein", en: "Spiritual / General", ar: "روحاني / عام", he: "רוחני / כללי" }, order: 1 },
];

export const getReligion = (key) => RELIGIONS.find((r) => r.key === key);
export const getDenominations = (religionKey) =>
  DENOMINATIONS.filter((d) => d.religion_key === religionKey).sort((a, b) => a.order - b.order);
export const getDenomination = (key) => DENOMINATIONS.find((d) => d.key === key);