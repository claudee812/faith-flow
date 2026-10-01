// Mock data for the Home page. Every entry is flagged with `mock: true` so it
// can be swapped for real data sources (entities / religious-calendar engine)
// in later steps without touching the UI components.

export const mockNextEvent = {
  mock: true,
  title: "Mawlid an-Nabī",
  subtitle: "Geburt des Propheten",
  date: "In 4 Tagen",
  detail: "Abends · 12 Rabīʿ al-Awwal",
};

export const mockDailyProgress = {
  mock: true,
  label: "Tagesfortschritt",
  completed: 3,
  total: 5,
  items: [
    { label: "Morgengebet", done: true },
    { label: "Tagesgebet", done: true },
    { label: "Abendgebet", done: true },
    { label: "Lesung", done: false },
    { label: "Reflexion", done: false },
  ],
};

export const mockGoals = {
  mock: true,
  items: [
    { title: "Quran täglich lesen", progress: 62, unit: "%" },
    { title: "30 Tage Dhikr", progress: 80, unit: "%" },
  ],
};

export const mockUpcoming = {
  mock: true,
  items: [
    { title: "Freitagsgebet", when: "Freitag · 13:15" },
    { title: "Fastenmontag", when: "Mo · Sonnenaufgang" },
    { title: "Mawlid an-Nabī", when: "In 4 Tagen" },
  ],
};

// A religion-aware label for the current religious date.
export function mockReligiousDate(religionKey) {
  const map = {
    islam: "12 Rabīʿ al-Awwal 1448 H",
    christianity: "Dienstag, 20. Woche im Jahreskreis",
    judaism: "14 Tishrei 5787",
    other: "—",
  };
  return { mock: true, value: map[religionKey] || map.other };
}