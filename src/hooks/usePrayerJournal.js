import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Private prayer journal: list, create, update, delete, mark answered.
export function usePrayerJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.PrayerJournal.filter(
        { user_id: user.id },
        { sort: "-created_date", limit: 50 }
      );
      setEntries(res.items || []);
    } catch (e) {
      console.error("Failed to load prayer journal", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (data) => {
      if (!user) return null;
      const created = await base44.entities.PrayerJournal.create({
        user_id: user.id,
        date: todayStr(),
        ...data,
      });
      setEntries((prev) => [created, ...prev]);
      return created;
    },
    [user]
  );

  const update = useCallback(async (id, patch) => {
    const updated = await base44.entities.PrayerJournal.update(id, patch);
    setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await base44.entities.PrayerJournal.delete(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { entries, loading, create, update, remove, reload: load };
}