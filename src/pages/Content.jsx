import React from "react";
import { BookOpen } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";
import { useSettings } from "@/context/SettingsContext";
import Quran from "@/pages/Quran";
import Bible from "@/pages/Bible";

export default function Content() {
  const { t, themeReligion } = useSettings();
  if (themeReligion === "islam") return <Quran />;
  if (themeReligion === "christianity") return <Bible />;
  return (
    <ComingSoon
      icon={BookOpen}
      title={t("nav.content")}
      description="Religiöse Texte, Lesungen und Reflexionen passend zu deiner Tradition werden hier ergänzt."
    />
  );
}