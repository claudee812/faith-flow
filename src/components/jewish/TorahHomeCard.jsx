import React from "react";
import { BookOpen } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useTorahProgress } from "@/hooks/useTorahProgress";
import { parashaForDate } from "@/data/jewishConfig";
import HomeCard from "@/components/HomeCard";
import { MiniBar } from "@/components/jewish/shared";

// Torah reading progress with the current weekly parasha hint.
export default function TorahHomeCard() {
  const { t } = useSettings();
  const { record, loading } = useTorahProgress();
  const today = new Date();
  const hint = parashaForDate(today);

  return (
    <HomeCard icon={BookOpen} title={t("jewish.torah.title")}>
      {loading ? (
        <div className="space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted/50 animate-pulse" />
          <div className="h-10 rounded bg-muted/50 animate-pulse" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-1">{t("jewish.torah.thisWeek")}</p>
          <p className="font-display text-lg font-semibold text-foreground mb-3">{hint.parasha}</p>

          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {t("jewish.torah.lastRead")}: {record?.book || "Genesis"} {record?.chapter || 1}
            </span>
            <span className="font-semibold text-primary">{Math.round(record?.progress_percent || 0)}%</span>
          </div>
          <MiniBar value={record?.progress_percent || 0} total={100} />
        </>
      )}
    </HomeCard>
  );
}