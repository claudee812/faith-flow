import React from "react";
import { cn } from "@/lib/utils";

// High-quality, calm empty/error/loading states used across all three
// religions so the app never feels broken or unfinished. No information is
// conveyed by color alone — each state has an icon + label + description.

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-border/60 bg-card p-8 text-center">
      {Icon && (
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icon className="h-6 w-6" />
        </span>
      )}
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ icon: Icon, title, description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-destructive/30 bg-destructive/5 p-8 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        {Icon ? <Icon className="h-6 w-6" /> : <span aria-hidden>!</span>}
      </span>
      <p className="font-display text-base font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">{description}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Erneut versuchen
        </button>
      )}
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("rounded-[1.5rem] border border-border/60 bg-card p-5", className)}>
      <div className="mb-3 h-9 w-9 rounded-xl bg-muted/60 animate-pulse" />
      <div className="mb-2 h-4 w-1/2 rounded bg-muted/60 animate-pulse" />
      <div className="h-10 rounded bg-muted/40 animate-pulse" />
    </div>
  );
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}