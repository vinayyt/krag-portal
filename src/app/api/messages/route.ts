/**
 * GET  /api/messages  — fetch thread for authenticated buyer
 * POST /api/messages  — send a message
 *
 * In production: auth middleware sets req.headers['x-buyer-id']
 * For now: returns seed data.
 */

import { NextRequest, NextResponse } from "next/server";
import { MESSAGES } from "@/lib/data";

export async function GET() {
  // TODO: auth guard + Prisma query by buyerId
  return NextResponse.json(MESSAGES);
}

export async function POST(req: NextRequest) {
  let body: { text: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 422 });
  }

  // TODO: save to Prisma, push real-time notification to advisor
  const created = {
    id: `m${Date.now()}`,
    from: "me" as const,
    text: { no: text, en: text },
    time: new Date().toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" }),
    date: { no: "Nå", en: "Now" },
  };

  return NextResponse.json(created, { status: 201 });
}
