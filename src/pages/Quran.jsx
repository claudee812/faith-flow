import React, { useState } from "react";
import { BookOpen, Search, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { SURAH_LIST } from "@/data/islamConfig";
import { useQuranProgress } from "@/hooks/useQuranProgress";
import { MiniBar } from "@/components/islam/shared";

export default function Quran() {
  const { t } = useSettings();
  const { record, update } = useQuranProgress();
  const [query, setQuery] = useState("");

  const pct = Math.round(record?.progress_percent || 0);
  const filtered = SURAH_LIST.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      s.tr.toLowerCase().includes(q) ||
      s.de.toLowerCase().includes(q) ||
      String(s.n) === q
    );
  });

  const setSurah = async (surah) => {
    await update({
      surah_number: surah.n,
      surah_name: surah.tr,
      ayah_number: 1,
      progress_percent: Math.min(100, pct + 1),
      bookmarked: record?.surah_number === surah.n ? !!record?.bookmarked : false,
    });
  };

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("islam.quran.title")}</h1>

      {/* Last read + progress */}
      <HomeCard icon={BookOpen} title={t("islam.quran.lastRead")} className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              {record?.surah_name || "Al-Fātiḥa"} · {t("islam.quran.ayah")} {record?.ayah_number || 1}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("islam.quran.progress")}: {pct}%
            </p>
          </div>
          <button
            type="button"
            onClick={() => update({ bookmarked: !record?.bookmarked })}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              record?.bookmarked ? "bg-accent/15 text-accent-foreground border-accent/30" : "border-border text-muted-foreground"
            }`}
            aria-label={t("islam.quran.bookmarks")}
          >
            {record?.bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-3">
          <MiniBar value={pct} total={100} />
        </div>

        <label className="block mt-4">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("islam.quran.dailyGoal")}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update({ daily_goal_pages: Math.max(1, (record?.daily_goal_pages || 1) - 1) })}
              className="h-8 w-8 rounded-full border border-border"
            >
              −
            </button>
            <span className="font-display text-base font-bold w-10 text-center">
              {record?.daily_goal_pages || 1}
            </span>
            <button
              type="button"
              onClick={() => update({ daily_goal_pages: (record?.daily_goal_pages || 1) + 1 })}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            >
              +
            </button>
            <span className="text-xs text-muted-foreground ml-1">{t("islam.quran.pagesDay")}</span>
          </div>
        </label>

        <label className="block mt-4">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("islam.quran.notes")}</span>
          <textarea
            value={record?.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder={t("islam.quran.notesPlaceholder")}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </label>
        <p className="mt-3 text-[11px] text-muted-foreground">{t("islam.quran.mockNote")}</p>
      </HomeCard>

      {/* Surah overview */}
      <div className="mb-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("islam.quran.searchSurah")}
          className="w-full rounded-2xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <HomeCard icon={BookOpen} title={t("islam.quran.surahs")}>
        <div className="divide-y divide-border/50 max-h-80 overflow-y-auto -mx-1 px-1 [scrollbar-width:none]">
          {filtered.map((s) => (
            <button
              key={s.n}
              type="button"
              onClick={() => setSurah(s)}
              className="flex items-center gap-3 w-full py-2.5 text-left hover:bg-muted/40 rounded-xl px-2 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{s.tr}</p>
                <p className="text-xs text-muted-foreground">{s.de}</p>
              </div>
              <span className="font-display text-base text-muted-foreground" dir="rtl">{s.ar}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </HomeCard>
    </div>
  );
}