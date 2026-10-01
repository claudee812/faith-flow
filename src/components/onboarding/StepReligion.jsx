import React from "react";
import { MoonStar, Church, Star as StarOfDavid, Sparkles, Check } from "lucide-react";
import { RELIGIONS } from "@/data/religionConfig";
import { cn } from "@/lib/utils";

const ICONS = { MoonStar, Church, StarOfDavid, Sparkles };

// Step 2 — choose a religion. Selecting one live-previews its theme.
export default function StepReligion({ t, value, onChange }) {
  return (
    <div className="px-5">
      <div className="grid gap-3">
        {RELIGIONS.map((rel) => {
          const Icon = ICONS[rel.icon] || Sparkles;
          const selected = value === rel.key;
          return (
            <button
              key={rel.key}
              type="button"
              onClick={() => onChange(rel.key)}
              className={cn(
                "group flex items-center gap-4 rounded-3xl border p-4 text-left transition-all duration-300",
                selected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-card hover:border-primary/40"
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors",
                  selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="flex-1">
                <span className="block font-display text-lg font-semibold text-foreground">
                  {rel.name}
                </span>
                <span className="block text-sm text-muted-foreground leading-snug">
                  {rel.description}
                </span>
              </span>
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