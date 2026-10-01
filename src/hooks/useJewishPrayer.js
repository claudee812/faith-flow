import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const PRAYER_KEYS = ["shacharit", "mincha", "maariv", "musaf"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function daysAgoStr(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Tracks the daily Jewish prayer services for today + week/month counts.
// Each completed service is a JewishPrayer record; toggling creates/deletes.
export function useJewishPrayer() {
  const { user } = useAuth();
  const today = todayStr();
  const [logs, setLogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [weekCount, setWeekCount] = useState(0);
  const [monthCount, setMonthCount] = useState(0);

  const refreshCounts = useCallback(async () => {
    if (!user) return;
    try {
      const [w, m] = await Promise.all([
        base44.entities.JewishPrayer.count({
          user_id: user.id,
          date: { $gte: daysAgoStr(6), $lte: today },
        }),
        base44.entities.JewishPrayer.count({
          user_id: user.id,
          date: { $gte: daysAgoStr(29), $lte: today },
        }),
      ]);
      setWeekCount(w || 0);
      setMonthCount(m || 0);
    } catch (e) {
      console.error("Failed to count Jewish prayers", e);
    }
  }, [user, today]);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.JewishPrayer.filter(
        { user_id: user.id, date: today },
        { limit: 50 }
      );
      const map = {};
      (res.items || []).forEach((it) => {
        map[it.prayer_key] = it;
      });
      setLogs(map);
      await refreshCounts();
    } catch (e) {
      console.error("Failed to load Jewish prayer log", e);
    } finally {
      setLoading(false);
    }
  }, [user, today, refreshCounts]);

  useEffect(() => {
    load();
  }, [load]);

  const toggle = useCallback(
    async (prayerKey) => {
      if (!user) return;
      const existing = logs[prayerKey];
      try {
        if (existing) {
          await base44.entities.JewishPrayer.delete(existing.id);
          setLogs((prev) => {
            const n = { ...prev };
            delete n[prayerKey];
            return n;
          });
        } else {
          const created = await base44.entities.JewishPrayer.create({
            user_id: user.id,
            date: today,
            prayer_key: prayerKey,
            completed: true,
            completed_at: new Date().toISOString(),
          });
          setLogs((prev) => ({ ...prev, [prayerKey]: created }));
        }
        await refreshCounts();
      } catch (e) {
        console.error("Failed to toggle Jewish prayer", e);
      }
    },
    [logs, user, today, refreshCounts]
  );

  const doneCount = PRAYER_KEYS.filter((k) => logs[k]).length;

  return { logs, loading, toggle, doneCount, total: 3, weekCount, monthCount, reload: load, prayerKeys: PRAYER_KEYS };
}