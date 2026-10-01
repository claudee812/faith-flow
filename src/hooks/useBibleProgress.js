import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Loads the user's Bible reading progress (single record), creating it lazily.
export function useBibleProgress() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.BibleProgress.filter({ user_id: user.id }, { limit: 1 });
      setRecord(res.items && res.items[0] ? res.items[0] : null);
    } catch (e) {
      console.error("Failed to load Bible progress", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureRecord = useCallback(async () => {
    if (record) return record;
    const created = await base44.entities.BibleProgress.create({
      user_id: user.id,
      book: "Matthäus",
      book_index: 40,
      chapter: 1,
      chapters_in_book: 28,
      chapters_read: 0,
      last_read_date: todayStr(),
      progress_percent: 0,
      daily_goal_chapters: 1,
      reading_plan: "free",
      notes: "",
      bookmarked: false,
    });
    setRecord(created);
    return created;
  }, [record, user]);

  const update = useCallback(
    async (patch) => {
      const base = await ensureRecord();
      const updated = await base44.entities.BibleProgress.update(base.id, {
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