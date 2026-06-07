/**
 * GET   /api/choices     — fetch choice groups for authenticated buyer
 * PATCH /api/choices/:id — update selected option for a group
 */

import { NextRequest, NextResponse } from "next/server";
import { CHOICE_GROUPS } from "@/lib/data";

export async function GET() {
  // TODO: auth guard + Prisma query by buyerId
  return NextResponse.json(CHOICE_GROUPS);
}

export async function PATCH(req: NextRequest) {
  let body: { groupId: string; optionId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { groupId, optionId } = body;
  if (!groupId || !optionId) {
    return NextResponse.json({ error: "groupId and optionId are required" }, { status: 422 });
  }

  // TODO: validate deadline not passed, update in Prisma
  return NextResponse.json({ groupId, optionId, saved: true });
}
