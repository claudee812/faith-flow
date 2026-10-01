import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// The user's local congregation record: service time, community, reminder and
// a gentle weekly checklist. Lazily created on first interaction.
export function useChurchService() {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.ChurchService.filter({ user_id: user.id }, { limit: 1 });
      setRecord(res.items && res.items[0] ? res.items[0] : null);
    } catch (e) {
      console.error("Failed to load church service", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureRecord = useCallback(async () => {
    if (record) return record;
    const created = await base44.entities.ChurchService.create({
      user_id: user.id,
      day_of_week: "sun",
      service_time: "10:00",
      community_name: "",
      reminder_enabled: true,
      checklist_arrived: false,
      checklist_worship: false,
      checklist_fellowship: false,
      checklist_note: "",
      last_attended_date: null,
    });
    setRecord(created);
    return created;
  }, [record, user]);

  const update = useCallback(
    async (patch) => {
      const base = await ensureRecord();
      const updated = await base44.entities.ChurchService.update(base.id, patch);
      setRecord(updated);
      return updated;
    },
    [ensureRecord]
  );

  const toggleCheck = useCallback(
    (key) => {
      const field = `checklist_${key}`;
      if (!record) return update({ [field]: true });
      return update({ [field]: !record[field] });
    },
    [record, update]
  );

  const markAttended = useCallback(async () => {
    await update({ last_attended_date: todayStr(), checklist_arrived: true });
  }, [update]);

  return { record, loading, update, toggleCheck, markAttended, reload: load };
}