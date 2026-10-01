import React from "react";
import { CalendarHeart, TrendingUp, Target, BellRing, ChevronRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/lib/AuthContext";
import HomeCard from "@/components/HomeCard";
import ReligionMotif from "@/components/ReligionMotif";
import IslamicDashboard from "@/components/islam/IslamicDashboard";
import ChristianDashboard from "@/components/christian/ChristianDashboard";
import JewishDashboard from "@/components/jewish/JewishDashboard";
import {
  mockNextEvent,
  mockDailyProgress,
  mockGoals,
  mockUpcoming,
  mockReligiousDate,
} from "@/data/mockHome";

function greetingKey() {
  const h = new Date().getHours();
  if (h < 11) return "home.greeting.morning";
  if (h < 18) return "home.greeting.day";
  return "home.greeting.evening";
}

export default function Home() {
  const { t, settings, themeReligion } = useSettings();
  const { user } = useAuth();
  if (themeReligion === "islam") return <IslamicDashboard />;
  if (themeReligion === "christianity") return <ChristianDashboard />;
  if (themeReligion === "judaism") return <JewishDashboard />;
  const name = settings?.display_name || user?.full_name || user?.email?.split("@")[0] || "";
  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const relDate = mockReligiousDate(themeReligion);

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-6">
        <ReligionMotif
          religion={themeReligion}
          className="absolute -right-6 -top-6 h-40 w-40 text-primary-foreground/15"
        />
        <div className="relative">
          <p className="text-sm text-primary-foreground/80">{t(greetingKey())}{name ? `, ${name}` : ""}</p>
          <h1 className="font-display text-2xl font-bold mt-1">{today}</h1>
          {relDate?.value && relDate.value !== "—" && (
            <p className="mt-1 text-sm text-primary-foreground/70">{relDate.value}</p>
          )}
        </div>
      </div>

      {/* Today section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl font-bold text-foreground">{t("home.section.today")}</h2>
      </div>

      <div className="grid gap-4">
        {/* Next event */}
        <HomeCard
          icon={CalendarHeart}
          title={t("home.card.nextEvent")}
          mock={mockNextEvent.mock}
          mockLabel={t("home.mock.badge")}
          action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
        >
          <p className="font-display text-lg font-semibold text-foreground">{mockNextEvent.title}</p>
          <p className="text-sm text-muted-foreground">{mockNextEvent.subtitle}</p>
          <p className="mt-2 text-sm font-medium text-primary">{mockNextEvent.date} · {mockNextEvent.detail}</p>
        </HomeCard>

        {/* Daily progress */}
        <HomeCard
          icon={TrendingUp}
          title={t("home.card.dailyProgress")}
          mock={mockDailyProgress.mock}
          mockLabel={t("home.mock.badge")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">
              {mockDailyProgress.completed} / {mockDailyProgress.total}
            </span>
            <span className="text-sm font-semibold text-primary">
              {Math.round((mockDailyProgress.completed / mockDailyProgress.total) * 100)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${(mockDailyProgress.completed / mockDailyProgress.total) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            {mockDailyProgress.items.map((it) => (
              <div key={it.label} className="flex items-center gap-2.5 text-sm">
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                    it.done ? "bg-primary text-primary-foreground" : "border border-border text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className={it.done ? "text-foreground" : "text-muted-foreground"}>{it.label}</span>
              </div>
            ))}
          </div>
        </HomeCard>

        {/* Goals */}
        <HomeCard
          icon={Target}
          title={t("home.card.goals")}
          mock={mockGoals.mock}
          mockLabel={t("home.mock.badge")}
          action={<ChevronRight className="h-5 w-5 text-muted-foreground" />}
        >
          <div className="grid gap-3">
            {mockGoals.items.map((g) => (
              <div key={g.title}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{g.title}</span>
                  <span className="text-sm text-muted-foreground">{g.progress}{g.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-500"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </HomeCard>

        {/* Upcoming */}
        <HomeCard
          icon={BellRing}
          title={t("home.card.upcoming")}
          mock={mockUpcoming.mock}
          mockLabel={t("home.mock.badge")}
        >
          <div className="grid gap-2.5">
            {mockUpcoming.items.map((u) => (
              <div key={u.title} className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{u.title}</span>
                <span className="text-sm text-muted-foreground">{u.when}</span>
              </div>
            ))}
          </div>
        </HomeCard>
      </div>
    </div>
  );
}