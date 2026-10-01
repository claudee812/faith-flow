import React from "react";
import { Check } from "lucide-react";
import { getDenominations } from "@/data/religionConfig";
import { cn } from "@/lib/utils";

// Step 3 — choose a denomination for the selected religion. Non-judgmental,
// always skippable.
export default function StepDenomination({ t, religion, value, onChange }) {
  const options = getDenominations(religion);
  return (
    <div className="px-5">
      <div className="grid gap-3">
        {options.map((d) => {
          const selected = value === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onChange(d.key)}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all duration-300",
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span className="font-medium text-foreground">{d.name}</span>
              {selected && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}