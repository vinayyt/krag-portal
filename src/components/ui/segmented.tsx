"use client";

import React from "react";
import { Icon } from "./icon";

interface SegmentedOption {
  id: string;
  label: string;
  icon?: string;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (id: string) => void;
  size?: "sm" | "md";
  ariaLabel?: string;
}

export function Segmented({
  options,
  value,
  onChange,
  size = "md",
  ariaLabel,
}: SegmentedProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        background: "var(--surface-2)",
        borderRadius: 999,
        padding: 4,
        gap: 2,
        border: "1px solid var(--line)",
      }}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: size === "sm" ? "6px 12px" : "8px 15px",
              borderRadius: 999,
              fontSize: size === "sm" ? 13 : 13.5,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              background: active ? "var(--surface)" : "transparent",
              color: active ? "var(--ink)" : "var(--ink-3)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              transition: "all .15s ease",
              border: "none",
              cursor: "pointer",
            }}
          >
            {o.icon && <Icon name={o.icon} size={15} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
