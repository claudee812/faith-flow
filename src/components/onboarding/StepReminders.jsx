import React from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Step 5 — reminders. Enable now or configure later.
export default function StepReminders({ t, value, onChange }) {
  const options = [
    { key: "enable", icon: Bell, labelKey: "onboarding.reminders.enable" },
    { key: "later", icon: BellOff, labelKey: "onboarding.reminders.later" },
  ];
  return (
    <div className="px-5">
      <div className="grid gap-3">
        {options.map(({ key, icon: Icon, labelKey }) => {
          const selected = value === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
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
              <span className="flex-1 font-medium text-foreground">{t(labelKey)}</span>
              {selected && <Check className="h-5 w-5 text-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}