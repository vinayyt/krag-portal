"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accent?: boolean;
  hover?: boolean;
  pad?: "sm" | "md" | "lg";
}

export function Card({ children, accent, hover, pad = "md", className, ...props }: CardProps) {
  const padClass = { sm: "p-4", md: "p-[22px]", lg: "p-7" }[pad];
  return (
    <div
      {...props}
      className={cn(
        "bg-[var(--surface)] rounded-card border border-[var(--line)] shadow-sm relative",
        accent && "border-t-[3px] border-t-[var(--accent)]",
        hover && "card-hover cursor-pointer",
        padClass,
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
  icon?: string;
}

export function CardHeader({ title, sub, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div className="flex gap-[11px] items-center">
        {icon && (
          <span className="grid place-items-center w-[34px] h-[34px] rounded-[9px] bg-[var(--surface-2)] text-[var(--ink-2)] flex-shrink-0">
            <Icon name={icon} size={18} />
          </span>
        )}
        <div>
          <div className="text-[15.5px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
            {title}
          </div>
          {sub && (
            <div className="text-[13px] text-[var(--ink-3)] mt-0.5">{sub}</div>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
