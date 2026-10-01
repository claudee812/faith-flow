import React from "react";
import { Target } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/lib/AuthContext";
import ReligionMotif from "@/components/ReligionMotif";
import HomeCard from "@/components/HomeCard";
import { featuresForDenomination } from "@/data/jewishConfig";
import { formatHebrewDate } from "@/lib/jewish/hebrewDate";
import { getUpcomingHolidays, holidayOnDate, daysUntilNextHoliday } from "@/lib/jewish/jewishHolidays";
import { mockGoals } from "@/data/mockHome";
import { MiniBar } from "@/components/jewish/shared";
import HebrewDateCard from "./HebrewDateCard";
import JewishPrayerCard from "./JewishPrayerCard";
import ShabbatCard from "./ShabbatCard";
import TorahHomeCard from "./TorahHomeCard";
import HolidayCard from "./HolidayCard";

function greetingKey() {
  const h = new Date().getHours();
  if (h < 11) return "home.greeting.morning";
  if (h < 18) return "home.greeting.day";
  return "home.greeting.evening";
}

const FEATURE_COMPONENTS = {
  hebrew_date: () => <HebrewDateCard />,
  prayer: () => <JewishPrayerCard />,
  shabbat: () => <ShabbatCard />,
  torah: () => <TorahHomeCard />,
  holidays: () => <HolidayCard />,
};

// Judaism dashboard on the Home tab. Cards are ordered by the denomination's
// feature config so each tradition sees relevant modules — and the Hebrew
// date + Shabbat always anchor the top.
export default function JewishDashboard() {
  const { t, settings } = useSettings();
  const { user } = useAuth();
  const name = settings?.display_name || user?.full_name || user?.email?.split("@")[0] || "";
  const denom = settings?.denomination || "judaism_orthodox";

  const hd = formatHebrewDate(new Date());
  const today = new Date().toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  const todayHoliday = holidayOnDate(new Date());
  const days = daysUntilNextHoliday(new Date());
  const nextHoliday = getUpcomingHolidays(new Date(), 1)[0];

  // Anchor cards always present, then denomination-toggled modules.
  const features = featuresForDenomination(denom).filter((f) => FEATURE_COMPONENTS[f.key]);

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-5">
        <ReligionMotif religion="judaism" className="absolute -right-6 -top-6 h-40 w-40 text-primary-foreground/15" />
        <div className="relative">
          <p className="text-sm text-primary-foreground/85">
            {t(greetingKey())}{name ? `, ${name}` : ""}
          </p>
          <h1 className="font-display text-2xl font-bold mt-1">{today}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{hd.full}</p>
          {todayHoliday ? (
            <p className="mt-2 text-sm font-medium text-primary-foreground/90">
              {t("jewish.holidays.today")}: {todayHoliday.name}
            </p>
          ) : nextHoliday ? (
            <p className="mt-2 text-sm font-medium text-primary-foreground/90">
              {days === 0
                ? `${nextHoliday.name} — ${t("jewish.holidays.tomorrow")}`
                : `${nextHoliday.name} — ${t("jewish.holidays.inDays").replace("{n}", days)}`}
            </p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4">
        <HebrewDateCard />
        <ShabbatCard />
        <JewishPrayerCard />
        <TorahHomeCard />
        <HolidayCard />
        {features.map((f) => (
          <div key={f.key}>{FEATURE_COMPONENTS[f.key]?.()}</div>
        ))}
      </div>

      {/* Goals — shared across traditions */}
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