import React from "react";
import { BookOpen, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useBibleProgress } from "@/hooks/useBibleProgress";
import { MiniBar } from "./shared";

// Home summary of Bible reading: current book/chapter, overall progress,
// daily goal, with a link to the full Bible area.
export default function BibleHomeCard() {
  const { t } = useSettings();
  const { record, update } = useBibleProgress();
  const pct = Math.round(record?.progress_percent || 0);

  return (
    <HomeCard
      icon={BookOpen}
      title={t("christian.bible.title")}
      action={
        <Link to="/content" className="text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </Link>
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-foreground">
            {record?.book || "Matthäus"} · {t("christian.bible.chapter")} {record?.chapter || 1}
          </p>
          <p className="text-sm text-muted-foreground">{t("christian.bible.progress")}: {pct}%</p>
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
        onClick={() => update({ chapter: Math.min((record?.chapters_in_book || 28), (record?.chapter || 1) + 1) })}
        className="mt-3 w-full rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/15"
      >
        {t("christian.bible.markRead")}
      </button>
      <p className="mt-2 text-[11px] text-muted-foreground">{t("christian.bible.mockNote")}</p>
    </HomeCard>
  );
}