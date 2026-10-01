import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { DEFAULT_PRAYER_SLOTS } from "@/data/jewishConfig";

// Loads (or seeds) the user's editable Jewish prayer routine slots.
export function useJewishPrayerSettings() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.JewishPrayerSettings.filter(
        { user_id: user.id },
        { limit: 1 }
      );
      let existing = res.items && res.items[0];
      if (!existing) {
        existing = await base44.entities.JewishPrayerSettings.create({
          user_id: user.id,
          slots: DEFAULT_PRAYER_SLOTS,
        });
      }
      setRecord(existing);
    } catch (e) {
      console.error("Failed to load Jewish prayer settings", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (patch) => {
      if (!user || !record) return;
      try {
        const updated = await base44.entities.JewishPrayerSettings.update(record.id, patch);
        setRecord(updated);
        return updated;
      } catch (e) {
        console.error("Failed to save Jewish prayer settings", e);
      }
    },
    [user, record]
  );

  return { record, loading, slots: record?.slots || DEFAULT_PRAYER_SLOTS, update, reload: load };
}