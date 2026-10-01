import React from "react";
import { Sunrise, Sun, Sunset, Bell } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { Switch } from "@/components/ui/switch";
import { useChristianPrayer } from "@/hooks/useChristianPrayer";
import { DoneToggle, AddSlotForm } from "./shared";
import { Trash2 } from "lucide-react";

const SLOT_ICONS = { morning: Sunrise, noon: Sun, evening: Sunset };

// Christian prayer routine: Morning / Noon / Evening + user-added slots, each
// with a time, reminder and a per-day done toggle. Presented as gentle rhythm.
export default function PrayerRoutineCard({ compact }) {
  const { t } = useSettings();
  const { slots, logs, toggle, doneCount, total, weekCount, addSlot, removeSlot, updateSettings } = useChristianPrayer();

  return (
    <HomeCard icon={Sunrise} title={t("christian.prayer.title")}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("christian.prayer.count").replace("{done}", doneCount).replace("{total}", total || 0)}
        </span>
        <span className="text-xs text-muted-foreground">{t("christian.prayer.week")}: {weekCount}</span>
      </div>

      <div className="grid gap-2.5">
        {slots.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("christian.prayer.empty")}</p>
        )}
        {slots.map((slot) => {
          const Icon = SLOT_ICONS[slot.key] || Sun;
          const done = !!logs[slot.key];
          return (
            <div key={slot.key} className="rounded-2xl bg-muted/40 p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{t(slot.labelKey) !== slot.labelKey ? t(slot.labelKey) : slot.label}</p>
                  <p className="text-xs text-muted-foreground">{slot.time || "—"}</p>
                </div>
                <DoneToggle done={done} onClick={() => toggle(slot)} />
              </div>
              <div className="mt-2 flex items-center justify-between pl-12">
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Bell className="h-3.5 w-3.5" />
                  {t("christian.prayer.reminder")}
                  <Switch
                    checked={!!slot.reminder_enabled}
                    onCheckedChange={(v) =>
                      updateSettings({ slots: slots.map((s) => (s.key === slot.key ? { ...s, reminder_enabled: v } : s)) })
                    }
                  />
                </label>
                {slot.custom && (
                  <button type="button" onClick={() => removeSlot(slot.key)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!compact && <AddSlotForm onAdd={addSlot} />}
    </HomeCard>
  );
}