/**
 * Formatting helpers — currency, dates, i18n pick.
 * All using Intl for locale correctness.
 */

import type { BiString } from "@/types";

/** Pick a bilingual string value by locale. */
export function pick(obj: BiString | string | undefined, locale: string): string {
  if (obj == null) return "";
  if (typeof obj === "string") return obj;
  const lang = locale === "en" ? "en" : "no";
  return obj[lang] != null ? obj[lang] : obj.no;
}

/**
 * Format a number as Norwegian currency: "7 388 000 kr"
 * Uses spaces as thousand separators (nb-NO), kr suffix.
 */
export function fmtNOK(value: number, withKr = true): string {
  const formatter = new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  const formatted = formatter.format(Math.round(value));
  return withKr ? `${formatted} kr` : formatted;
}

/**
 * Format a number as NOK for English locale: "7,388,000 NOK"
 */
export function fmtNOKen(value: number): string {
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  return `${formatter.format(Math.round(value))} NOK`;
}

/** Format money respecting locale. */
export function formatMoney(value: number, locale: string): string {
  return locale === "en" ? fmtNOKen(value) : fmtNOK(value);
}

/**
 * Format a date as dd.mm.yyyy (nb-NO) or MMM d, yyyy (en)
 */
export function fmtDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nb-NO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

/** Format just weekday short name. */
export function fmtWeekday(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nb-NO", {
    weekday: "short",
  }).format(date);
}

/** Format just the day number. */
export function fmtDay(date: Date): string {
  return date.getDate().toString();
}

/** Format month short name. */
export function fmtMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nb-NO", {
    month: "short",
  }).format(date);
}

/** Compute how many days from now to a target date. */
export function daysUntil(targetISO: string): number {
  const now = new Date();
  const target = new Date(targetISO);
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Generate next N weekday booking slots from today. */
export function getBookingSlots(count = 10, locale: string) {
  const slots = [];
  const today = new Date();
  let current = new Date(today);
  current.setDate(current.getDate() + 1); // start from tomorrow

  while (slots.length < count) {
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) {
      // weekdays only
      const dateISO = current.toISOString().split("T")[0];
      slots.push({
        date: dateISO,
        dayLabel: {
          no: fmtWeekday(current, "nb"),
          en: fmtWeekday(current, "en"),
        },
        dayName: {
          no: fmtDay(current),
          en: fmtDay(current),
        },
        month: {
          no: fmtMonth(current, "nb"),
          en: fmtMonth(current, "en"),
        },
        times: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
      });
    }
    current = new Date(current);
    current.setDate(current.getDate() + 1);
  }
  return slots;
}
