import React, { useState } from "react";
import { Plus, CheckCircle2, Trash2, Bell, Heart } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { usePrayerJournal } from "@/hooks/usePrayerJournal";
import { PRAYER_CATEGORIES } from "@/data/christianConfig";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function PrayerJournalPage() {
  const { t } = useSettings();
  const { entries, create, update, remove } = usePrayerJournal();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", category: "other", content: "", reminder_time: "20:00", reminder_enabled: false });

  const submit = async () => {
    if (!draft.content.trim()) return;
    await create(draft);
    setDraft({ title: "", category: "other", content: "", reminder_time: "20:00", reminder_enabled: false });
    setOpen(false);
  };

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-1">{t("christian.journal.title")}</h1>
      <p className="text-sm text-muted-foreground mb-5">{t("christian.journal.private")}</p>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" /> {t("christian.journal.add")}
      </button>

      {open && (
        <HomeCard icon={Heart} title={t("christian.journal.prompt")} className="mb-4">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder={t("christian.journal.titleField")}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <textarea
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            placeholder={t("christian.journal.contentPlaceholder")}
            rows={4}
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <div className="mt-2 flex items-center gap-2">
            <Select value={draft.category} onValueChange={(v) => setDraft({ ...draft, category: v })}>
              <SelectTrigger className="flex-1 h-9 bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PRAYER_CATEGORIES.map((c) => (
                  <SelectItem key={c.key} value={c.key}>{t(c.labelKey)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="time"
              value={draft.reminder_time}
              onChange={(e) => setDraft({ ...draft, reminder_time: e.target.value })}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Switch checked={draft.reminder_enabled} onCheckedChange={(v) => setDraft({ ...draft, reminder_enabled: v })} />
            <Bell className="h-3.5 w-3.5" /> {t("christian.journal.reminder")}
          </label>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl px-3 py-1.5 text-sm text-muted-foreground">{t("common.cancel")}</button>
            <button type="button" onClick={submit} className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">{t("common.save")}</button>
          </div>
        </HomeCard>
      )}

      {entries.length === 0 && !open && (
        <p className="text-sm text-muted-foreground text-center mt-8">{t("christian.journal.empty")}</p>
      )}

      <div className="grid gap-3">
        {entries.map((e) => (
          <HomeCard key={e.id} icon={Heart} title={e.title || t(`christian.journal.cat.${e.category}`)}>
            <p className="text-sm text-foreground whitespace-pre-wrap">{e.content}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {t(`christian.journal.cat.${e.category}`)}
              </span>
              {e.reminder_enabled && e.reminder_time && (
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">🔔 {e.reminder_time}</span>
              )}
              {e.answered && (
                <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">{t("christian.journal.answered")}</span>
              )}
            </div>
            {e.answered && e.answered_note && (
              <p className="mt-2 text-xs text-muted-foreground italic">{e.answered_note}</p>
            )}
            <div className="mt-3 flex items-center gap-2">
              {!e.answered && (
                <button
                  type="button"
                  onClick={() => update(e.id, { answered: true })}
                  className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> {t("christian.journal.markAnswered")}
                </button>
              )}
              {e.answered && !e.answered_note && (
                <input
                  placeholder={t("christian.journal.answeredNote")}
                  onBlur={(ev) => update(e.id, { answered_note: ev.target.value })}
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
              <button type="button" onClick={() => remove(e.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </HomeCard>
        ))}
      </div>
    </div>
  );
}