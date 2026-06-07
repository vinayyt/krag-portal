import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

type TagTone = "neutral" | "good" | "warn" | "accent" | "solid";
type TagSize = "sm" | "md";

interface TagProps {
  children: React.ReactNode;
  tone?: TagTone;
  size?: TagSize;
  icon?: string;
  className?: string;
  style?: React.CSSProperties;
}

const toneStyles: Record<TagTone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--ink-2)]",
  good: "bg-[var(--good-soft)] text-[var(--good)]",
  warn: "bg-[var(--warn-soft)] text-[var(--warn)]",
  accent: "bg-[var(--accent-soft)] text-[var(--accent)]",
  solid: "bg-[var(--ink)] text-[var(--surface)]",
};

export function Tag({ children, tone = "neutral", size = "md", icon, className, style }: TagProps) {
  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold tracking-[-0.01em] whitespace-nowrap",
        size === "sm" ? "px-[9px] py-[3px] text-[11.5px]" : "px-[11px] py-[5px] text-[12.5px]",
        toneStyles[tone],
        className
      )}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}
