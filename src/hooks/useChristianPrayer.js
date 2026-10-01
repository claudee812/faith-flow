import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { DEFAULT_PRAYER_SLOTS } from "@/data/christianConfig";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Christian prayer routine: editable slots (Morning/Noon/Evening + custom) and
// a per-day completion log. Mirrors the Islam prayer log pattern.
export function useChristianPrayer() {
  const { user } = useAuth();
  const today = todayStr();
  const [settings, setSettings] = useState(null);
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [weekCount, setWeekCount] = useState(0);

  const loadSettings = useCallback(async () => {
    if (!user) return;
    try {
      const res = await base44.entities.ChristianPrayerSettings.filter({ user_id: user.id }, { limit: 1 });
      let existing = res.items && res.items[0];
      if (!existing) {
        existing = await base44.entities.ChristianPrayerSettings.create({
          user_id: user.id,
          slots: DEFAULT_PRAYER_SLOTS.map((s) => ({ ...s })),
        });
      }
      setSettings(existing);
    } catch (e) {
      console.error("Failed to load prayer settings", e);
    }
  }, [user]);

  const refreshCounts = useCallback(async () => {
    if (!user) return;
    try {
      const w = await base44.entities.ChristianPrayer.count({
        user_id: user.id,
        date: { $gte: daysAgoStr(6), $lte: today },
      });
      setWeekCount(w || 0);
    } catch (e) {
      console.error("Failed to count prayers", e);
    }
  }, [user, today]);

  const loadLogs = useCallback(async () => {
    if (!user) return;
    try {
      const res = await base44.entities.ChristianPrayer.filter(
        { user_id: user.id, date: today },
        { limit: 50 }
      );
      const map = {};
      (res.items || []).forEach((it) => {
        map[it.slot_key] = it;
      });
      setLogs(map);
    } catch (e) {
      console.error("Failed to load prayer log", e);
    }
  }, [user, today]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadSettings();
      await loadLogs();
      await refreshCounts();
      setLoading(false);
    })();
  }, [loadSettings, loadLogs, refreshCounts]);

  const updateSettings = useCallback(
    async (patch) => {
      if (!settings) return null;
      const updated = await base44.entities.ChristianPrayerSettings.update(settings.id, patch);
      setSettings(updated);
      return updated;
    },
    [settings]
  );

  const addSlot = useCallback(
    async (label, time) => {
      const slots = settings?.slots || [];
      const slot = { key: `custom_${Date.now()}`, label, time, reminder_enabled: false, custom: true };
      await updateSettings({ slots: [...slots, slot] });
    },
    [settings, updateSettings]
  );

  const removeSlot = useCallback(
    async (key) => {
      const slots = (settings?.slots || []).filter((s) => s.key !== key);
      await updateSettings({ slots });
    },
    [settings, updateSettings]
  );

  const toggle = useCallback(
    async (slot) => {
      if (!user || !settings) return;
      const existing = logs[slot.key];
      try {
        if (existing) {
          await base44.entities.ChristianPrayer.delete(existing.id);
          setLogs((prev) => {
            const n = { ...prev };
            delete n[slot.key];
            return n;
          });
        } else {
          const created = await base44.entities.ChristianPrayer.create({
            user_id: user.id,
            date: today,
            slot_key: slot.key,
            label: slot.label || slot.key,
            time: slot.time || "",
            completed: true,
            completed_at: new Date().toISOString(),
          });
          setLogs((prev) => ({ ...prev, [slot.key]: created }));
        }
        await refreshCounts();
      } catch (e) {
        console.error("Failed to toggle prayer", e);
      }
    },
    [user, settings, logs, today, refreshCounts]
  );

  const slots = settings?.slots || [];
  const doneCount = slots.filter((s) => logs[s.key]).length;

  return {
    settings,
    slots,
    logs,
    loading,
    doneCount,
    total: slots.length,
    weekCount,
    toggle,
    addSlot,
    removeSlot,
    updateSettings,
    reload: loadLogs,
  };
}