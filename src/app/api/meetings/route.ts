/**
 * GET  /api/meetings  — list meetings for buyer
 * POST /api/meetings  — book a new meeting
 */

import { NextRequest, NextResponse } from "next/server";
import { MEETINGS_DATA } from "@/lib/data";
import type { BookingRequest } from "@/types";

export async function GET() {
  return NextResponse.json({
    upcoming: MEETINGS_DATA.upcoming,
    past: MEETINGS_DATA.past,
  });
}

export async function POST(req: NextRequest) {
  let body: BookingRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, date, time } = body;
  if (!type || !date || !time) {
    return NextResponse.json(
      { error: "type, date and time are required" },
      { status: 422 }
    );
  }

  // TODO: check slot availability, persist in Prisma, send calendar invite
  return NextResponse.json(
    {
      id: Date.now(),
      type,
      date,
      time,
      confirmed: true,
    },
    { status: 201 }
  );
}
