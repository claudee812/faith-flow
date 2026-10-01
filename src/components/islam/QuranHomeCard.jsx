import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Bookmark } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { SURAH_LIST } from "@/data/islamConfig";
import { MiniBar } from "./shared";

// Home preview of the Qur'an area: last read position, progress and bookmark.
export default function QuranHomeCard({ progress }) {
  const { t } = useSettings();
  const surah = SURAH_LIST.find((s) => s.n === progress?.surah_number) || SURAH_LIST[0];
  const pct = Math.round(progress?.progress_percent || 0);

  return (
    <HomeCard
      icon={BookOpen}
      title={t("islam.quran.title")}
      action={
        <Link to="/content" className="flex items-center gap-1 text-sm text-primary">
          {t("islam.quran.continue")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      }
      className="mb-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">{t("islam.quran.lastRead")}</p>
          <p className="font-display text-lg font-bold text-foreground">
            {surah.tr} · {t("islam.quran.ayah")} {progress?.ayah_number || 1}
          </p>
          <p className="text-sm text-muted-foreground" dir="rtl">{surah.ar}</p>
        </div>
        {progress?.bookmarked && (
          <span className="flex items-center gap-1 text-xs text-accent-foreground bg-accent/15 rounded-full px-2 py-1">
            <Bookmark className="h-3 w-3" /> {t("islam.quran.bookmarks")}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-muted-foreground">{t("islam.quran.progress")}</span>
        <span className="text-xs font-semibold text-primary">{pct}%</span>
      </div>
      <MiniBar value={pct} total={100} />
      <p className="mt-2 text-[11px] text-muted-foreground">{t("islam.quran.mockNote")}</p>
    </HomeCard>
  );
}