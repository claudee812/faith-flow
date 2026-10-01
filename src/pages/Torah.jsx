import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useTorahProgress } from "@/hooks/useTorahProgress";
import { PARASHIYOT, TORAH_BOOKS, parashaForDate } from "@/data/jewishConfig";
import HomeCard from "@/components/HomeCard";
import { MiniBar } from "@/components/jewish/shared";

// Torah content page: current parasha hint, reading progress and a
// parasha overview. No copyrighted Hebrew text — only public-domain names.
export default function Torah() {
  const { t } = useSettings();
  const { record, update } = useTorahProgress();
  const [search, setSearch] = useState("");
  const hint = parashaForDate(new Date());

  const filtered = PARASHIYOT.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("jewish.torah.title")}</h1>

      {/* Progress card */}
      <HomeCard icon={BookOpen} title={t("jewish.torah.progress")} className="mb-4">
        <p className="mb-1 text-sm text-muted-foreground">{t("jewish.torah.thisWeek")}</p>
        <p className="font-display text-lg font-semibold text-foreground mb-3">{hint.parasha}</p>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {t("jewish.torah.lastRead")}: {record?.book || "Genesis"} {record?.chapter || 1}
          </span>
          <span className="font-semibold text-primary">{Math.round(record?.progress_percent || 0)}%</span>
        </div>
        <MiniBar value={record?.progress_percent || 0} total={100} />

        <label className="mt-4 block text-xs text-muted-foreground mb-1">{t("jewish.torah.dailyGoal")}</label>
        <input
          type="number"
          min={1}
          value={record?.daily_goal_verses || 10}
          onChange={(e) => update({ daily_goal_verses: Number(e.target.value) })}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </HomeCard>

      {/* Parasha overview */}
      <HomeCard icon={BookOpen} title={t("jewish.torah.parashiyot")}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("jewish.torah.searchParasha")}
          className="mb-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
        <div className="grid gap-1.5">
          {filtered.map((p, i) => (
            <div
              key={p}
              className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50"
            >
              <span className="text-foreground">{p}</span>
              <span className="text-xs text-muted-foreground">{i + 1}</span>
            </div>
          ))}
        </div>
      </HomeCard>
    </div>
  );
}