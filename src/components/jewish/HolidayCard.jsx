import React from "react";
import { CalendarHeart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { getUpcomingHolidays, daysUntilNextHoliday } from "@/lib/jewish/jewishHolidays";
import { holidayOnDate } from "@/lib/jewish/jewishHolidays";
import HomeCard from "@/components/HomeCard";

function fmtDate(date) {
  return date.toLocaleDateString("de-DE", { day: "numeric", month: "long" });
}

// Upcoming Jewish holidays with a countdown to the nearest one.
export default function HolidayCard() {
  const { t } = useSettings();
  const now = new Date();
  const upcoming = getUpcomingHolidays(now, 4);
  const todayHoliday = holidayOnDate(now);
  const days = daysUntilNextHoliday(now);

  return (
    <HomeCard icon={CalendarHeart} title={t("jewish.holidays.title")}>
      {todayHoliday ? (
        <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          {t("jewish.holidays.today")}: {todayHoliday.name}
        </p>
      ) : days !== null ? (
        <p className="mb-3 text-sm text-muted-foreground">
          {days === 0
            ? t("jewish.holidays.tomorrow")
            : t("jewish.holidays.inDays").replace("{n}", days)}
        </p>
      ) : null}
      <div className="grid gap-2.5">
        {upcoming.map((ev) => (
          <div key={`${ev.name}-${ev.hebrewYear}`} className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-foreground">{ev.name}</span>
              {ev.type === "fast" && (
                <span className="ml-2 rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-semibold uppercase text-accent-foreground">
                  {t("jewish.holidays.fast")}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">{fmtDate(ev.gregorianStart)}</span>
          </div>
        ))}
      </div>
    </HomeCard>
  );
}