import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// Christian calendar events (seeded fixed feasts). Provides today's event and
// upcoming events, filterable by denomination (empty denomination_keys = all).
export function useChristianCalendar(denomination) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.entities.ChristianCalendarEvent.filter(
        { religion_key: "christianity" },
        { limit: 200, sort: "date" }
      );
      setEvents(res.items || []);
    } catch (e) {
      console.error("Failed to load christian calendar", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const applies = useCallback(
    (ev) => !ev.denomination_keys?.length || ev.denomination_keys.includes(denomination),
    [denomination]
  );

  const monthDay = (dateStr) => dateStr?.slice(5); // "MM-DD"

  const todayMonthDay = new Date().toISOString().slice(5, 10);

  const todaysEvent = events.find((ev) => applies(ev) && monthDay(ev.date) === todayMonthDay);

  const today = new Date();
  const upcoming = events
    .filter(applies)
    .filter((ev) => {
      const evDate = new Date(new Date().getFullYear(), Number(monthDay(ev.date)?.slice(0, 2)) - 1, Number(monthDay(ev.date)?.slice(3, 5)));
      return evDate >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
    })
    .sort((a, b) => monthDay(a.date).localeCompare(monthDay(b.date)))
    .slice(0, 6);

  return { events, loading, todaysEvent, upcoming, reload: load };
}