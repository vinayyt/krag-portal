"use client";

import React from "react";

interface ProgressBarProps {
  value: number; // 0–100
  height?: number;
  color?: string;
  track?: string;
  className?: string;
}

export function ProgressBar({
  value,
  height = 8,
  color = "var(--accent)",
  track = "var(--surface-3)",
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        background: track,
        borderRadius: 999,
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: color,
          borderRadius: 999,
          transition: "width 0.8s cubic-bezier(0.2, 0.7, 0.3, 1)",
        }}
      />
    </div>
  );
}

interface RingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Ring({
  value,
  size = 86,
  strokeWidth = 8,
  color = "var(--accent)",
  children,
  className,
}: RingProps) {
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (circumference * clamped) / 100;

  return (
    <div
      className={className}
      style={{ position: "relative", width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-fill"
        />
      </svg>
      {children && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
