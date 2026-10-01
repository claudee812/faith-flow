import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoonStar,
  Church,
  Star,
  Sparkles,
  MapPin,
  Globe,
  Bell,
  Moon,
  Shield,
  ChevronRight,
  LogOut,
  Pencil,
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/lib/AuthContext";
import { getReligion, getDenomination } from "@/data/religionConfig";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReligionChangeDialog from "@/components/ReligionChangeDialog";

const REL_ICONS = { MoonStar, Church, Star, Sparkles };
const LANGS = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "he", label: "עברית" },
];

function Row({ icon: Icon, label, children, onClick, trailing }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? "cursor-pointer hover:bg-muted/50" : ""}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {children}
      {trailing}
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div className="mb-6">
      <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="rounded-[1.5rem] border border-border/70 bg-card overflow-hidden divide-y divide-border/60">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  const { t, settings, themeReligion, darkMode, toggleDarkMode, language, setLanguage, updateSettings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [religionOpen, setReligionOpen] = useState(false);

  const rel = getReligion(settings?.religion);
  const denom = settings?.denomination ? getDenomination(settings.denomination) : null;
  const RelIcon = rel ? REL_ICONS[rel.icon] || Sparkles : Sparkles;
  const name = settings?.display_name || user?.full_name || user?.email?.split("@")[0] || "—";

  const locationLabel =
    settings?.location_mode === "auto"
      ? t("profile.location.auto")
      : settings?.location_mode === "manual"
      ? settings?.manual_location || t("profile.location.manual")
      : t("profile.location.later");

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <span className="font-display text-2xl font-bold text-primary">{name.charAt(0).toUpperCase()}</span>
        </div>
        <h1 className="font-display text-xl font-bold text-foreground">{name}</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      {/* Faith */}
      <Group title={t("profile.section.faith")}>
        <Row
          icon={RelIcon}
          label={t("profile.religion")}
          onClick={() => setReligionOpen(true)}
          trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />}
        >
          <span className="text-sm text-muted-foreground">{rel?.name || "—"}</span>
        </Row>
        <Row icon={Sparkles} label={t("profile.denomination")}>
          <span className="text-sm text-muted-foreground">{denom?.name || "—"}</span>
        </Row>
      </Group>

      {/* Preferences */}
      <Group title={t("profile.section.preferences")}>
        <Row icon={MapPin} label={t("profile.location")}>
          <span className="text-sm text-muted-foreground">{locationLabel}</span>
        </Row>
        <Row icon={Globe} label={t("profile.language")}>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[130px] h-9 border-0 bg-transparent shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGS.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>
        <Row icon={Bell} label={t("profile.notifications")}>
          <Switch
            checked={!!settings?.notifications_enabled}
            onCheckedChange={(v) => updateSettings({ notifications_enabled: v })}
          />
        </Row>
        <Row icon={Moon} label={t("profile.darkMode")}>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </Row>
      </Group>

      {/* Privacy */}
      <Group title={t("profile.section.privacy")}>
        <Row icon={Shield} label={t("profile.privacy")} trailing={<ChevronRight className="h-4 w-4 text-muted-foreground" />} />
      </Group>

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        {t("profile.logout")}
      </button>

      <p className="mt-6 text-center text-xs text-muted-foreground">FaithFlow · v0.1</p>

      <ReligionChangeDialog open={religionOpen} onOpenChange={setReligionOpen} />
    </div>
  );
}