import React from "react";
import { fmtNOK } from "@/lib/format";

interface MoneyProps {
  value: number;
  kr?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Money({ value, kr = true, className = "", style = {} }: MoneyProps) {
  return (
    <span
      className={`mono ${className}`}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
    >
      {fmtNOK(value, kr)}
    </span>
  );
}
