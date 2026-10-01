import React from "react";
import { Check, ListChecks } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { PRAYER_ORDER, PRAYER_LABELS, PRAYER_ARABIC } from "@/data/islamConfig";
import { PRAYER_ICONS, StatusBadge, SourceNote } from "./shared";

// The five daily prayers: time, status, and an "Erledigt" toggle.
export default function PrayerListCard({ times, statuses, logs, onToggle, source }) {
  const { t } = useSettings();
  return (
    <HomeCard icon={ListChecks} title={t("islam.prayer.five")} className="mb-4">
      <div className="divide-y divide-border/50">
        {PRAYER_ORDER.map((key) => {
          const Icon = PRAYER_ICONS[key];
          const done = !!logs[key];
          return (
            <div key={key} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{PRAYER_LABELS[key]}</p>
                <p className="text-xs text-muted-foreground">
                  {times[key]} · <span dir="rtl">{PRAYER_ARABIC[key]}</span>
                </p>
              </div>
              <StatusBadge status={statuses[key]} done={done} />
              <button
                type="button"
                onClick={() => onToggle(key)}
                aria-label={t("islam.prayer.done")}
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                <Check className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
      <SourceNote source={source} />
    </HomeCard>
  );
}