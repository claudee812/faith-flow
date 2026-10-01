import React from "react";
import { Music } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useChurchService } from "@/hooks/useChurchService";

// Free-church / Protestant worship: a gentle invitation to a moment of
// worship, plus a quick "worshipped this week" note.
export default function WorshipCard() {
  const { t } = useSettings();
  const { record, markAttended } = useChurchService();
  return (
    <HomeCard icon={Music} title={t("christian.feature.worship")}>
      <p className="text-sm text-muted-foreground">{t("christian.worship.hint")}</p>
      <button
        type="button"
        onClick={markAttended}
        className="mt-3 w-full rounded-xl bg-primary/10 py-2 text-sm font-medium text-primary hover:bg-primary/15"
      >
        {t("christian.service.markAttended")}
      </button>
      {record?.last_attended_date && (
        <p className="mt-2 text-xs text-muted-foreground">
          {t("christian.service.attended")}: {new Date(record.last_attended_date).toLocaleDateString("de-DE")}
        </p>
      )}
    </HomeCard>
  );
}