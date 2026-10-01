import React from "react";
import { CalendarDays } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { useSettings } from "@/context/SettingsContext";

export default function Calendar() {
  const { t } = useSettings();
  return (
    <ComingSoon
      icon={CalendarDays}
      title={t("nav.calendar")}
      description="Ein religionsübergreifender Kalender mit Feiertagen, Fastenzeiten und Wochenrhythmen folgt im nächsten Schritt."
    />
  );
}