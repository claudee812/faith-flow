import React from "react";
import { CalendarDays, Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { getSeasonsOfYear, getCurrentSeason, formatSeasonRange } from "@/lib/christian/churchYear";
import { useChristianCalendar } from "@/hooks/useChristianCalendar";

// Church-year calendar: the liturgical seasons (computed, denomination-aware)
// plus the seeded fixed feasts/memorials.
export default function ChurchYearCalendar({ denomination }) {
  const { t } = useSettings();
  const denom = denomination || "protestant";
  const year = new Date().getFullYear();
  const seasons = getSeasonsOfYear(year, denom);
  const current = getCurrentSeason(new Date(), denom);
  const { todaysEvent, upcoming } = useChristianCalendar(denom);

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("christian.feature.churchYear")}</h1>

      {todaysEvent && (
        <HomeCard icon={Sparkles} title={t("christian.saints.today")} className="mb-4">
          <p className="font-display text-lg font-bold text-primary">{todaysEvent.name}</p>
          <p className="text-sm text-muted-foreground">{todaysEvent.description || ""}</p>
        </HomeCard>
      )}

      <HomeCard icon={CalendarDays} title={`${year}`} className="mb-4">
        <div className="grid gap-2">
          {seasons.map((s) => {
            const active = s.key === current.key;
            return (
              <div
                key={s.key}
                className={`flex items-center justify-between rounded-2xl px-3 py-2.5 ${active ? "bg-primary/10" : "bg-muted/40"}`}
              >
                <div>
                  <p className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}>{t(s.labelKey)}</p>
                  <p className="text-xs text-muted-foreground">{formatSeasonRange(s)}</p>
                </div>
                {s.type === "fast" && (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">Fasten</span>
                )}
                {s.type === "feast" && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">Fest</span>
                )}
              </div>
            );
          })}
        </div>
      </HomeCard>

      {upcoming.length > 0 && (
        <HomeCard icon={CalendarDays} title={t("christian.saints.upcoming")}>
          <div className="grid gap-2">
            {upcoming.map((ev) => (
              <div key={ev.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{ev.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString("de-DE", { day: "numeric", month: "long" })}
                </span>
              </div>
            ))}
          </div>
        </HomeCard>
      )}
    </div>
  );
}