import React from "react";
import { useSettings } from "@/context/SettingsContext";
import ReligionMotif from "@/components/ReligionMotif";

// Elegant placeholder for sections that arrive in later steps. Keeps the
// native-app feel rather than showing a raw "under construction" page.
export default function ComingSoon({ icon: Icon, title, description }) {
  const { t, themeReligion } = useSettings();
  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">{title}</h1>
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-8 flex flex-col items-center text-center">
        <div className="absolute inset-0 text-primary/10">
          <ReligionMotif religion={themeReligion} className="h-full w-full" />
        </div>
        <div className="relative">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary mb-5">
            {Icon && <Icon className="h-7 w-7" />}
          </span>
          <span className="inline-flex items-center rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground mb-3">
            {t("common.soon")}
          </span>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            {description || t("common.comingSoon")}
          </p>
        </div>
      </div>
    </div>
  );
}