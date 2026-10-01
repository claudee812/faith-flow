import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Loads the user's latest Qur'an reading progress record (or none). Creating is
// deferred until the user actually sets a bookmark / updates progress.
export function useQuranProgress() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.QuranProgress.filter(
        { user_id: user.id },
        { sort: "-last_read_date", limit: 1 }
      );
      setRecord(res.items && res.items[0] ? res.items[0] : null);
    } catch (e) {
      console.error("Failed to load Qur'an progress", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureRecord = useCallback(async () => {
    if (record) return record;
    const created = await base44.entities.QuranProgress.create({
      user_id: user.id,
      surah_number: 1,
      surah_name: "Al-Fātiḥa",
      ayah_number: 1,
      last_read_date: todayStr(),
      progress_percent: 0,
      daily_goal_pages: 1,
      notes: "",
      bookmarked: false,
    });
    setRecord(created);
    return created;
  }, [record, user]);

  const update = useCallback(
    async (patch) => {
      const base = await ensureRecord();
      const updated = await base44.entities.QuranProgress.update(base.id, {
        ...patch,
        last_read_date: todayStr(),
      });
      setRecord(updated);
      return updated;
    },
    [ensureRecord]
  );

  return { record, loading, update, reload: load };
}