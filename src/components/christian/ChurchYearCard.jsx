import React from "react";
import { CalendarHeart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { getCurrentSeason, getNextSeason, formatSeasonRange } from "@/lib/christian/churchYear";

// Current liturgical season + the next upcoming season, denomination-aware
// (Orthodox uses the Julian Easter). No denomination is framed as "correct".
export default function ChurchYearCard({ denomination }) {
  const { t } = useSettings();
  const now = new Date();
  const current = getCurrentSeason(now, denomination);
  const next = getNextSeason(now, denomination);

  return (
    <HomeCard icon={CalendarHeart} title={t("christian.feature.churchYear")}>
      <div className="rounded-2xl bg-primary/5 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("christian.season.current")}</p>
        <p className="font-display text-lg font-bold text-primary mt-0.5">{t(current.labelKey)}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatSeasonRange(current)}</p>
      </div>
      {next && (
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("christian.nextSeason")}</p>
            <p className="text-sm font-medium text-foreground">{t(next.labelKey)}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(next.start).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
          </span>
        </div>
      )}
    </HomeCard>
  );
}