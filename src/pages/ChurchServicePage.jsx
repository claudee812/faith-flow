import React from "react";
import { Church, Bell, CheckCircle2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import HomeCard from "@/components/HomeCard";
import { useChurchService } from "@/hooks/useChurchService";
import { SERVICE_CHECKLIST } from "@/data/christianConfig";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const DAYS = [
  { value: "sun", label: "Sonntag" },
  { value: "sat", label: "Samstag" },
  { value: "wed", label: "Mittwoch" },
  { value: "fri", label: "Freitag" },
  { value: "other", label: "Andere" },
];

export default function ChurchServicePage() {
  const { t } = useSettings();
  const { record, update, toggleCheck, markAttended } = useChurchService();

  return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-2xl font-bold text-foreground mb-5">{t("christian.service.title")}</h1>

      <HomeCard icon={Church} title={t("christian.service.title")} className="mb-4">
        <label className="block">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.service.day")}</span>
          <Select value={record?.day_of_week || "sun"} onValueChange={(v) => update({ day_of_week: v })}>
            <SelectTrigger className="w-full h-10 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DAYS.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </label>
        <label className="block mt-3">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.service.time")}</span>
          <input
            type="time"
            value={record?.service_time || "10:00"}
            onChange={(e) => update({ service_time: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="block mt-3">
          <span className="text-xs text-muted-foreground mb-1.5 block">{t("christian.service.community")}</span>
          <input
            type="text"
            value={record?.community_name || ""}
            onChange={(e) => update({ community_name: e.target.value })}
            placeholder={t("christian.service.communityPlaceholder")}
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <label className="mt-3 flex items-center gap-2 text-sm text-foreground">
          <Switch checked={!!record?.reminder_enabled} onCheckedChange={(v) => update({ reminder_enabled: v })} />
          <Bell className="h-4 w-4 text-muted-foreground" /> {t("christian.service.reminder")}
        </label>
      </HomeCard>

      <HomeCard icon={CheckCircle2} title={t("christian.service.checklist")} className="mb-4">
        <div className="grid gap-2">
          {SERVICE_CHECKLIST.map((item) => {
            const checked = !!record?.[`checklist_${item.key}`];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleCheck(item.key)}
                className="flex items-center gap-3 rounded-2xl bg-muted/40 px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-md border text-[11px] ${checked ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent"}`}>✓</span>
                <span className={`text-sm ${checked ? "text-foreground font-medium" : "text-muted-foreground"}`}>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={markAttended}
          className="mt-3 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("christian.service.markAttended")}
        </button>
        {record?.last_attended_date && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("christian.service.attended")}: {new Date(record.last_attended_date).toLocaleDateString("de-DE")}
          </p>
        )}
      </HomeCard>

      <p className="text-xs text-muted-foreground text-center">{t("christian.service.future")}</p>
    </div>
  );
}