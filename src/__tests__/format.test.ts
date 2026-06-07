import { describe, it, expect } from "vitest";
import { pick, fmtNOK, fmtNOKen, formatMoney, getBookingSlots } from "@/lib/format";

describe("pick()", () => {
  const str = { no: "Hei verden", en: "Hello world" };

  it("returns Norwegian string for nb locale", () => {
    expect(pick(str, "nb")).toBe("Hei verden");
  });

  it("returns English string for en locale", () => {
    expect(pick(str, "en")).toBe("Hello world");
  });

  it("falls back to Norwegian for unknown locale", () => {
    expect(pick(str, "de" as any)).toBe("Hei verden");
  });
});

describe("fmtNOK()", () => {
  it("formats 5490000 with space separator", () => {
    const result = fmtNOK(5_490_000);
    // Should contain spaces as thousand separator and kr
    expect(result).toMatch(/5[\s ]490[\s ]000/);
    expect(result).toContain("kr");
  });

  it("formats without kr when withKr=false", () => {
    const result = fmtNOK(1_200_000, false);
    expect(result).not.toContain("kr");
  });

  it("formats small amounts correctly", () => {
    const result = fmtNOK(50_000);
    expect(result).toMatch(/50[\s ]000/);
  });
});

describe("fmtNOKen()", () => {
  it("formats with comma separator and NOK", () => {
    const result = fmtNOKen(5_490_000);
    expect(result).toContain("5,490,000");
    expect(result).toContain("NOK");
  });
});

describe("formatMoney()", () => {
  it("uses Norwegian format for nb locale", () => {
    const result = formatMoney(1_000_000, "nb");
    expect(result).toContain("kr");
  });

  it("uses English format for en locale", () => {
    const result = formatMoney(1_000_000, "en");
    expect(result).toContain("NOK");
  });
});

describe("getBookingSlots()", () => {
  it("returns the requested number of slots", () => {
    const slots = getBookingSlots(5, "nb");
    expect(slots).toHaveLength(5);
  });

  it("each slot has times array", () => {
    const slots = getBookingSlots(3, "en");
    slots.forEach((slot) => {
      expect(Array.isArray(slot.times)).toBe(true);
      expect(slot.times.length).toBeGreaterThan(0);
    });
  });

  it("skips weekends (no Saturday or Sunday)", () => {
    const slots = getBookingSlots(10, "nb");
    slots.forEach((slot) => {
      const d = new Date(slot.date);
      const dow = d.getDay(); // 0=Sun, 6=Sat
      expect(dow).not.toBe(0);
      expect(dow).not.toBe(6);
    });
  });

  it("returns bilingual dayLabel", () => {
    const slots = getBookingSlots(1, "nb");
    expect(slots[0].dayLabel).toHaveProperty("no");
    expect(slots[0].dayLabel).toHaveProperty("en");
  });
});
