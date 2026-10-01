import React from "react";
import { Clock } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import ReligionMotif from "@/components/ReligionMotif";
import { PRAYER_LABELS, PRAYER_ARABIC } from "@/data/islamConfig";
import { useCountdownText } from "./shared";

// Hero card: the next prayer, its time and a live countdown.
export default function NextPrayerCard({ nextPrayer, source }) {
  const { t } = useSettings();
  const countdownText = useCountdownText();
  const label = nextPrayer ? PRAYER_LABELS[nextPrayer.key] : "—";
  const arabic = nextPrayer ? PRAYER_ARABIC[nextPrayer.key] : "";
  const time = nextPrayer ? nextPrayer.time : "—";
  const cd = nextPrayer ? countdownText(nextPrayer.countdown) : "";

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-5">
      <ReligionMotif
        religion="islam"
        className="absolute -right-8 -top-10 h-48 w-48 text-primary-foreground/15"
      />
      <div className="relative">
        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
          <Clock className="h-4 w-4" />
          {t("islam.prayer.next")}
        </div>
        <div className="flex items-end justify-between mt-2">
          <div>
            <h2 className="font-display text-3xl font-bold leading-none">{label}</h2>
            <p className="font-display text-lg text-primary-foreground/80 mt-1" dir="rtl">
              {arabic}
            </p>
          </div>
          <p className="font-display text-4xl font-bold tabular-nums">{time}</p>
        </div>
        {cd && (
          <p className="mt-3 text-sm font-medium text-primary-foreground/85">
            {t("islam.prayer.countdownPrefix")} {cd}
          </p>
        )}
        {source && (
          <p className="mt-2 text-[11px] text-primary-foreground/55">{t(`islam.source.${source}`)}</p>
        )}
      </div>
    </div>
  );
}