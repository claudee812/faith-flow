import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSettings } from "@/context/SettingsContext";

// Loads (and seeds) the current user's PrayerSettings — calculation method,
// Asr madhhab and the location used to compute prayer times.
export function usePrayerSettings() {
  const { user } = useAuth();
  const { settings: userSettings } = useSettings();
  const [prayerSettings, setPrayerSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.PrayerSettings.filter({ user_id: user.id }, { limit: 1 });
      let existing = res.items && res.items[0];
      if (!existing) {
        existing = await base44.entities.PrayerSettings.create({
          user_id: user.id,
          calc_method: "MWL",
          asr_madhhab: "shafi",
          latitude: typeof userSettings?.latitude === "number" ? userSettings.latitude : null,
          longitude: typeof userSettings?.longitude === "number" ? userSettings.longitude : null,
          timezone: userSettings?.timezone || "",
          location_name: userSettings?.manual_location || "",
          reminder_offset_min: 10,
        });
      }
      setPrayerSettings(existing);
    } catch (e) {
      console.error("Failed to load prayer settings", e);
    } finally {
      setLoading(false);
    }
  }, [user, userSettings]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (patch) => {
      if (!prayerSettings) return null;
      const updated = await base44.entities.PrayerSettings.update(prayerSettings.id, patch);
      setPrayerSettings(updated);
      return updated;
    },
    [prayerSettings]
  );

  return { prayerSettings, loading, update, reload: load };
}