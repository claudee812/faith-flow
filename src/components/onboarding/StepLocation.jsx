import React from "react";
import { MapPin, MapPinned, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { key: "auto", icon: MapPin, labelKey: "onboarding.location.auto" },
  { key: "manual", icon: MapPinned, labelKey: "onboarding.location.manual" },
  { key: "later", icon: Clock, labelKey: "onboarding.location.later" },
];

// Step 4 — location. "auto" requests geolocation (stubbed for now), "manual"
// reveals a city input, "later" defers.
export default function StepLocation({ t, mode, onModeChange, manualLocation, onManualChange }) {
  const requestGeo = () => {
    onModeChange("auto");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Stored later by the settings layer; for now just confirm selection.
          console.log("geolocation", pos.coords);
        },
        () => {},
        { timeout: 8000 }
      );
    }
  };

  return (
    <div className="px-5">
      <div className="grid gap-3">
        {OPTIONS.map(({ key, icon: Icon, labelKey }) => {
          const selected = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={key === "auto" ? requestGeo : () => onModeChange(key)}
              className={cn(
                "flex items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-300",
                selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-medium text-foreground">{t(labelKey)}</span>
            </button>
          );
        })}
      </div>

      {mode === "manual" && (
        <div className="mt-4 animate-[fadeIn_0.3s_ease]">
          <input
            type="text"
            value={manualLocation}
            onChange={(e) => onManualChange(e.target.value)}
            placeholder="Stadt oder Region"
            className="w-full rounded-2xl border border-input bg-card px-4 py-3.5 text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
      )}
    </div>
  );
}