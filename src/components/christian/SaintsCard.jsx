import React from "react";
import { Sparkles } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useChristianCalendar } from "@/hooks/useChristianCalendar";

// Today's saint / memorial + upcoming feasts, filtered by denomination.
export default function SaintsCard({ denomination }) {
  const { t } = useSettings();
  const { todaysEvent, upcoming } = useChristianCalendar(denomination);

  return (
    <HomeCard icon={Sparkles} title={t("christian.feature.saints")}>
      {todaysEvent ? (
        <div className="rounded-2xl bg-primary/5 p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{t("christian.saints.today")}</p>
          <p className="font-display text-lg font-bold text-primary mt-0.5">{todaysEvent.name}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("christian.saints.empty")}</p>
      )}
      {upcoming.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-1.5">{t("christian.saints.upcoming")}</p>
          <div className="grid gap-1.5">
            {upcoming.slice(0, 4).map((ev) => (
              <div key={ev.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{ev.name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(ev.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </HomeCard>
  );
}