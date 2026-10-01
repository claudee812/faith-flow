import React from "react";
import { Sunrise, Sun, SunMedium, Sunset, MoonStar } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

// Lucide icons mapped to the five daily prayers + the extra daylight moments.
export const PRAYER_ICONS = {
  fajr: Sunrise,
  dhuhr: Sun,
  asr: SunMedium,
  maghrib: Sunset,
  isha: MoonStar,
};

const STATUS_STYLES = {
  now: "bg-primary/15 text-primary",
  upcoming: "bg-muted text-muted-foreground",
  done: "bg-primary text-primary-foreground",
};

export function StatusBadge({ status, done }) {
  const { t } = useSettings();
  if (done) {
    return (
      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLES.done}`}>
        {t("islam.status.done")}
      </span>
    );
  }
  if (status === "now") {
    return (
      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLES.now}`}>
        {t("islam.status.now")}
      </span>
    );
  }
  if (status === "upcoming") {
    return (
      <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLES.upcoming}`}>
        {t("islam.status.upcoming")}
      </span>
    );
  }
  return null;
}

export function SourceNote({ source }) {
  const { t } = useSettings();
  if (!source) return null;
  const label = t(`islam.source.${source}`);
  return <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>;
}

export function MiniBar({ value, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

// Countdown text builder (uses {h}/{m} placeholders).
export function useCountdownText() {
  const { t } = useSettings();
  return (countdown) => {
    if (!countdown) return "";
    if (countdown.hours > 0) {
      return t("islam.prayer.countdownH")
        .replace("{h}", countdown.hours)
        .replace("{m}", countdown.minutes);
    }
    return t("islam.prayer.countdownM").replace("{m}", countdown.minutes);
  };
}