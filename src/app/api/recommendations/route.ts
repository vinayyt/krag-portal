import { NextRequest, NextResponse } from "next/server";
import { PROJECTS } from "@/lib/data";
import { computeRecommendations } from "@/lib/recommendations";
import type { QuestionAnswers } from "@/types";

export async function POST(req: NextRequest) {
  let answers: QuestionAnswers;
  try {
    answers = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const results = computeRecommendations(answers, PROJECTS);
  return NextResponse.json(results);
}
