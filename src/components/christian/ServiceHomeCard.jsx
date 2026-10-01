import React from "react";
import { Church, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useChurchService } from "@/hooks/useChurchService";

const DAY_LABELS = { sun: "Sonntag", sat: "Samstag", wed: "Mittwoch", fri: "Freitag", other: "—" };

// Home summary of the user's local service: day, time, community and a quick
// "visited today" action. Links to the full service page.
export default function ServiceHomeCard() {
  const { t } = useSettings();
  const { record, markAttended } = useChurchService();
  const dayLabel = DAY_LABELS[record?.day_of_week || "sun"];

  return (
    <HomeCard
      icon={Church}
      title={t("christian.service.title")}
      action={
        <Link to="/service" className="text-muted-foreground">
          <ChevronRight className="h-5 w-5" />
        </Link>
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold text-foreground">{dayLabel} · {record?.service_time || "10:00"}</p>
          <p className="text-sm text-muted-foreground">{record?.community_name || t("christian.service.communityPlaceholder")}</p>
        </div>
      </div>
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