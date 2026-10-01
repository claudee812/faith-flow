import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSettings } from "@/context/SettingsContext";

// Guards the in-app routes: if the user hasn't finished onboarding, send them
// to /onboarding. The onboarding page itself redirects back once complete.
export default function OnboardingGate({ children }) {
  const { loading, isOnboarded } = useSettings();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
  }

  return children;
}