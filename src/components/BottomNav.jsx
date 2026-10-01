import React from "react";
import { NavLink } from "react-router-dom";
import { Home, CalendarDays, Target, BookOpen, User } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

// Bottom navigation. Items are data-driven so later steps can add entries
// (e.g. "Gebet", "Fasten") without rewriting the component.
const BASE_ITEMS = [
  { to: "/", icon: Home, labelKey: "nav.home", end: true },
  { to: "/calendar", icon: CalendarDays, labelKey: "nav.calendar" },
  { to: "/tracker", icon: Target, labelKey: "nav.tracker" },
  null, // 4th slot is religion-aware (Qur'an for Islam)
  { to: "/profile", icon: User, labelKey: "nav.profile" },
];

function fourthItem(religion) {
  if (religion === "islam") return { to: "/content", icon: BookOpen, labelKey: "nav.quran" };
  if (religion === "christianity") return { to: "/content", icon: BookOpen, labelKey: "nav.bible" };
  return { to: "/content", icon: BookOpen, labelKey: "nav.content" };
}

export default function BottomNav() {
  const { t, themeReligion } = useSettings();
  const NAV_ITEMS = BASE_ITEMS.map((it, i) => (i === 3 ? fourthItem(themeReligion) : it));
  return (
    <nav className="absolute bottom-0 inset-x-0 z-30">
      <div className="mx-3 mb-3 rounded-[1.75rem] border border-border/60 bg-card/90 backdrop-blur-xl shadow-lg shadow-black/5">
        <div className="grid grid-cols-5 px-2 py-2">
          {NAV_ITEMS.map(({ to, icon: Icon, labelKey, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center gap-1 py-2 rounded-2xl transition-all duration-300",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300",
                      isActive ? "bg-primary/10 scale-105" : "bg-transparent"
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  <span className="text-[10px] font-medium leading-none">{t(labelKey)}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}