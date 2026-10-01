import React from "react";
import { Leaf } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { getCurrentSeason, formatSeasonRange } from "@/lib/christian/churchYear";

// Orthodox fasting periods: shows the current liturgical season, highlighting
// whether it is a fast (Lent / Holy Week), computed with the Julian Easter.
export default function OrthodoxFastsCard() {
  const { t } = useSettings();
  const current = getCurrentSeason(new Date(), "orthodox");
  const isFast = current.type === "fast";

  return (
    <HomeCard icon={Leaf} title={t("christian.orthodox.fasts.title")}>
      <div className={`rounded-2xl p-4 ${isFast ? "bg-primary/10" : "bg-muted/50"}`}>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("christian.orthodox.current")}</p>
        <p className={`font-display text-lg font-bold mt-0.5 ${isFast ? "text-primary" : "text-foreground"}`}>
          {t(current.labelKey)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{formatSeasonRange(current)}</p>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {isFast ? t("christian.orthodox.fasting") : t("christian.orthodox.none")}
      </p>
    </HomeCard>
  );
}