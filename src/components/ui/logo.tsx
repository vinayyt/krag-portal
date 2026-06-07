import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  dark?: boolean; // for dark sidebar
  className?: string;
}

const sizes = {
  sm: { mark: 22, wordmark: 16 },
  md: { mark: 28, wordmark: 20 },
  lg: { mark: 36, wordmark: 26 },
};

/**
 * Krag logo — roof mark SVG + wordmark text.
 * In production, replace with actual SVG brand asset from Krag.
 */
export function Logo({ size = "md", dark = false, className }: LogoProps) {
  const s = sizes[size];
  const color = dark ? "#fff" : "var(--primary)";

  return (
    <div
      className={cn("flex items-center gap-2 select-none", className)}
      aria-label="Krag Gruppen"
    >
      {/* Roof mark — simplified gable / roofline icon */}
      <svg
        width={s.mark}
        height={s.mark}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
      >
        {/* Roof peak */}
        <path
          d="M4 20 L16 6 L28 20"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* House body */}
        <path
          d="M8 20 L8 27 L24 27 L24 20"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Door */}
        <path
          d="M14 27 L14 22 L18 22 L18 27"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {/* Wordmark */}
      <span
        style={{
          fontSize: s.wordmark,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color,
          fontFamily: '"Schibsted Grotesk", sans-serif',
          lineHeight: 1,
        }}
      >
        Krag
      </span>
    </div>
  );
}
