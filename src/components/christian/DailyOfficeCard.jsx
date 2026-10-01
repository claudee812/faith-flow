import React from "react";
import { Sunrise, Sunset } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useDevotion } from "@/hooks/useDevotion";

// Anglican/Catholic daily office: morning & evening prayer, tracked as two
// devotions of type "office" distinguished by detail.
export default function DailyOfficeCard() {
  const { t } = useSettings();
  const { today, add, setCount } = useDevotion("office");

  const morningDone = today?.detail === "morning";
  const eveningDone = today?.detail === "evening";

  const mark = (which) => {
    if (today && today.detail === which) {
      setCount(today.count, which);
    } else {
      add({ count: 1, detail: which });
    }
  };

  return (
    <HomeCard icon={Sunrise} title={t("christian.office.title")}>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => mark("morning")}
          className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${
            morningDone ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted/70"
          }`}
        >
          <Sunrise className="h-5 w-5" />
          <span className="text-sm font-medium">{t("christian.office.morning")}</span>
        </button>
        <button
          type="button"
          onClick={() => mark("evening")}
          className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${
            eveningDone ? "bg-primary text-primary-foreground" : "bg-muted/40 hover:bg-muted/70"
          }`}
        >
          <Sunset className="h-5 w-5" />
          <span className="text-sm font-medium">{t("christian.office.evening")}</span>
        </button>
      </div>
    </HomeCard>
  );
}