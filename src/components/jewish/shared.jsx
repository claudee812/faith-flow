import React from "react";
import { cn } from "@/lib/utils";

// Shared Jewish-module UI primitives, mirroring the Islam/Christian shared
// components so all three modules feel like one product.

export function MiniBar({ value, total, className }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className={cn("h-2 rounded-full bg-muted overflow-hidden", className)}>
      <div
        className="h-full rounded-full bg-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function StatusBadge({ children, tone = "muted" }) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent text-accent-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide", tones[tone])}>
      {children}
    </span>
  );
}

export function MockBadge({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
      {label}
    </span>
  );
}