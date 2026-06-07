"use client";

import React from "react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "soft" | "outline" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconRight?: string;
  full?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] text-[var(--primary-ink)]",
  accent: "bg-[var(--accent)] text-[var(--accent-ink)]",
  soft: "bg-[var(--surface-2)] text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--line)]",
  outline: "bg-transparent text-[var(--ink)] shadow-[inset_0_0_0_1.5px_var(--line)]",
  ghost: "bg-transparent text-[var(--ink-2)]",
  dark: "bg-[var(--ink)] text-[var(--surface)]",
};

const sizeStyles: Record<ButtonSize, { padding: string; text: string; height: string; iconSize: number }> = {
  sm: { padding: "px-3.5 py-2", text: "text-[13.5px]", height: "h-9", iconSize: 16 },
  md: { padding: "px-[18px] py-[11px]", text: "text-[14.5px]", height: "h-11", iconSize: 18 },
  lg: { padding: "px-6 py-[15px]", text: "text-[16px]", height: "h-[54px]", iconSize: 20 },
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  full,
  loading,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const sz = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-[transform,filter,box-shadow] duration-[120ms,150ms,150ms]",
        "active:scale-[0.97] hover:brightness-[0.97] whitespace-nowrap",
        "tracking-[-0.01em]",
        sz.padding,
        sz.text,
        sz.height,
        variantStyles[variant],
        full && "w-full",
        isDisabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {icon && !loading && <Icon name={icon} size={sz.iconSize} />}
      {loading && (
        <svg
          className="animate-spin"
          width={sz.iconSize}
          height={sz.iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      )}
      {children}
      {iconRight && <Icon name={iconRight} size={sz.iconSize} />}
    </button>
  );
}
