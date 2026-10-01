import React from "react";
import { Target } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { useSettings } from "@/context/SettingsContext";

export default function Tracker() {
  const { t } = useSettings();
  return (
    <ComingSoon
      icon={Target}
      title={t("nav.tracker")}
      description="Verfolge Gebete, Fastentage, Lesefortschritt und spirituelle Ziele — bald in diesem Bereich."
    />
  );
}