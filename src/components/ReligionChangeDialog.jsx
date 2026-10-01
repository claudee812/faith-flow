import React, { useState } from "react";
import { MoonStar, Church, Star, Sparkles, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RELIGIONS, getDenominations } from "@/data/religionConfig";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

const ICONS = { MoonStar, Church, Star, Sparkles };

// Lets the user change religion + denomination. Changing religion live-swaps
// the theme (via updateSettings) so the whole app restyles instantly.
export default function ReligionChangeDialog({ open, onOpenChange }) {
  const { t, settings, setThemeReligion, updateSettings } = useSettings();
  const [religion, setReligion] = useState(settings?.religion || "");
  const [denomination, setDenomination] = useState(settings?.denomination || "");

  const pickReligion = (key) => {
    setReligion(key);
    setDenomination("");
    setThemeReligion(key); // instant preview
  };

  const save = async () => {
    await updateSettings({ religion, denomination });
    onOpenChange(false);
  };

  const denominations = religion ? getDenominations(religion) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">{t("profile.changeReligion")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t("profile.changeReligionHint")}</p>
        </DialogHeader>

        <div className="max-h-[55vh] overflow-y-auto pr-1 -mr-1">
          <div className="grid gap-2 mb-4">
            {RELIGIONS.map((rel) => {
              const Icon = ICONS[rel.icon] || Sparkles;
              const selected = religion === rel.key;
              return (
                <button
                  key={rel.key}
                  type="button"
                  onClick={() => pickReligion(rel.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                    selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-medium text-foreground">{rel.name}</span>
                  {selected && <Check className="h-4 w-4 ml-auto text-primary" />}
                </button>
              );
            })}
          </div>

          {religion && denominations.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t("profile.denomination")}
              </p>
              <div className="grid gap-2">
                {denominations.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDenomination(d.key)}
                    className={cn(
                      "flex items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-all",
                      denomination === d.key ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <span className="text-sm font-medium text-foreground">{d.name}</span>
                    {denomination === d.key && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={save} disabled={!religion} className="rounded-xl">
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}