import { useCallback, useEffect, useMemo, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
// Returns the date string of the current (or next) Friday.
export function currentFridayStr() {
  const d = new Date();
  const day = d.getDay(); // 0 Sun … 6 Sat
  const diff = day <= 5 ? 5 - day : 5 - day + 7;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}
export function isTodayFriday() {
  return new Date().getDay() === 5;
}

// Loads (and lazily creates) the Jumu'ah record for the relevant Friday.
export function useJumuahEvent() {
  const { user } = useAuth();
  const friday = useMemo(() => currentFridayStr(), []);
  const todayIsFriday = isTodayFriday();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await base44.entities.JumuahEvent.filter(
        { user_id: user.id, date: friday },
        { limit: 1 }
      );
      setRecord(res.items && res.items[0] ? res.items[0] : null);
    } catch (e) {
      console.error("Failed to load Jumu'ah", e);
    } finally {
      setLoading(false);
    }
  }, [user, friday]);

  useEffect(() => {
    load();
  }, [load]);

  const ensureRecord = useCallback(async () => {
    if (record) return record;
    const created = await base44.entities.JumuahEvent.create({
      user_id: user.id,
      date: friday,
      checklist_preparation: false,
      checklist_clothing: false,
      checklist_leave: false,
      checklist_attended: false,
      mosque_name: "",
      reminder_enabled: true,
    });
    setRecord(created);
    return created;
  }, [record, user, friday]);

  const update = useCallback(
    async (patch) => {
      const base = await ensureRecord();
      const updated = await base44.entities.JumuahEvent.update(base.id, patch);
      setRecord(updated);
      return updated;
    },
    [ensureRecord]
  );

  const toggleCheck = useCallback(
    (key) => {
      const field = `checklist_${key}`;
      if (!record) {
        return update({ [field]: true });
      }
      return update({ [field]: !record[field] });
    },
    [record, update]
  );

  return { record, loading, friday, todayIsFriday, update, toggleCheck };
}