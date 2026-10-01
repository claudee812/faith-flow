import React from "react";
import { Sunrise, Sunset, Moon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { SourceNote } from "./shared";

// Beyond the five prayers: sunrise, sunset and Islamic midnight.
export default function AdditionalTimesCard({ times, source }) {
  const { t } = useSettings();
  const rows = [
    { key: "sunrise", icon: Sunrise, label: t("islam.times.sunrise") },
    { key: "maghrib", icon: Sunset, label: t("islam.times.sunset") },
    { key: "midnight", icon: Moon, label: t("islam.times.midnight") },
  ];
  return (
    <HomeCard icon={Sunrise} title={t("islam.times.section")} className="mb-4">
      <div className="grid grid-cols-3 gap-2">
        {rows.map(({ key, icon: Icon, label }) => (
          <div key={key} className="flex flex-col items-center text-center rounded-2xl bg-muted/50 p-3">
            <Icon className="h-5 w-5 text-primary mb-1.5" />
            <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
            <p className="font-display text-base font-bold text-foreground mt-1 tabular-nums">
              {times[key] || "--:--"}
            </p>
          </div>
        ))}
      </div>
      <SourceNote source={source} />
    </HomeCard>
  );
}