import React, { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getUpcomingHolidays } from "@/lib/jewish/jewishHolidays";
import { formatHebrewDate } from "@/lib/jewish/hebrewDate";
import { EmptyState } from "@/components/StateViews";

function fmt(date) {
  return date.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// Jewish calendar: the Hebrew date and an upcoming-holidays list spanning
// the next ~12 months.
export default function JewishCalendar() {
  const { t } = useSettings();
  const now = new Date();
  const hd = formatHebrewDate(now);
  const holidays = useMemo(() => getUpcomingHolidays(now, 40), []);

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">{t("nav.calendar")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{hd.full}</p>

      <div className="rounded-[1.5rem] border border-border/60 bg-card p-5 mb-5">
        <p className="text-xs text-muted-foreground mb-1">{t("jewish.hebrewDate")}</p>
        <p className="font-display text-xl font-semibold text-foreground">{hd.full}</p>
        <p className="mt-1 text-sm text-muted-foreground">{now.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <h2 className="font-display text-lg font-bold text-foreground mb-3">{t("jewish.calendar.upcoming")}</h2>
      {holidays.length === 0 ? (
        <EmptyState icon={CalendarDays} title={t("jewish.calendar.empty")} />
      ) : (
        <div className="grid gap-3">
          {holidays.map((ev) => (
            <div key={`${ev.name}-${ev.hebrewYear}`} className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{ev.name}</span>
                {ev.type === "fast" && (
                  <span className="rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
                    {t("jewish.holidays.fast")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {fmt(ev.gregorianStart)}
                {ev.durationDays > 1 && ` – ${fmt(ev.gregorianEnd)}`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}