import React from "react";
import { Link } from "react-router-dom";
import { Target, BookOpen, Church, Plus } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/lib/AuthContext";
import ReligionMotif from "@/components/ReligionMotif";
import HomeCard from "@/components/HomeCard";
import { featuresForDenomination } from "@/data/christianConfig";
import { getCurrentSeason } from "@/lib/christian/churchYear";
import { mockGoals } from "@/data/mockHome";
import { useChristianPrayer } from "@/hooks/useChristianPrayer";
import { useBibleProgress } from "@/hooks/useBibleProgress";
import { MiniBar } from "@/components/islam/shared";
import PrayerRoutineCard from "./PrayerRoutineCard";
import BibleHomeCard from "./BibleHomeCard";
import ServiceHomeCard from "./ServiceHomeCard";
import ChurchYearCard from "./ChurchYearCard";
import RosaryCard from "./RosaryCard";
import SaintsCard from "./SaintsCard";
import ConfessionCard from "./ConfessionCard";
import OrthodoxFastsCard from "./OrthodoxFastsCard";
import DailyOfficeCard from "./DailyOfficeCard";
import WorshipCard from "./WorshipCard";

function greetingKey() {
  const h = new Date().getHours();
  if (h < 11) return "home.greeting.morning";
  if (h < 18) return "home.greeting.day";
  return "home.greeting.evening";
}

function nextPrayerSlot(slots) {
  if (!slots?.length) return null;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  let best = null;
  let bestDiff = Infinity;
  for (const s of slots) {
    if (!s.time) continue;
    const [hh, mm] = s.time.split(":").map(Number);
    const diff = hh * 60 + mm - cur;
    if (diff > 0 && diff < bestDiff) {
      bestDiff = diff;
      best = s;
    }
  }
  return best || slots[0];
}

// Small link cards for the journal area and (catholic) mass.
function JournalLinkCard() {
  const { t } = useSettings();
  return (
    <HomeCard icon={Plus} title={t("christian.journal.title")}>
      <Link
        to="/journal"
        className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 py-2.5 text-sm font-medium text-primary hover:bg-primary/15"
      >
        {t("christian.journal.add")}
      </Link>
    </HomeCard>
  );
}

function MassLinkCard() {
  const { t } = useSettings();
  return (
    <HomeCard icon={Church} title={t("christian.feature.mass")}>
      <Link
        to="/service"
        className="block rounded-xl bg-muted/40 p-3 text-sm text-foreground hover:bg-muted/70"
      >
        {t("christian.service.title")} →
      </Link>
    </HomeCard>
  );
}

// Full Christianity dashboard on the Home tab. Cards are ordered by the
// denomination's feature config so each tradition sees relevant modules.
export default function ChristianDashboard() {
  const { t, settings } = useSettings();
  const { user } = useAuth();
  const name = settings?.display_name || user?.full_name || user?.email?.split("@")[0] || "";
  const denom = settings?.denomination || "protestant";

  const prayer = useChristianPrayer();
  const bible = useBibleProgress();
  const season = getCurrentSeason(new Date(), denom);

  const today = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const nextSlot = nextPrayerSlot(prayer.slots);

  const featureComponents = {
    prayer: () => <PrayerRoutineCard />,
    bible: () => <BibleHomeCard />,
    service: () => <ServiceHomeCard />,
    church_year: () => <ChurchYearCard denomination={denom} />,
    journal: () => <JournalLinkCard />,
    rosary: () => <RosaryCard />,
    mass: () => <MassLinkCard />,
    saints: () => <SaintsCard denomination={denom} />,
    confession: () => <ConfessionCard />,
    orthodox_fasts: () => <OrthodoxFastsCard />,
    daily_office: () => <DailyOfficeCard />,
    worship: () => <WorshipCard />,
  };

  const features = featuresForDenomination(denom);

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-5">
        <ReligionMotif religion="christianity" className="absolute -right-6 -top-6 h-40 w-40 text-primary-foreground/15" />
        <div className="relative">
          <p className="text-sm text-primary-foreground/85">
            {t(greetingKey())}{name ? `, ${name}` : ""}
          </p>
          <h1 className="font-display text-2xl font-bold mt-1">{today}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{t(season.labelKey)}</p>
          {nextSlot && (
            <p className="mt-2 text-sm font-medium text-primary-foreground/85">
              {t("christian.prayer.next")}: {t(nextSlot.labelKey) !== nextSlot.labelKey ? t(nextSlot.labelKey) : nextSlot.label} · {nextSlot.time}
            </p>
          )}
          <p className="mt-1 text-sm text-primary-foreground/70">
            {t("christian.home.todayReading")}: {bible.record?.book || "Matthäus"} {bible.record?.chapter || 1}
          </p>
        </div>
      </div>

      {/* Denomination-aware cards */}
      <div className="grid gap-4">
        {features.map((f) => (
          <div key={f.key}>{featureComponents[f.key]?.()}</div>
        ))}
      </div>

      {/* Goals — shared across denominations */}
      <HomeCard icon={Target} title={t("home.card.goals")} mock={mockGoals.mock} mockLabel={t("home.mock.badge")} className="mt-4">
        <div className="grid gap-3">
          {mockGoals.items.map((g) => (
            <div key={g.title}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{g.title}</span>
                <span className="text-sm text-muted-foreground">{g.progress}{g.unit}</span>
              </div>
              <MiniBar value={g.progress} total={100} />
            </div>
          ))}
        </div>
      </HomeCard>
    </div>
  );
}