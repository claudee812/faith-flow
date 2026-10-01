import React from "react";
import { Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useJewishPrayer } from "@/hooks/useJewishPrayer";
import HomeCard from "@/components/HomeCard";
import { MiniBar } from "@/components/jewish/shared";

const PRAYER_LABELS = {
  shacharit: "jewish.prayer.shacharit",
  mincha: "jewish.prayer.mincha",
  maariv: "jewish.prayer.maariv",
  musaf: "jewish.prayer.musaf",
};

// Daily Jewish prayer services with gentle completion toggles.
export default function JewishPrayerCard() {
  const { t } = useSettings();
  const { logs, toggle, doneCount, total, loading } = useJewishPrayer();

  const services = ["shacharit", "mincha", "maariv"];

  return (
    <HomeCard icon={Check} title={t("jewish.prayer.title")}>
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {doneCount} / {total}
            </span>
            <MiniBar value={doneCount} total={total} className="w-24" />
          </div>
          <div className="grid gap-2">
            {services.map((key) => {
              const done = !!logs[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                      done ? "bg-primary text-primary-foreground" : "border border-border text-transparent"
                    }`}
                  >
                    <Check className={done ? "h-3.5 w-3.5" : "hidden"} />
                  </span>
                  <span className={done ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                    {t(PRAYER_LABELS[key])}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </HomeCard>
  );
}