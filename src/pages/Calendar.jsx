import React from "react";
import { CalendarDays } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { useSettings } from "@/context/SettingsContext";
import ChurchYearCalendar from "@/pages/ChurchYearCalendar";
import JewishCalendar from "@/pages/JewishCalendar";

export default function Calendar() {
  const { t, themeReligion, settings } = useSettings();
  if (themeReligion === "christianity") return <ChurchYearCalendar denomination={settings?.denomination || "protestant"} />;
  if (themeReligion === "judaism") return <JewishCalendar />;
  return (
    <ComingSoon
      icon={CalendarDays}
      title={t("nav.calendar")}
      description="Ein religionsübergreifender Kalender mit Feiertagen, Fastenzeiten und Wochenrhythmen folgt im nächsten Schritt."
    />
  );
}