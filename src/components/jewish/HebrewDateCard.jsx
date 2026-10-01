import React from "react";
import { Star } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { formatHebrewDate } from "@/lib/jewish/hebrewDate";
import HomeCard from "@/components/HomeCard";

// Shows the current Hebrew date prominently.
export default function HebrewDateCard() {
  const { t } = useSettings();
  const hd = formatHebrewDate(new Date());
  return (
    <HomeCard icon={Star} title={t("jewish.hebrewDate")}>
      <p className="font-display text-xl font-semibold text-foreground">{hd.full}</p>
      <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString("de-DE", { weekday: "long" })}</p>
    </HomeCard>
  );
}