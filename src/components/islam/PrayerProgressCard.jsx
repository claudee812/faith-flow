import React from "react";
import { TrendingUp } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { MiniBar } from "./shared";

// Daily / weekly / monthly prayer progress — no competitive gamification,
// just honest counts.
export default function PrayerProgressCard({ doneCount, total, weekCount, monthCount }) {
  const { t } = useSettings();
  const weekTotal = total * 7;
  const monthTotal = total * 30;
  return (
    <HomeCard icon={TrendingUp} title={t("islam.progress.section")} className="mb-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t("islam.progress.today")}</span>
          <span className="text-sm font-semibold text-primary">
            {t("islam.progress.prayers").replace("{done}", doneCount).replace("{total}", total)}
          </span>
        </div>
        <MiniBar value={doneCount} total={total} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">{t("islam.progress.week")}</p>
          <p className="font-display text-lg font-bold text-foreground mt-0.5">
            {weekCount}
            <span className="text-sm font-normal text-muted-foreground"> / {weekTotal}</span>
          </p>
          <div className="mt-2">
            <MiniBar value={weekCount} total={weekTotal} />
          </div>
        </div>
        <div className="rounded-2xl bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">{t("islam.progress.month")}</p>
          <p className="font-display text-lg font-bold text-foreground mt-0.5">
            {monthCount}
            <span className="text-sm font-normal text-muted-foreground"> / {monthTotal}</span>
          </p>
          <div className="mt-2">
            <MiniBar value={monthCount} total={monthTotal} />
          </div>
        </div>
      </div>
    </HomeCard>
  );
}