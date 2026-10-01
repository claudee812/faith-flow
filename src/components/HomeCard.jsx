import React from "react";
import { cn } from "@/lib/utils";

// Reusable premium card used across the Home screen.
export default function HomeCard({ icon: Icon, title, action, mock, mockLabel, className, children }) {
  return (
    <div
      className={cn(
        "rounded-[1.5rem] border border-border/70 bg-card p-5 shadow-sm shadow-black/[0.03] transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
          <h3 className="font-display text-base font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {mock && (
        <span className="mb-3 inline-flex items-center rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
          {mockLabel}
        </span>
      )}
      {children}
    </div>
  );
}