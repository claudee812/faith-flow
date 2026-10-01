import React from "react";
import { MoonStar } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import ReligionMotif from "@/components/ReligionMotif";
import { RAMADAN_FAST_TOTAL } from "@/data/islamConfig";

// Shown only while Ramadan is active. Displays the day, remaining days, the
// Suhur/Iftar times and the current fasting status with start/end actions.
export default function RamadanBanner({ times, dayNumber, fastStatus, onSetStatus }) {
  const { t } = useSettings();
  const remaining = Math.max(0, RAMADAN_FAST_TOTAL - (dayNumber || 0));

  const statusLabel =
    fastStatus === "fasting"
      ? t("islam.ramadan.status.fasting")
      : fastStatus === "completed"
      ? t("islam.ramadan.status.completed")
      : t("islam.ramadan.status.notStarted");

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-4">
      <ReligionMotif religion="islam" className="absolute -left-8 -top-10 h-44 w-44 text-primary-foreground/15" />
      <div className="relative">
        <div className="flex items-center gap-2 text-primary-foreground/80 text-sm">
          <MoonStar className="h-4 w-4" />
          {t("islam.ramadan.mubarak")}
        </div>
        <div className="flex items-end justify-between mt-2">
          <h2 className="font-display text-2xl font-bold">
            {t("islam.ramadan.day").replace("{n}", dayNumber || 1)}
          </h2>
          <p className="text-sm text-primary-foreground/85">
            {t("islam.ramadan.remaining").replace("{n}", remaining)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-primary-foreground/10 p-3">
            <p className="text-xs text-primary-foreground/80">{t("islam.ramadan.suhur")}</p>
            <p className="font-display text-xl font-bold mt-0.5 tabular-nums">{times.fajr}</p>
          </div>
          <div className="rounded-2xl bg-primary-foreground/10 p-3">
            <p className="text-xs text-primary-foreground/80">{t("islam.ramadan.iftar")}</p>
            <p className="font-display text-xl font-bold mt-0.5 tabular-nums">{times.maghrib}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-primary-foreground/70 mb-2">
            {t("islam.ramadan.statusLabel")}: {statusLabel}
          </p>
          <div className="flex gap-2">
            {fastStatus !== "fasting" ? (
              <button
                type="button"
                onClick={() => onSetStatus("fasting")}
                className="flex-1 rounded-xl bg-primary-foreground text-primary py-2.5 text-sm font-semibold"
              >
                {t("islam.ramadan.start")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSetStatus("completed")}
                className="flex-1 rounded-xl bg-primary-foreground text-primary py-2.5 text-sm font-semibold"
              >
                {t("islam.ramadan.end")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}