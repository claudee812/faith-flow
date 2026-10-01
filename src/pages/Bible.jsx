import React, { useState } from "react";
import { BookOpen, Search, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { BIBLE_BOOKS, BIBLE_TOTAL_CHAPTERS } from "@/data/christianConfig";
import { useBibleProgress } from "@/hooks/useBibleProgress";
import { MiniBar } from "@/components/christian/shared";

const PLANS = [
  { key: "free", labelKey: "christian.bible.plan.free" },
  { key: "through_bible_year", labelKey: "christian.bible.plan.through_bible_year" },
  { key: "nt_30", labelKey: "christian.bible.plan.nt_30" },
  { key: "ot_9", labelKey: "christian.bible.plan.ot_9" },
];

export default function Bible() {
  const { t } = useSettings();
  const { record, update } = useBibleProgress();
  const [query, setQuery] = useState("");

  const chaptersRead = record?.chapters_read || 0;
  const pct = Math.min(100, Math.round((chaptersRead / BIBLE_TOTAL_CHAPTERS) * 100));
  const currentBook = BIBLE_BOOKS.find((b) => b.n === (record?.book_index || 40)) || BIBLE_BOOKS[39];

  const filtered = BIBLE_BOOKS.filter((b) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return b.name.toLowerCase().includes(q) || String(b.n) === q;
  });

  const markRead = async () => {
    const nextChapter = (record?.chapter || 1) + 1;
    const totalChapters = currentBook.chapters;
    let patch = {
      chapters_read: chaptersRead + 1,
      progress_percent: Math.min(100, Math.round(((chaptersRead + 1) / BIBLE_TOTAL_CHAPTERS) * 100)),
    };
    if (nextChapter > totalChapters) {
      const nextBook = BIBLE_BOOKS.find((b) => b.n === currentBook.n + 1);
      if (nextBook) {
        patch = { ...patch, book: nextBook.name, book_index: nextBook.n, chapter: 1, chapters_in_book: nextBook.chapters };
      } else {
        patch = { ...patch, chapter: totalChapters }; // finished Bible
      }
    } else {
      patch.chapter = nextChapter;
    }
    await update(patch);
  };

  const setBook = async (book) => {
    await update({ book: book.name, book_index: book.n, chapter: 1, chapters_in_book: book.chapters, bookmarked: record?.book_index === book.n ? !!record?.bookmarked : false });
  };

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("christian.bible.title")}</h1>

      <HomeCard icon={BookOpen} title={t("christian.bible.lastRead")} className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold text-foreground">
              {record?.book || "Matthäus"} · {t("christian.bible.chapter")} {record?.chapter || 1}
            </p>
            <p className="text-sm text-muted-foreground">{t("christian.bible.progress")}: {pct}% · {chaptersRead}/{BIBLE_TOTAL_CHAPTERS}</p>
          </div>
          <button
            type="button"
            onClick={() => update({ bookmarked: !record?.bookmarked })}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
              record?.bookmarked ? "bg-accent/15 text-accent-foreground border-accent/30" : "border-border text-muted-foreground"
            }`}
            aria-label={t("christian.bible.bookmarks")}
          >
            {record?.bookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
          </button>
        </div>
        <div className="mt-3">
          <MiniBar value={pct} total={100} />
        </div>

        <button
          type="button"
          onClick={markRead}
          className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("christian.bible.markRead")}
        </button>

        <label className="block mt-4">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.bible.dailyGoal")}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => update({ daily_goal_chapters: Math.max(1, (record?.daily_goal_chapters || 1) - 1) })}
              className="h-8 w-8 rounded-full border border-border"
            >−</button>
            <span className="font-display text-base font-bold w-10 text-center">{record?.daily_goal_chapters || 1}</span>
            <button
              type="button"
              onClick={() => update({ daily_goal_chapters: (record?.daily_goal_chapters || 1) + 1 })}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground"
            >+</button>
            <span className="text-xs text-muted-foreground ml-1">{t("christian.bible.chaptersDay")}</span>
          </div>
        </label>

        <label className="block mt-4">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.bible.readingPlan")}</span>
          <div className="flex flex-wrap gap-2">
            {PLANS.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => update({ reading_plan: p.key })}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  (record?.reading_plan || "free") === p.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t(p.labelKey)}
              </button>
            ))}
          </div>
        </label>

        <label className="block mt-4">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.bible.notes")}</span>
          <textarea
            value={record?.notes || ""}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder={t("christian.bible.notesPlaceholder")}
            rows={3}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </label>
        <p className="mt-3 text-[11px] text-muted-foreground">{t("christian.bible.mockNote")}</p>
      </HomeCard>

      <div className="mb-3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("christian.bible.search")}
          className="w-full rounded-2xl border border-border bg-card pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <HomeCard icon={BookOpen} title={t("christian.bible.books")}>
        <div className="divide-y divide-border/50 max-h-80 overflow-y-auto -mx-1 px-1 [scrollbar-width:none]">
          {filtered.map((b) => (
            <button
              key={b.n}
              type="button"
              onClick={() => setBook(b)}
              className="flex items-center gap-3 w-full py-2.5 text-left hover:bg-muted/40 rounded-xl px-2 transition-colors"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{b.n}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.testament} · {b.chapters} {t("christian.bible.chapter")}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </HomeCard>
    </div>
  );
}