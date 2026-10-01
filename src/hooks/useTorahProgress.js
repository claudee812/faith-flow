import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Loads (or seeds) the user's Torah reading progress record.
export function useTorahProgress() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.TorahProgress.filter(
        { user_id: user.id },
        { limit: 1 }
      );
      let existing = res.items && res.items[0];
      if (!existing) {
        existing = await base44.entities.TorahProgress.create({
          user_id: user.id,
          parasha: "Bereshit",
          parasha_index: 1,
          book: "Genesis",
          chapter: 1,
          verse: 1,
          reading_plan: "parasha_yearly",
          daily_goal_verses: 10,
        });
      }
      setRecord(existing);
    } catch (e) {
      console.error("Failed to load Torah progress", e);
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
        const updated = await base44.entities.TorahProgress.update(record.id, patch);
        setRecord(updated);
        return updated;
      } catch (e) {
        console.error("Failed to update Torah progress", e);
      }
    },
    [user, record]
  );

  return { record, loading, update, reload: load };
}