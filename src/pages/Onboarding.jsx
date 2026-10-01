import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StepWelcome from "@/components/onboarding/StepWelcome";
import StepReligion from "@/components/onboarding/StepReligion";
import StepDenomination from "@/components/onboarding/StepDenomination";
import StepLocation from "@/components/onboarding/StepLocation";
import StepReminders from "@/components/onboarding/StepReminders";

const TOTAL = 5;

export default function Onboarding() {
  const { t, setThemeReligion, updateSettings } = useSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState({
    religion: "",
    denomination: "",
    locationMode: "later",
    manualLocation: "",
    reminders: "later",
  });

  const setReligion = (key) => {
    setDraft((d) => ({ ...d, religion: key, denomination: "" }));
    setThemeReligion(key); // live theme preview
  };

  const canProceed = () => {
    if (step === 1) return !!draft.religion;
    return true;
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      await updateSettings({
        religion: draft.religion,
        denomination: draft.denomination || "",
        location_mode: draft.locationMode,
        manual_location: draft.manualLocation || "",
        notifications_enabled: draft.reminders === "enable",
        language: "de",
        dark_mode: false,
        onboarding_complete: true,
      });
      navigate("/", { replace: true });
    } catch (e) {
      setSubmitting(false);
    }
  };

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else finish();
  };
  const back = () => (step > 0 ? setStep((s) => s - 1) : null);

  const titles = [
    null,
    t("onboarding.religion.title"),
    t("onboarding.denomination.title"),
    t("onboarding.location.title"),
    t("onboarding.reminders.title"),
  ];
  const subtitles = [
    null,
    t("onboarding.religion.subtitle"),
    t("onboarding.denomination.subtitle"),
    t("onboarding.location.subtitle"),
    t("onboarding.reminders.subtitle"),
  ];

  return (
    <div className="min-h-[100dvh] w-full bg-muted/40 flex justify-center">
      <div className="relative w-full max-w-[480px] min-h-[100dvh] bg-background flex flex-col shadow-xl">
        {/* progress */}
        <div className="px-6 pt-6">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-all duration-300",
                  i <= step ? "bg-primary" : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* header */}
        {step > 0 && (
          <div className="px-6 pt-8">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {titles[step]}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitles[step]}</p>
          </div>
        )}

        {/* content */}
        <div className="flex-1 px-1 py-6">
          {step === 0 && <StepWelcome t={t} />}
          {step === 1 && (
            <StepReligion t={t} value={draft.religion} onChange={setReligion} />
          )}
          {step === 2 && (
            <StepDenomination
              t={t}
              religion={draft.religion}
              value={draft.denomination}
              onChange={(key) => setDraft((d) => ({ ...d, denomination: key }))}
            />
          )}
          {step === 3 && (
            <StepLocation
              t={t}
              mode={draft.locationMode}
              onModeChange={(m) => setDraft((d) => ({ ...d, locationMode: m }))}
              manualLocation={draft.manualLocation}
              onManualChange={(v) => setDraft((d) => ({ ...d, manualLocation: v }))}
            />
          )}
          {step === 4 && (
            <StepReminders
              t={t}
              value={draft.reminders}
              onChange={(key) => setDraft((d) => ({ ...d, reminders: key }))}
            />
          )}
        </div>

        {/* footer */}
        <div className="px-5 pb-8 pt-2">
          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="ghost"
                size="lg"
                onClick={back}
                className="rounded-2xl px-4"
                disabled={submitting}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <Button
              size="lg"
              onClick={next}
              disabled={!canProceed() || submitting}
              className="flex-1 rounded-2xl h-14 text-base font-semibold"
            >
              {submitting && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
              {step === 0
                ? t("onboarding.welcome.cta")
                : step === TOTAL - 1
                ? t("onboarding.finish")
                : t("onboarding.next")}
              {!submitting && step > 0 && step < TOTAL - 1 && (
                <ChevronRight className="h-5 w-5 ml-1" />
              )}
            </Button>
          </div>
          {step === 2 && (
            <button
              type="button"
              onClick={next}
              className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {t("onboarding.denomination.skip")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}