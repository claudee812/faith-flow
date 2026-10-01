import React from "react";
import { getTheme } from "@/themes/religionThemes";

// Subtle, religion-specific decorative SVG. Rendered at low opacity so it
// reads as craft, not clutter. Driven by the active religion's motif key.
export default function ReligionMotif({ religion, className = "", variant = "header" }) {
  const theme = getTheme(religion);
  const motif = theme.motif;

  const common = {
    className,
    "aria-hidden": true,
    preserveAspectRatio: "xMidYMid slice",
  };

  if (motif === "arabesque") {
    // Islam: eight-point star tessellation + crescent
    return (
      <svg viewBox="0 0 200 200" fill="none" {...common}>
        <defs>
          <pattern id="arabesque" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(22.5)">
            <path d="M20 2 L26 14 L38 20 L26 26 L20 38 L14 26 L2 20 L14 14 Z" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="20" r="3" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#arabesque)" />
        {variant === "header" && (
          <g opacity="0.9">
            <path d="M150 40 a22 22 0 1 0 14 38 a28 28 0 1 1 -14 -38 Z" fill="currentColor" />
          </g>
        )}
      </svg>
    );
  }

  if (motif === "light") {
    // Christianity: arched window + light rays
    return (
      <svg viewBox="0 0 200 200" fill="none" {...common}>
        <defs>
          <radialGradient id="lightglow" cx="50%" cy="35%" r="60%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.5" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill="url(#lightglow)" />
        <g stroke="currentColor" strokeWidth="1.2" opacity="0.6">
          <path d="M100 10 L100 60" />
          <path d="M70 18 L88 64" />
          <path d="M130 18 L112 64" />
          <path d="M44 36 L78 70" />
          <path d="M156 36 L122 70" />
        </g>
        {variant === "header" && (
          <g stroke="currentColor" strokeWidth="1.4" fill="none" opacity="0.7">
            <path d="M70 110 L70 160 a30 30 0 0 0 60 0 L130 110 Z" />
            <path d="M100 110 L100 160" />
            <path d="M70 135 L130 135" />
          </g>
        )}
      </svg>
    );
  }

  if (motif === "star") {
    // Judaism: Star of David grid
    return (
      <svg viewBox="0 0 200 200" fill="none" {...common}>
        <defs>
          <pattern id="stargrid" width="44" height="44" patternUnits="userSpaceOnUse">
            <g stroke="currentColor" strokeWidth="1" opacity="0.7">
              <path d="M22 6 L38 34 L6 34 Z" />
              <path d="M22 38 L6 10 L38 10 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="200" height="200" fill="url(#stargrid)" />
      </svg>
    );
  }

  // spark / neutral
  return (
    <svg viewBox="0 0 200 200" fill="none" {...common}>
      <g stroke="currentColor" strokeWidth="1" opacity="0.5">
        <circle cx="100" cy="100" r="60" />
        <circle cx="100" cy="100" r="40" />
        <circle cx="100" cy="100" r="20" />
      </g>
    </svg>
  );
}