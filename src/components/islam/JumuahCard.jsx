import React from "react";
import { Users } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { JUMUAH_CHECKLIST } from "@/data/islamConfig";
import { useJumuahEvent } from "@/hooks/useJumuahEvent";

// Friday prayer section: gentle preparation checklist + optional local mosque.
// Presented without implying a single "correct" tradition.
export default function JumuahCard() {
  const { t } = useSettings();
  const { record, todayIsFriday, friday, toggleCheck, update } = useJumuahEvent();

  const heading = todayIsFriday ? t("islam.jumuah.today") : t("islam.jumuah.next");
  const fridayLabel = new Date(friday).toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <HomeCard icon={Users} title={t("islam.jumuah.title")} className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-primary">{heading}</span>
        <span className="text-xs text-muted-foreground">{fridayLabel}</span>
      </div>
      <div className="grid gap-2">
        {JUMUAH_CHECKLIST.map((item) => {
          const checked = !!record?.[`checklist_${item.key}`];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggleCheck(item.key)}
              className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${
                  checked
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-transparent"
                }`}
              >
                ✓
              </span>
              <span className={`text-sm ${checked ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}
      </div>

      <label className="block mt-4">
        <span className="text-xs text-muted-foreground mb-1.5 block">{t("islam.jumuah.mosque")}</span>
        <input
          type="text"
          value={record?.mosque_name || ""}
          onChange={(e) => update({ mosque_name: e.target.value })}
          placeholder={t("islam.jumuah.mosquePlaceholder")}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </label>
    </HomeCard>
  );
}