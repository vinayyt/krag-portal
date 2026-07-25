import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  let body: { text: string; locale?: string };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) return NextResponse.json({ error: "text is required" }, { status: 422 });

  const buyer = await prisma.buyer.findUnique({ where: { userId: session.user.id } });
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  const now = new Date();
  const timeStr = now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

  const msg = await prisma.message.create({
    data: {
      buyerId: buyer.id,
      advisorId: buyer.advisorId,
      from: "me",
      textNo: text,
      textEn: text,
      time: timeStr,
      dateNo: dateStr,
      dateEn: dateStr,
    },
  });

  return NextResponse.json({
    id: msg.id,
    from: "me",
    text: { no: text, en: text },
    time: timeStr,
    date: { no: dateStr, en: dateStr },
  }, { status: 201 });
}
