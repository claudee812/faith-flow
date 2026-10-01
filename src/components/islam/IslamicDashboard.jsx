import React from "react";
import { Target } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/lib/AuthContext";
import ReligionMotif from "@/components/ReligionMotif";
import HomeCard from "@/components/HomeCard";
import { getHijriDateString } from "@/lib/prayer/hijriDate";
import { mockGoals } from "@/data/mockHome";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { usePrayerLog } from "@/hooks/usePrayerLog";
import { useRamadanDay } from "@/hooks/useRamadanDay";
import { useQuranProgress } from "@/hooks/useQuranProgress";
import NextPrayerCard from "./NextPrayerCard";
import PrayerListCard from "./PrayerListCard";
import PrayerProgressCard from "./PrayerProgressCard";
import AdditionalTimesCard from "./AdditionalTimesCard";
import JumuahCard from "./JumuahCard";
import RamadanBanner from "./RamadanBanner";
import RamadanTrackerCard from "./RamadanTrackerCard";
import QuranHomeCard from "./QuranHomeCard";
import { useCountdownText, MiniBar } from "./shared";

// Full Islam dashboard shown on the Home tab when Islam is selected.
export default function IslamicDashboard() {
  const { t } = useSettings();
  const { user } = useAuth();
  const name = user?.full_name || user?.email?.split("@")[0] || "";

  const { times, source, nextPrayer, statuses } = usePrayerTimes();
  const { logs, toggle, doneCount, weekCount, monthCount } = usePrayerLog();
  const ramadan = useRamadanDay();
  const quran = useQuranProgress();
  const countdownText = useCountdownText();

  const today = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const hijri = getHijriDateString(new Date());

  return (
    <div className="px-5 pt-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-primary text-primary-foreground p-6 mb-5">
        <ReligionMotif
          religion="islam"
          className="absolute -right-6 -top-6 h-40 w-40 text-primary-foreground/15"
        />
        <div className="relative">
          <p className="text-sm text-primary-foreground/85">
            {t("islam.greeting")}{name ? `, ${name}` : ""}
          </p>
          <h1 className="font-display text-2xl font-bold mt-1">{today}</h1>
          <p className="mt-1 text-sm text-primary-foreground/70">{hijri}</p>
          {nextPrayer && (
            <p className="mt-2 text-sm font-medium text-primary-foreground/85">
              {t("islam.prayer.next")}: {t(`islam.prayer.${nextPrayer.key}`)} ·{" "}
              {countdownText(nextPrayer.countdown)}
            </p>
          )}
        </div>
      </div>

      <NextPrayerCard nextPrayer={nextPrayer} source={source} />

      <PrayerListCard
        times={times}
        statuses={statuses}
        logs={logs}
        onToggle={toggle}
        source={source}
      />

      <PrayerProgressCard
        doneCount={doneCount}
        total={5}
        weekCount={weekCount}
        monthCount={monthCount}
      />

      <AdditionalTimesCard times={times} source={source} />

      <JumuahCard />

      {ramadan.active && ramadan.record && (
        <>
          <RamadanBanner
            times={times}
            dayNumber={ramadan.dayNumber}
            fastStatus={ramadan.record.fast_status}
            onSetStatus={(s) => ramadan.update({ fast_status: s })}
          />
          <RamadanTrackerCard
            dayNumber={ramadan.dayNumber}
            record={ramadan.record}
            onUpdate={ramadan.update}
            prayerDone={doneCount}
            quranPercent={quran.record?.progress_percent || 0}
          />
        </>
      )}

      <QuranHomeCard progress={quran.record} />

      {/* Goals */}
      <HomeCard icon={Target} title={t("home.card.goals")} mock={mockGoals.mock} mockLabel={t("home.mock.badge")}>
        <div className="grid gap-3">
          {mockGoals.items.map((g) => (
            <div key={g.title}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">{g.title}</span>
                <span className="text-sm text-muted-foreground">
                  {g.progress}
                  {g.unit}
                </span>
              </div>
              <MiniBar value={g.progress} total={100} />
            </div>
          ))}
        </div>
      </HomeCard>
    </div>
  );
}