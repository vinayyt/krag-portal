/**
 * Server-side recommendation scoring.
 * Takes questionnaire answers and ranks inventory projects.
 * Match score is computed from real logic — no fake numbers.
 */

import type { Project, QuestionAnswers, RecommendationResult } from "@/types";
import { PROJECTS } from "./data";

type ScoreReason = {
  no: string;
  en: string;
  points: number;
};

function scoreProject(
  project: Project,
  answers: QuestionAnswers
): { score: number; reasons: ScoreReason[] } {
  const reasons: ScoreReason[] = [];
  let score = 50; // base score

  // Q1: situation
  const situation = answers["situation"] as string | undefined;
  if (situation === "family" && (project.typeKey === "house" || project.typeKey === "duplex")) {
    score += 10;
    reasons.push({
      no: `Passer familier med ${project.bedrooms} soverom`,
      en: `Great for families with ${project.bedrooms} bedrooms`,
      points: 10,
    });
  }
  if (situation === "single" && project.typeKey === "town") {
    score += 8;
    reasons.push({
      no: "Kompakt og praktisk for én person",
      en: "Compact and practical for one person",
      points: 8,
    });
  }
  if (situation === "senior" && project.typeKey === "town") {
    score += 8;
    reasons.push({
      no: "Lite vedlikehold — mer tid til fritid",
      en: "Low maintenance — more leisure time",
      points: 8,
    });
  }

  // Q2: type
  const types = answers["type"] as string[] | undefined;
  if (types && types.includes(project.typeKey)) {
    score += 20;
    reasons.push({
      no: `Matcher din foretrukne boligtype`,
      en: `Matches your preferred home type`,
      points: 20,
    });
  }

  // Q3: area
  const areas = answers["area"] as string[] | undefined;
  const projectAreaKey = project.id === "justnes" || project.id === "soleieveien"
    ? "justvik"
    : project.id === "trollbaer"
    ? "lund"
    : project.id === "solfjell"
    ? "birkenes"
    : "";

  if (areas && projectAreaKey && areas.includes(projectAreaKey)) {
    score += 15;
    reasons.push({
      no: `Ligger i ønsket område`,
      en: `Located in your preferred area`,
      points: 15,
    });
  }

  // Q4: bedrooms
  const bedrooms = answers["bedrooms"] as string | undefined;
  if (bedrooms) {
    const bedroomMatch =
      (bedrooms === "3" && project.bedrooms.includes("3")) ||
      (bedrooms === "4" && project.bedrooms.includes("4")) ||
      (bedrooms === "1-2" && (project.typeKey === "cabin" || project.typeKey === "town")) ||
      (bedrooms === "5+" && (project.typeKey === "house" || project.typeKey === "duplex"));
    if (bedroomMatch) {
      score += 12;
      reasons.push({
        no: `${project.bedrooms} soverom passer behovet ditt`,
        en: `${project.bedrooms} bedrooms fits your needs`,
        points: 12,
      });
    }
  }

  // Q5: budget
  const budget = answers["budget"] as string | undefined;
  if (budget) {
    const price = project.priceFrom;
    const budgetMatch =
      (budget === "u4" && price < 4_000_000) ||
      (budget === "4-6" && price >= 4_000_000 && price < 6_000_000) ||
      (budget === "6-8" && price >= 6_000_000 && price < 8_000_000) ||
      (budget === "8+" && price >= 8_000_000);
    if (budgetMatch) {
      score += 15;
      reasons.push({
        no: `Prisen passer budsjettet ditt`,
        en: `Price fits your budget`,
        points: 15,
      });
    }
    // partial match (one bracket away)
    const partialMatch =
      (budget === "4-6" && price < 4_000_000) ||
      (budget === "6-8" && price >= 4_000_000 && price < 6_000_000) ||
      (budget === "8+" && price >= 6_000_000 && price < 8_000_000);
    if (partialMatch) {
      score += 5;
    }
  }

  // Q6: priorities
  const priorities = answers["priorities"] as string[] | undefined;
  if (priorities) {
    const tags = [...(project.tags.no), ...(project.why?.no ?? [])].join(" ").toLowerCase();
    if (priorities.includes("view") && (tags.includes("utsikt") || tags.includes("sjø"))) {
      score += 8;
      reasons.push({
        no: "Utsikt over sjø og natur",
        en: "Views of sea and nature",
        points: 8,
      });
    }
    if (priorities.includes("garden") && (project.typeKey === "house" || project.typeKey === "duplex")) {
      score += 6;
    }
    if (priorities.includes("central") && project.typeKey === "town") {
      score += 8;
    }
    if (priorities.includes("lowmaint") && (project.typeKey === "cabin" || project.typeKey === "town")) {
      score += 8;
    }
    if (priorities.includes("schools") && (project.id === "soleieveien" || project.id === "trollbaer")) {
      score += 6;
    }
  }

  // Q7: timing
  const timing = answers["timing"] as string | undefined;
  if (timing === "asap") {
    // Prefer projects that are for sale already
    if (project.status.no === "Til salgs" || project.status.no === "Salgsstart") score += 5;
  }
  if (timing === "1-2y") {
    score += 3; // all new-build projects work
  }

  // Use project's own blurb/why reasons as explanations if no specific reasons found
  if (reasons.length < 2 && project.why) {
    const existingKeys = new Set(reasons.map((r) => r.no));
    for (const why of project.why.no) {
      if (!existingKeys.has(why) && reasons.length < 3) {
        reasons.push({ no: why, en: project.why.en[project.why.no.indexOf(why)], points: 0 });
      }
    }
  }

  return { score: Math.min(99, Math.max(20, score)), reasons };
}

export function computeRecommendations(
  answers: QuestionAnswers,
  projects: Project[] = PROJECTS
): RecommendationResult[] {
  const scored = projects.map((p) => {
    const { score, reasons } = scoreProject(p, answers);
    return {
      ...p,
      matchScore: score,
      reasons: reasons.slice(0, 3).map(({ no, en }) => ({ no, en })),
    };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

/** Derive add-ons total from choice groups (single source of truth). */
export function deriveAddonsTotal(
  groups: Array<{ options: Array<{ price: number; selected: boolean }> }>
): number {
  return groups.reduce((total, group) => {
    const selected = group.options.find((o) => o.selected);
    return total + (selected?.price ?? 0);
  }, 0);
}
