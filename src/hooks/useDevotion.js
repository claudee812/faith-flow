import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Devotions: rosary decades, confession, daily office. A single entity covers
// several denomination-specific devotions; each is a small dated record.
export function useDevotion(type) {
  const { user } = useAuth();
  const [today, setToday] = useState(null);
  const [history, setHistory] = useState([]);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const res = await base44.entities.Devotion.filter(
        { user_id: user.id, type },
        { sort: "-date", limit: 30 }
      );
      const items = res.items || [];
      setHistory(items);
      setToday(items.find((d) => d.date === todayStr()) || null);
    } catch (e) {
      console.error("Failed to load devotion", e);
    }
  }, [user, type]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (data) => {
      if (!user) return null;
      const created = await base44.entities.Devotion.create({
        user_id: user.id,
        type,
        date: todayStr(),
        count: 1,
        ...data,
      });
      setHistory((prev) => [created, ...prev]);
      setToday(created);
      return created;
    },
    [user, type]
  );

  const setCount = useCallback(
    async (count, detail) => {
      if (!user) return;
      if (today) {
        const updated = await base44.entities.Devotion.update(today.id, { count, detail: detail ?? today.detail });
        setToday(updated);
        setHistory((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      } else {
        await add({ count, detail });
      }
    },
    [user, today, add]
  );

  // Last confession date helper (for the confession reminder card).
  const lastDate = history.length ? history[0].date : null;

  return { today, history, lastDate, add, setCount, reload: load };
}