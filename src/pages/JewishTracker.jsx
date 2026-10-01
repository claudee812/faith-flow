import React, { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useJewishPrayer } from "@/hooks/useJewishPrayer";
import { useTorahProgress } from "@/hooks/useTorahProgress";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { EmptyState } from "@/components/StateViews";
import { MiniBar } from "@/components/jewish/shared";
import { Check, BookOpen, Target } from "lucide-react";
import HomeCard from "@/components/HomeCard";

const PERIODS = [
  { key: "day", labelKey: "jewish.tracker.day" },
  { key: "week", labelKey: "jewish.tracker.week" },
  { key: "month", labelKey: "jewish.tracker.month" },
];

const SERVICES = ["shacharit", "mincha", "maariv"];

// Calm, personal Jewish tracker — prayers, Torah progress and goals. No
// streaks-as-competition framing.
export default function JewishTracker() {
  const { t } = useSettings();
  const { user } = useAuth();
  const [period, setPeriod] = useState("day");
  const { logs, toggle, doneCount, total, weekCount, monthCount, loading } = useJewishPrayer();
  const torah = useTorahProgress();
  const [goals, setGoals] = useState([]);

  React.useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const res = await base44.entities.SpiritualGoal.filter(
          { user_id: user.id, status: "active" },
          { sort: "-created_date", limit: 20 }
        );
        setGoals(res.items || []);
      } catch (e) {
        console.error("Failed to load goals", e);
      }
    })();
  }, [user]);

  const count = period === "week" ? weekCount : period === "month" ? monthCount : doneCount;

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("nav.tracker")}</h1>

      {/* Period tabs */}
      <div className="mb-5 flex gap-2 rounded-2xl bg-muted/50 p-1">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPeriod(p.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
              period === p.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t(p.labelKey)}
          </button>
        ))}
      </div>

      {/* Prayer summary */}
      <HomeCard icon={Check} title={t("jewish.tracker.prayers")} className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{count} / {period === "day" ? total : "—"}</span>
          <span className="text-sm font-semibold text-primary">{period === "day" ? Math.round((count / total) * 100) : ""}%</span>
        </div>
        {period === "day" && (
          <MiniBar value={doneCount} total={total} className="mb-4" />
        )}
        <div className="grid gap-2">
          {SERVICES.map((key) => {
            const done = !!logs[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggle(key)}
                className="flex items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${done ? "bg-primary text-primary-foreground" : "border border-border text-transparent"}`}>
                  ✓
                </span>
                <span className={done ? "text-sm font-medium text-foreground" : "text-sm text-muted-foreground"}>
                  {t(`jewish.prayer.${key}`)}
                </span>
              </button>
            );
          })}
        </div>
      </HomeCard>

      {/* Torah progress */}
      <HomeCard icon={BookOpen} title={t("jewish.tracker.torah")} className="mb-4">
        {loading ? (
          <div className="h-12 rounded bg-muted/50 animate-pulse" />
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{torah.record?.book || "Genesis"} {torah.record?.chapter || 1}</span>
              <span className="font-semibold text-primary">{Math.round(torah.record?.progress_percent || 0)}%</span>
            </div>
            <MiniBar value={torah.record?.progress_percent || 0} total={100} />
          </>
        )}
      </HomeCard>

      {/* Goals */}
      <HomeCard icon={Target} title={t("jewish.tracker.goals")}>
        {goals.length === 0 ? (
          <EmptyState icon={Target} title={t("jewish.tracker.noGoals")} />
        ) : (
          <div className="grid gap-3">
            {goals.map((g) => (
              <div key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{g.title}</span>
                  <span className="text-muted-foreground">{g.progress}{g.unit || ""}</span>
                </div>
                <MiniBar value={g.progress} total={g.target || 100} />
              </div>
            ))}
          </div>
        )}
      </HomeCard>
    </div>
  );
}