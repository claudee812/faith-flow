import React from "react";
import { Flame } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useDevotion } from "@/hooks/useDevotion";

// Catholic/Orthodox confession reminder: stores the last confession date and
// gently suggests a cadence (e.g. monthly). No judgment.
export default function ConfessionCard() {
  const { t } = useSettings();
  const { lastDate, add } = useDevotion("confession");

  const daysSince = lastDate
    ? Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000)
    : null;

  return (
    <HomeCard icon={Flame} title={t("christian.confession.title")}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t("christian.confession.last")}</p>
          <p className="font-display text-lg font-bold text-foreground">
            {lastDate ? new Date(lastDate).toLocaleDateString("de-DE") : t("christian.confession.none")}
          </p>
        </div>
        {daysSince != null && (
          <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{daysSince} Tage</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => add({ count: 1, note: "" })}
        className="mt-3 w-full rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/15"
      >
        {t("christian.confession.mark")}
      </button>
    </HomeCard>
  );
}