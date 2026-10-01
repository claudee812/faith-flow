import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { applyTheme, getTheme } from "@/themes/religionThemes";
import { translations, getDir } from "@/i18n/translations";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user, isAuthenticated, authChecked } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  // Live religion driving the theme. Defaults to a neutral preview until the
  // user picks one in onboarding; syncs to the saved religion afterwards.
  const [themeReligion, setThemeReligion] = useState("islam");
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("de");

  // Load the current user's settings once authed.
  useEffect(() => {
    if (!authChecked || !isAuthenticated || !user) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const res = await base44.entities.UserSettings.filter(
          { user_id: user.id },
          { limit: 1 }
        );
        const existing = res.items && res.items[0];
        if (!active) return;
        if (existing) {
          setSettings(existing);
          setThemeReligion(existing.religion || "islam");
          setDarkMode(!!existing.dark_mode);
          setLanguage(existing.language || "de");
        } else {
          setSettings(null);
        }
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [authChecked, isAuthenticated, user]);

  // Apply theme + dir + lang whenever the relevant state changes.
  useEffect(() => {
    applyTheme(themeReligion, darkMode);
  }, [themeReligion, darkMode]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = getDir(language);
  }, [language]);

  const isOnboarded = !!(settings && settings.onboarding_complete);

  const persistSettings = useCallback(
    async (patch) => {
      if (!user) return null;
      try {
        if (settings) {
          const updated = await base44.entities.UserSettings.update(settings.id, patch);
          setSettings(updated);
          return updated;
        } else {
          const created = await base44.entities.UserSettings.create({
            user_id: user.id,
            onboarding_complete: false,
            ...patch,
          });
          setSettings(created);
          return created;
        }
      } catch (e) {
        console.error("Failed to save settings", e);
        throw e;
      }
    },
    [user, settings]
  );

  // Update a single field (or several) and persist.
  const updateSettings = useCallback(
    async (patch) => {
      const updated = await persistSettings(patch);
      if (patch.religion) setThemeReligion(patch.religion);
      if (typeof patch.dark_mode === "boolean") setDarkMode(patch.dark_mode);
      if (patch.language) setLanguage(patch.language);
      return updated;
    },
    [persistSettings]
  );

  const toggleDarkMode = useCallback(async () => {
    const next = !darkMode;
    setDarkMode(next);
    if (settings) await persistSettings({ dark_mode: next });
  }, [darkMode, settings, persistSettings]);

  const changeLanguage = useCallback(
    async (lang) => {
      setLanguage(lang);
      if (settings) await persistSettings({ language: lang });
    },
    [settings, persistSettings]
  );

  const t = useCallback(
    (key) => {
      const dict = translations[language] || translations.de;
      return dict[key] || translations.de[key] || key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      settings,
      loading,
      isOnboarded,
      themeReligion,
      setThemeReligion,
      darkMode,
      toggleDarkMode,
      language,
      setLanguage: changeLanguage,
      t,
      dir: getDir(language),
      updateSettings,
      persistSettings,
    }),
    [settings, loading, isOnboarded, themeReligion, darkMode, language, t, updateSettings, persistSettings, toggleDarkMode, changeLanguage]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}