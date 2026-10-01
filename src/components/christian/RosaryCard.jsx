import React from "react";
import { Heart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useDevotion } from "@/hooks/useDevotion";
import { ROSARY_MYSTERY_SCHEDULE, ROSARY_DECADES, ROSARY_MYSTERY_LABELS } from "@/data/christianConfig";

// Catholic rosary: mystery of the day + track decades prayed today. Gentle,
// opt-in counter — no streak pressure.
export default function RosaryCard() {
  const { t } = useSettings();
  const { today, setCount } = useDevotion("rosary");
  const mysteryKey = ROSARY_MYSTERY_SCHEDULE[new Date().getDay()];
  const decades = ROSARY_DECADES[mysteryKey] || [];
  const count = today?.count || 0;

  return (
    <HomeCard icon={Heart} title={t("christian.rosary.title")}>
      <div className="rounded-2xl bg-primary/5 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("christian.rosary.mystery")}</p>
        <p className="font-display text-lg font-bold text-primary mt-0.5">{t(ROSARY_MYSTERY_LABELS[mysteryKey])}</p>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("christian.rosary.decades")}: {count} / 5
      </p>
      <button
        type="button"
        onClick={() => setCount(Math.min(5, count + 1), mysteryKey)}
        disabled={count >= 5}
        className="mt-2 w-full rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/15 disabled:opacity-50"
      >
        {count >= 5 ? t("christian.rosary.completed") : t("christian.rosary.pray")}
      </button>
      {count > 0 && count < 5 && (
        <ul className="mt-3 grid gap-1.5">
          {decades.slice(0, count).map((d, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">✓</span>
              {t(d)}
            </li>
          ))}
        </ul>
      )}
    </HomeCard>
  );
}