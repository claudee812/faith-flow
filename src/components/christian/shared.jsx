import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

export function MiniBar({ value, total }) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function DoneToggle({ done, onClick, label }) {
  const { t } = useSettings();
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
        done ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-muted/50"
      }`}
    >
      <span className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${done ? "border-primary-foreground" : "border-border"} ${done ? "" : "text-transparent"}`}>✓</span>
      {label || t("christian.prayer.done")}
    </button>
  );
}

export function AddSlotForm({ onAdd }) {
  const { t } = useSettings();
  const [open, setOpen] = React.useState(false);
  const [label, setLabel] = React.useState("");
  const [time, setTime] = React.useState("12:00");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-2.5 text-sm text-muted-foreground hover:bg-muted/40"
      >
        <Plus className="h-4 w-4" /> {t("christian.prayer.add")}
      </button>
    );
  }

  const submit = () => {
    if (!label.trim()) return;
    onAdd(label.trim(), time);
    setLabel("");
    setTime("12:00");
    setOpen(false);
  };

  return (
    <div className="mt-3 rounded-2xl border border-border bg-muted/30 p-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={t("christian.prayer.addLabel")}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-3 py-1.5 text-sm text-muted-foreground">
          {t("common.cancel")}
        </button>
        <button type="button" onClick={submit} className="rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
          {t("common.save")}
        </button>
      </div>
    </div>
  );
}

export { Trash2 };