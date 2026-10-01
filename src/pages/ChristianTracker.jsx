import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CalendarDays, Target, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useChristianPrayer } from "@/hooks/useChristianPrayer";
import { useBibleProgress } from "@/hooks/useBibleProgress";
import { useChurchService } from "@/hooks/useChurchService";
import { usePrayerJournal } from "@/hooks/usePrayerJournal";
import { MiniBar } from "@/components/christian/shared";

const TABS = [
  { key: "day", labelKey: "christian.tracker.day" },
  { key: "week", labelKey: "christian.tracker.week" },
  { key: "month", labelKey: "christian.tracker.month" },
];
const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
function dateStr(d) { return d.toISOString().slice(0, 10); }

export default function ChristianTracker() {
  const { t } = useSettings();
  const { user } = useAuth();
  const [tab, setTab] = useState("day");
  const [weekData, setWeekData] = useState([]);
  const [monthPrayers, setMonthPrayers] = useState(0);
  const [services, setServices] = useState(0);
  const [goals, setGoals] = useState([]);

  const prayer = useChristianPrayer();
  const bible = useBibleProgress();
  const service = useChurchService();
  const journal = usePrayerJournal();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);
        const res = await base44.entities.ChristianPrayer.aggregate({
          query: { user_id: user.id, date: { $gte: dateStr(weekAgo) } },
          groupBy: "date", count: true,
        });
        const map = {};
        (res.rows || []).forEach((r) => { map[r.date] = r.count; });
        const days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          days.push({ label: WEEKDAY_LABELS[d.getDay()], value: map[dateStr(d)] || 0 });
        }
        setWeekData(days);

        const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 29);
        const m = await base44.entities.ChristianPrayer.count({ user_id: user.id, date: { $gte: dateStr(monthAgo) } });
        setMonthPrayers(m || 0);

        const g = await base44.entities.SpiritualGoal.filter({ user_id: user.id, status: "active" }, { limit: 50, sort: "-created_date" });
        setGoals(g.items || []);
      } catch (e) {
        console.error("christian tracker load failed", e);
      }
    })();
  }, [user, prayer.doneCount, service.record?.last_attended_date]);

  const answeredCount = journal.entries.filter((e) => e.answered).length;
  const biblePct = Math.round(bible.record?.progress_percent || 0);

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("nav.tracker")}</h1>

      <div className="flex gap-1.5 mb-5 rounded-2xl bg-muted/60 p-1">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`flex-1 rounded-xl py-2 text-sm font-medium transition-colors ${tab === tb.key ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            {t(tb.labelKey)}
          </button>
        ))}
      </div>

      {tab === "day" && (
        <>
          <HomeCard icon={CalendarDays} title={t("christian.tracker.prayers")} className="mb-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("christian.prayer.count").replace("{done}", prayer.doneCount).replace("{total}", prayer.total || 0)}
              </span>
              <span className="text-sm font-semibold text-primary">{prayer.weekCount} / {t("christian.tracker.week")}</span>
            </div>
            <MiniBar value={prayer.doneCount} total={prayer.total || 1} />
          </HomeCard>
          <HomeCard icon={Target} title={t("christian.tracker.bible")} className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">{bible.record?.book || "Matthäus"} {bible.record?.chapter || 1}</span>
              <span className="text-sm font-semibold text-primary">{biblePct}%</span>
            </div>
            <div className="mt-2"><MiniBar value={biblePct} total={100} /></div>
          </HomeCard>
          <HomeCard icon={Heart} title={t("christian.tracker.gratitude")}>
            <p className="text-sm text-muted-foreground">
              {journal.entries.length} {t("christian.journal.title")} · {answeredCount} {t("christian.journal.answered")}
            </p>
          </HomeCard>
        </>
      )}

      {tab === "week" && (
        <HomeCard icon={CalendarDays} title={t("christian.tracker.weekTitle")} className="mb-4">
          <div className="h-48 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} barSize={22}>
                <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ borderRadius: 12, border: "none", background: "hsl(var(--card))" }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {weekData.map((d, i) => (
                    <Cell key={i} fill={d.value > 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.4)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            {t("christian.tracker.weekSummary").replace("{n}", prayer.weekCount)}
          </p>
        </HomeCard>
      )}

      {tab === "month" && (
        <>
          <HomeCard icon={CalendarDays} title={t("christian.tracker.monthTitle")} className="mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("christian.tracker.prayers")}</p>
                <p className="font-display text-2xl font-bold text-foreground mt-1">{monthPrayers}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("christian.tracker.bible")}</p>
                <p className="font-display text-2xl font-bold text-foreground mt-1">{biblePct}%</p>
              </div>
            </div>
          </HomeCard>
          <HomeCard icon={Target} title={t("christian.tracker.goals")}>
            {goals.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("christian.tracker.noGoals")}</p>
            ) : (
              <div className="grid gap-3">
                {goals.map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{g.title}</span>
                      <span className="text-sm text-muted-foreground">{g.progress}{g.unit || ""}</span>
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