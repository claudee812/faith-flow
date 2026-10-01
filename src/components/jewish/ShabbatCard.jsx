import React from "react";
import { Flame, Moon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useShabbatEvent } from "@/hooks/useShabbatEvent";
import { computeShabbatTimes } from "@/lib/jewish/shabbatTimes";
import { isShabbatActive } from "@/lib/jewish/shabbatTimes";
import HomeCard from "@/components/HomeCard";
import { SHABBAT_CHECKLIST } from "@/data/jewishConfig";
import { MockBadge } from "@/components/jewish/shared";

function fmtTime(date) {
  return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}
function fmtDate(date) {
  return date.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
}

// Shabbat card: candle lighting, havdalah and a gentle preparation checklist.
export default function ShabbatCard() {
  const { t } = useSettings();
  const { record, toggleCheck, loading } = useShabbatEvent();
  const times = computeShabbatTimes(new Date());
  const active = isShabbatActive(new Date(), times);

  return (
    <HomeCard
      icon={Flame}
      title={t("jewish.shabbat.title")}
      action={times.isMock && <MockBadge label={t("home.mock.badge")} />}
    >
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">{t("jewish.shabbat.candles")}</p>
          <p className="font-display text-lg font-semibold text-foreground">{fmtTime(times.candles)}</p>
          <p className="text-xs text-muted-foreground">{fmtDate(times.friday)}</p>
        </div>
        <div className="rounded-xl bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Moon className="h-3 w-3" /> {t("jewish.shabbat.havdalah")}
          </p>
          <p className="font-display text-lg font-semibold text-foreground">{fmtTime(times.havdalah)}</p>
          <p className="text-xs text-muted-foreground">{fmtDate(times.havdalah)}</p>
        </div>
      </div>

      {active && (
        <p className="mb-3 rounded-xl bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
          {t("jewish.shabbat.now")}
        </p>
      )}

      <p className="mb-2 text-sm font-medium text-foreground">{t("jewish.shabbat.checklist")}</p>
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-1.5">
          {SHABBAT_CHECKLIST.map((c) => {
            const done = !!record?.[`checklist_${c.key}`];
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleCheck(c.key)}
                className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/50"
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                    done ? "border-primary bg-primary text-primary-foreground" : "border-border text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={done ? "text-sm text-foreground" : "text-sm text-muted-foreground"}>
                  {t(c.labelKey)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </HomeCard>
  );
}