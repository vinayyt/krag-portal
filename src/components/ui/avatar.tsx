import React from "react";
import { cn } from "@/lib/utils";

type AvatarTone = "primary" | "accent" | "soft";

interface AvatarProps {
  initials: string;
  size?: number;
  tone?: AvatarTone;
  src?: string;
  className?: string;
  alt?: string;
}

const toneStyles: Record<AvatarTone, string> = {
  primary: "bg-[var(--primary)] text-[var(--primary-ink)]",
  accent: "bg-[var(--accent)] text-white",
  soft: "bg-[var(--surface-3)] text-[var(--ink-2)]",
};

export function Avatar({ initials, size = 40, tone = "primary", src, className, alt }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full grid place-items-center font-semibold flex-shrink-0 overflow-hidden",
        toneStyles[tone],
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
      aria-label={alt || initials}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt || initials} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials
      )}
    </div>
  );
}
