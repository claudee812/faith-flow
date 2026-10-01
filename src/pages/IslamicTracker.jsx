import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CalendarDays, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerLog } from "@/hooks/usePrayerLog";
import { useRamadanDay } from "@/hooks/useRamadanDay";
import PrayerListCard from "@/components/islam/PrayerListCard";
import PrayerProgressCard from "@/components/islam/PrayerProgressCard";
import RamadanTrackerCard from "@/components/islam/RamadanTrackerCard";
import { useQuranProgress } from "@/hooks/useQuranProgress";
import { MiniBar } from "@/components/islam/shared";

const TABS = [
  { key: "day", labelKey: "islam.tracker.day" },
  { key: "week", labelKey: "islam.tracker.week" },
  { key: "month", labelKey: "islam.tracker.month" },
];

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function dateStr(d) {
  return d.toISOString().slice(0, 10);
}

export default function IslamicTracker() {
  const { t } = useSettings();
  const { user } = useAuth();
  const [tab, setTab] = useState("day");
  const [weekData, setWeekData] = useState([]);
  const [monthCount, setMonthCount] = useState(0);
  const [goals, setGoals] = useState([]);

  const { times, statuses, source } = usePrayerTimes();
  const { logs, toggle, doneCount, weekCount, monthCount: logMonthCount } = usePrayerLog();
  const ramadan = useRamadanDay();
  const quran = useQuranProgress();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 6);
        const res = await base44.entities.Prayer.aggregate({
          query: { user_id: user.id, date: { $gte: dateStr(weekAgo) } },
          groupBy: "date",
          count: true,
        });
        const map = {};
        (res.rows || []).forEach((r) => {
          map[r.date] = r.count;
        });
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push({
            label: WEEKDAY_LABELS[d.getDay()],
            value: map[dateStr(d)] || 0,
          });
        }
        setWeekData(days);
        setMonthCount(logMonthCount);

        const g = await base44.entities.SpiritualGoal.filter(
          { user_id: user.id, status: "active" },
          { limit: 50, sort: "-created_date" }
        );
        setGoals(g.items || []);
      } catch (e) {
        console.error("tracker load failed", e);
      }
    })();
  }, [user, doneCount, logMonthCount]);

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("nav.tracker")}</h1>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5 rounded-2xl bg-muted/60 p-1">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${
              tab === tb.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t(tb.labelKey)}
          </button>
        ))}
      </div>

      {tab === "day" && (
        <>
          <PrayerProgressCard
            doneCount={doneCount}
            total={5}
            weekCount={weekCount}
            monthCount={logMonthCount}
          />
          <PrayerListCard
            times={times}
            statuses={statuses}
            logs={logs}
            onToggle={toggle}
            source={source}
          />
          {ramadan.active && ramadan.record && (
            <RamadanTrackerCard
              dayNumber={ramadan.dayNumber}
              record={ramadan.record}
              onUpdate={ramadan.update}
              prayerDone={doneCount}
              quranPercent={quran.record?.progress_percent || 0}
            />
          )}
        </>
      )}

      {tab === "week" && (
        <HomeCard icon={CalendarDays} title={t("islam.tracker.weekTitle")} className="mb-4">
          <div className="h-48 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barSize={22}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  cursor={{ fill: "hsl(var(--muted))" }}
                  contentStyle={{ borderRadius: 12, border: "none", background: "hsl(var(--card))" }}
                />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {weekData.map((d, i) => (
                    <Cell key={i} fill={d.value > 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {t("islam.tracker.weekSummary").replace("{n}", weekCount)}
          </p>
        </HomeCard>
      )}

      {tab === "month" && (
        <>
          <HomeCard icon={CalendarDays} title={t("islam.tracker.monthTitle")} className="mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("islam.tracker.prayersMonth")}</p>
                <p className="font-display text-2xl font-bold text-foreground mt-1">{monthCount}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("islam.tracker.quran")}</p>
                <p className="font-display text-2xl font-bold text-foreground mt-1">
                  {Math.round(quran.record?.progress_percent || 0)}%
                </p>
              </div>
            </div>
          </HomeCard>
          <HomeCard icon={Target} title={t("islam.tracker.goals")}>
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("islam.tracker.noGoals")}</p>
            ) : (
              <div className="grid gap-3">
                {goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{g.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {g.progress}
                        {g.unit || ""}
                      </span>
                    </div>
                    <MiniBar value={g.progress} total={g.target || 100} />
                  </div>
                ))}
              </div>
            )}
          </HomeCard>
        </>
      )}
    </div>
  );
}