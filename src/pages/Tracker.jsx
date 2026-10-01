import React from "react";
import { Target } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { useSettings } from "@/context/SettingsContext";
import IslamicTracker from "@/pages/IslamicTracker";

export default function Tracker() {
  const { t, themeReligion } = useSettings();
  if (themeReligion === "islam") return <IslamicTracker />;
  return (
    <ComingSoon
      icon={Target}
      title={t("nav.tracker")}
      description="Verfolge Gebete, Fastentage, Lesefortschritt und spirituelle Ziele — bald in diesem Bereich."
    />
  );
}