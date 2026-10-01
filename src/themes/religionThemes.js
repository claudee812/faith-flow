// Three genuinely distinct design systems, keyed by religion.
// Each defines a light + dark palette (HSL channels for Tailwind tokens),
// a signature radius, a display font, and a motif identifier.
// Applied dynamically to :root by SettingsContext — see applyTheme().

const base = {
  // values shared across themes where it makes sense
};

export const religionThemes = {
  islam: {
    label: "Islam",
    radius: "1.4rem",
    fontDisplay: '"Amiri", "Plus Jakarta Sans", serif',
    motif: "arabesque",
    light: {
      background: "42 30% 97%",
      foreground: "158 18% 14%",
      card: "40 36% 99%",
      popover: "40 36% 99%",
      primary: "152 40% 30%",
      primaryForeground: "40 40% 98%",
      secondary: "42 24% 93%",
      secondaryForeground: "158 18% 16%",
      muted: "42 22% 94%",
      mutedForeground: "150 12% 40%",
      accent: "38 58% 52%",
      accentForeground: "30 30% 18%",
      border: "150 14% 88%",
      input: "150 14% 88%",
      ring: "152 40% 30%",
      chart1: "152 45% 40%",
      chart2: "38 58% 52%",
      chart3: "180 30% 35%",
      chart4: "200 40% 50%",
      chart5: "45 50% 55%",
    },
    dark: {
      background: "158 22% 8%",
      foreground: "40 30% 95%",
      card: "158 18% 11%",
      popover: "158 18% 12%",
      primary: "152 46% 46%",
      primaryForeground: "158 30% 8%",
      secondary: "158 14% 16%",
      secondaryForeground: "40 25% 95%",
      muted: "158 14% 14%",
      mutedForeground: "40 20% 65%",
      accent: "38 62% 58%",
      accentForeground: "30 30% 12%",
      border: "158 14% 20%",
      input: "158 14% 20%",
      ring: "152 46% 46%",
      chart1: "152 46% 46%",
      chart2: "38 62% 58%",
      chart3: "180 30% 42%",
      chart4: "200 40% 55%",
      chart5: "45 55% 60%",
    },
  },
  christianity: {
    label: "Christentum",
    radius: "1.15rem",
    fontDisplay: '"Cormorant Garamond", "Plus Jakarta Sans", serif',
    motif: "light",
    light: {
      background: "36 50% 97%",
      foreground: "350 30% 14%",
      card: "36 56% 99%",
      popover: "36 56% 99%",
      primary: "348 52% 38%",
      primaryForeground: "36 50% 98%",
      secondary: "36 40% 93%",
      secondaryForeground: "350 28% 18%",
      muted: "36 38% 94%",
      mutedForeground: "350 18% 42%",
      accent: "38 70% 54%",
      accentForeground: "20 40% 20%",
      border: "30 30% 88%",
      input: "30 30% 88%",
      ring: "348 52% 38%",
      chart1: "348 52% 48%",
      chart2: "38 70% 54%",
      chart3: "210 55% 50%",
      chart4: "28 60% 55%",
      chart5: "320 40% 55%",
    },
    dark: {
      background: "350 24% 8%",
      foreground: "36 40% 95%",
      card: "350 22% 11%",
      popover: "350 22% 12%",
      primary: "348 56% 54%",
      primaryForeground: "350 30% 8%",
      secondary: "350 18% 16%",
      secondaryForeground: "36 40% 95%",
      muted: "350 18% 14%",
      mutedForeground: "36 25% 65%",
      accent: "38 70% 58%",
      accentForeground: "20 40% 12%",
      border: "350 18% 20%",
      input: "350 18% 20%",
      ring: "348 56% 54%",
      chart1: "348 56% 56%",
      chart2: "38 70% 58%",
      chart3: "210 55% 58%",
      chart4: "28 60% 60%",
      chart5: "320 45% 62%",
    },
  },
  judaism: {
    label: "Judentum",
    radius: "1rem",
    fontDisplay: '"Frank Ruhl Libre", "Plus Jakarta Sans", serif',
    motif: "star",
    light: {
      background: "40 36% 96%",
      foreground: "220 35% 14%",
      card: "40 44% 99%",
      popover: "40 44% 99%",
      primary: "220 58% 34%",
      primaryForeground: "40 44% 98%",
      secondary: "42 30% 92%",
      secondaryForeground: "220 30% 18%",
      muted: "42 28% 93%",
      mutedForeground: "220 18% 42%",
      accent: "42 72% 50%",
      accentForeground: "30 40% 18%",
      border: "220 18% 86%",
      input: "220 18% 86%",
      ring: "220 58% 34%",
      chart1: "220 58% 40%",
      chart2: "42 72% 50%",
      chart3: "200 50% 45%",
      chart4: "35 60% 50%",
      chart5: "250 40% 55%",
    },
    dark: {
      background: "220 32% 7%",
      foreground: "40 35% 95%",
      card: "220 28% 10%",
      popover: "220 28% 11%",
      primary: "220 62% 58%",
      primaryForeground: "220 30% 8%",
      secondary: "220 20% 16%",
      secondaryForeground: "40 35% 95%",
      muted: "220 20% 14%",
      mutedForeground: "40 25% 65%",
      accent: "42 72% 58%",
      accentForeground: "30 40% 12%",
      border: "220 20% 20%",
      input: "220 20% 20%",
      ring: "220 62% 58%",
      chart1: "220 62% 58%",
      chart2: "42 72% 60%",
      chart3: "200 55% 58%",
      chart4: "35 65% 60%",
      chart5: "250 45% 62%",
    },
  },
};

// Fallback theme used before any religion is chosen (onboarding welcome).
export const defaultTheme = religionThemes.islam;

export const getTheme = (religionKey) =>
  religionThemes[religionKey] || defaultTheme;

// Map CSS token name -> theme palette key
const TOKEN_MAP = {
  "--background": "background",
  "--foreground": "foreground",
  "--card": "card",
  "--popover": "popover",
  "--primary": "primary",
  "--primary-foreground": "primaryForeground",
  "--secondary": "secondary",
  "--secondary-foreground": "secondaryForeground",
  "--muted": "muted",
  "--muted-foreground": "mutedForeground",
  "--accent": "accent",
  "--accent-foreground": "accentForeground",
  "--border": "border",
  "--input": "input",
  "--ring": "ring",
  "--chart-1": "chart1",
  "--chart-2": "chart2",
  "--chart-3": "chart3",
  "--chart-4": "chart4",
  "--chart-5": "chart5",
};

export function applyTheme(religionKey, darkMode) {
  const theme = getTheme(religionKey);
  const palette = darkMode ? theme.dark : theme.light;
  const root = document.documentElement;
  Object.entries(TOKEN_MAP).forEach(([token, key]) => {
    root.style.setProperty(token, palette[key]);
  });
  root.style.setProperty("--radius", theme.radius);
  root.style.setProperty("--font-display", theme.fontDisplay);
  root.style.setProperty("--font-heading", theme.fontDisplay);
  root.setAttribute("data-religion", religionKey);
  root.setAttribute("data-motif", theme.motif);
  if (darkMode) root.classList.add("dark");
  else root.classList.remove("dark");
}