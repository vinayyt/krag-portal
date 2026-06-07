import { describe, it, expect } from "vitest";
import { scoreProject, computeRecommendations, deriveAddonsTotal } from "@/lib/recommendations";
import { PROJECTS, CHOICE_GROUPS } from "@/lib/data";
import type { QuestionAnswers } from "@/types";

const JUSTNES = PROJECTS.find((p) => p.id === "justnes")!;

describe("scoreProject()", () => {
  it("returns a score between 20 and 99", () => {
    const answers: QuestionAnswers = {
      situation: "family",
      type: "house",
      size: "large",
      bedrooms: "4",
      budget: "5-6m",
      priorities: ["outdoor", "view"],
      timing: "12months",
    };
    const result = scoreProject(JUSTNES, answers);
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeLessThanOrEqual(99);
  });

  it("gives higher score when type matches", () => {
    const matchingAnswers: QuestionAnswers = { type: "house" };
    const mismatchAnswers: QuestionAnswers = { type: "cabin" };
    const matchScore = scoreProject(JUSTNES, matchingAnswers).score;
    const mismatchScore = scoreProject(JUSTNES, mismatchAnswers).score;
    expect(matchScore).toBeGreaterThan(mismatchScore);
  });

  it("returns reasons array with BiStrings", () => {
    const answers: QuestionAnswers = { type: "house" };
    const result = scoreProject(JUSTNES, answers);
    expect(Array.isArray(result.reasons)).toBe(true);
    result.reasons.forEach((r) => {
      expect(r).toHaveProperty("no");
      expect(r).toHaveProperty("en");
    });
  });
});

describe("computeRecommendations()", () => {
  it("returns all projects sorted by score descending", () => {
    const answers: QuestionAnswers = { type: "house" };
    const results = computeRecommendations(answers, PROJECTS);
    expect(results).toHaveLength(PROJECTS.length);

    for (let i = 0; i < results.length - 1; i++) {
      expect(results[i].matchScore).toBeGreaterThanOrEqual(results[i + 1].matchScore);
    }
  });

  it("includes matchScore on each result", () => {
    const results = computeRecommendations({}, PROJECTS);
    results.forEach((r) => {
      expect(typeof r.matchScore).toBe("number");
    });
  });
});

describe("deriveAddonsTotal()", () => {
  it("sums prices of all selected options", () => {
    const total = deriveAddonsTotal(CHOICE_GROUPS);
    const expectedTotal = CHOICE_GROUPS.flatMap((g) =>
      g.options.filter((o) => o.selected).map((o) => o.price)
    ).reduce((a, b) => a + b, 0);
    expect(total).toBe(expectedTotal);
  });

  it("returns 0 when no options are selected", () => {
    const emptyGroups = CHOICE_GROUPS.map((g) => ({
      ...g,
      options: g.options.map((o) => ({ ...o, selected: false })),
    }));
    expect(deriveAddonsTotal(emptyGroups)).toBe(0);
  });

  it("returns correct total when all options are selected", () => {
    const allSelected = CHOICE_GROUPS.map((g) => ({
      ...g,
      options: g.options.map((o) => ({ ...o, selected: true })),
    }));
    const total = deriveAddonsTotal(allSelected);
    const expectedTotal = allSelected.flatMap((g) => g.options.map((o) => o.price)).reduce((a, b) => a + b, 0);
    expect(total).toBe(expectedTotal);
  });
});
