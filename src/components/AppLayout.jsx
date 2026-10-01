import React from "react";
import { Outlet } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";
import BottomNav from "@/components/BottomNav";

// Mobile-first app shell: a centered phone-width column with a fixed bottom
// navigation. Content scrolls above the nav. Feels native, not like a website.
export default function AppLayout() {
  const { dir } = useSettings();
  return (
    <div className="min-h-[100dvh] w-full bg-muted/40 flex justify-center">
      <div
        dir={dir}
        className="relative w-full max-w-[480px] min-h-[100dvh] bg-background flex flex-col shadow-xl"
      >
        <main className="flex-1 overflow-y-auto pb-28 [scrollbar-width:none]">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}