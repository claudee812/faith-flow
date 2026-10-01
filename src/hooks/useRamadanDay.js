import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { isRamadanActive, ramadanDayNumber } from "@/lib/prayer/hijriDate";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Loads (and lazily creates) the RamadanDay record for today.
export function useRamadanDay() {
  const { user } = useAuth();
  const today = todayStr();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const active = isRamadanActive(new Date());
  const dayNumber = ramadanDayNumber(new Date());

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.RamadanDay.filter(
        { user_id: user.id, date: today },
        { limit: 1 }
      );
      setRecord(res.items && res.items[0] ? res.items[0] : null);
    } catch (e) {
      console.error("Failed to load Ramadan day", e);
    } finally {
      setLoading(false);
    }
  }, [user, today]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureRecord = useCallback(async () => {
    if (record) return record;
    const created = await base44.entities.RamadanDay.create({
      user_id: user.id,
      date: today,
      ramadan_day_number: dayNumber || 0,
      fast_status: "not_started",
      prayers_completed: 0,
      tarawih: false,
      quran_pages: 0,
      dhikr_count: 0,
      sadaqah: false,
    });
    setRecord(created);
    return created;
  }, [record, user, today, dayNumber]);

  const update = useCallback(
    async (patch) => {
      const base = await ensureRecord();
      const updated = await base44.entities.RamadanDay.update(base.id, patch);
      setRecord(updated);
      return updated;
    },
    [ensureRecord]
  );

  return { record, loading, active, dayNumber, update, reload: load };
}