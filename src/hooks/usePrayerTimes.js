import { useMemo, useState, useEffect } from "react";
import { getPrayerTimes, MOCK_TIMES, buildSchedule, tzOffsetFor } from "@/lib/prayer/prayerTimes";
import { usePrayerSettings } from "./usePrayerSettings";

// Returns today's prayer times (computed or mock), the next prayer, per-prayer
// statuses and a live countdown. Refreshes every 30s so the countdown and
// "next prayer" stay current.
export function usePrayerTimes() {
  const { prayerSettings } = usePrayerSettings();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const lat = prayerSettings?.latitude;
    const lng = prayerSettings?.longitude;
    const tz = prayerSettings?.timezone || "";
    const method = prayerSettings?.calc_method || "MWL";
    const madhhab = prayerSettings?.asr_madhhab || "shafi";
    const hasCoords = typeof lat === "number" && typeof lng === "number";

    let times;
    let source;
    if (hasCoords) {
      times = getPrayerTimes({
        date: now,
        latitude: lat,
        longitude: lng,
        timezone: tz,
        calcMethod: method,
        asrMadhhab: madhhab,
        tzOffsetHours: tzOffsetFor(now, tz),
      });
      source = "calc";
    } else {
      times = { ...MOCK_TIMES };
      source = "mock";
    }

    const schedule = buildSchedule(times, now);
    return {
      times,
      source,
      method,
      madhhab,
      nextPrayer: {
        key: schedule.nextKey,
        time: schedule.nextTime,
        date: schedule.nextDate,
        countdown: schedule.countdown,
      },
      statuses: schedule.statuses,
      currentKey: schedule.currentKey,
    };
  }, [prayerSettings, now]);
}