import React from "react";
import ReligionMotif from "@/components/ReligionMotif";

// Step 1 — welcome screen.
export default function StepWelcome({ t }) {
  return (
    <div className="flex flex-col items-center text-center px-6 pt-10">
      <div className="relative w-full h-56 mb-8 text-primary/25">
        <ReligionMotif religion="islam" variant="header" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
            <span className="font-display text-3xl font-bold">F</span>
          </div>
        </div>
      </div>
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
        {t("onboarding.welcome.title")}
      </h1>
      <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-xs">
        {t("onboarding.welcome.subtitle")}
      </p>
    </div>
  );
}