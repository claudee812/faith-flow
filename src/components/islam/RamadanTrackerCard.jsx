import React, { useState } from "react";
import { BookHeart, Sparkles, HeartHandshake, Moon } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { RAMADAN_FAST_TOTAL } from "@/data/islamConfig";
import { MiniBar } from "./shared";

// Ramadan tracker: fast days, prayers, Qur'an, Tarawih, Dhikr, Sadaqah.
// No competitive gamification — just personal, honest progress.
export default function RamadanTrackerCard({ dayNumber, record, onUpdate, prayerDone, quranPercent }) {
  const { t } = useSettings();

  const fastCompleted = record?.fast_status === "completed" ? 1 : 0;
  const tarawih = !!record?.tarawih;
  const sadaqah = !!record?.sadaqah;
  const quranPages = record?.quran_pages || 0;
  const dhikrCount = record?.dhikr_count || 0;

  const rows = [
    { label: t("islam.tracker.fasts"), value: `${fastCompleted}`, total: RAMADAN_FAST_TOTAL, showBar: true, barVal: fastCompleted, barTotal: RAMADAN_FAST_TOTAL },
    { label: t("islam.tracker.prayers"), value: `${prayerDone}`, total: 5, showBar: true, barVal: prayerDone, barTotal: 5 },
    { label: t("islam.tracker.quran"), value: `${quranPercent}%`, total: 100, showBar: true, barVal: quranPercent, barTotal: 100 },
  ];

  return (
    <HomeCard icon={Moon} title={t("islam.tracker.ramadan")} className="mb-4">
      <div className="grid gap-3 mb-4">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-foreground">{r.label}</span>
              <span className="text-sm font-semibold text-primary">
                {r.value}
                <span className="text-muted-foreground font-normal"> / {r.total}</span>
              </span>
            </div>
            <MiniBar value={r.barVal} total={r.barTotal} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ToggleRow
          icon={Moon}
          label={t("islam.tracker.tarawih")}
          checked={tarawih}
          onToggle={() => onUpdate({ tarawih: !tarawih })}
        />
        <ToggleRow
          icon={HeartHandshake}
          label={t("islam.tracker.sadaqah")}
          checked={sadaqah}
          onToggle={() => onUpdate({ sadaqah: !sadaqah })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <CounterRow
          icon={BookHeart}
          label={t("islam.tracker.quranPages")}
          value={quranPages}
          onAdd={() => onUpdate({ quran_pages: quranPages + 1 })}
          onSub={() => onUpdate({ quran_pages: Math.max(0, quranPages - 1) })}
        />
        <CounterRow
          icon={Sparkles}
          label={t("islam.tracker.dhikr")}
          value={dhikrCount}
          onAdd={() => onUpdate({ dhikr_count: dhikrCount + 1 })}
          onSub={() => onUpdate({ dhikr_count: Math.max(0, dhikrCount - 1) })}
        />
      </div>
    </HomeCard>
  );
}

function ToggleRow({ icon: Icon, label, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition-colors ${
        checked ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium flex-1">{label}</span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${
          checked ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent"
        }`}
      >
        ✓
      </span>
    </button>
  );
}

function CounterRow({ icon: Icon, label, value, onAdd, onSub }) {
  return (
    <div className="rounded-2xl bg-muted/50 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-xs text-muted-foreground flex-1">{label}</span>
      </div>
      <div className="flex items-center justify-between">
        <button type="button" onClick={onSub} className="h-7 w-7 rounded-full border border-border text-foreground">−</button>
        <span className="font-display text-lg font-bold text-foreground tabular-nums">{value}</span>
        <button type="button" onClick={onAdd} className="h-7 w-7 rounded-full bg-primary text-primary-foreground">+</button>
      </div>
    </div>
  );
}