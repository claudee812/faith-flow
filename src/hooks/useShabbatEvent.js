import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { fridayOf } from "@/lib/jewish/shabbatTimes";

function fridayStr(date) {
  return fridayOf(date).toISOString().slice(0, 10);
}

// Loads (or creates) the Shabbat checklist record for the current week.
export function useShabbatEvent() {
  const { user } = useAuth();
  const week = fridayStr(new Date());
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.ShabbatEvent.filter(
        { user_id: user.id, date: week },
        { limit: 1 }
      );
      let existing = res.items && res.items[0];
      if (!existing) {
        existing = await base44.entities.ShabbatEvent.create({
          user_id: user.id,
          date: week,
        });
      }
      setRecord(existing);
    } catch (e) {
      console.error("Failed to load Shabbat event", e);
    } finally {
      setLoading(false);
    }
  }, [user, week]);

  useEffect(() => {
    load();
  }, [load]);

  const update = useCallback(
    async (patch) => {
      if (!user || !record) return;
      try {
        const updated = await base44.entities.ShabbatEvent.update(record.id, patch);
        setRecord(updated);
        return updated;
      } catch (e) {
        console.error("Failed to update Shabbat event", e);
      }
    },
    [user, record]
  );

  const toggleCheck = useCallback(
    async (key) => {
      if (!record) return;
      await update({ [`checklist_${key}`]: !record[`checklist_${key}`] });
    },
    [record, update]
  );

  return { record, loading, update, toggleCheck, week };
}