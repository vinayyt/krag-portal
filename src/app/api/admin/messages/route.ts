import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { buyerId: string; text: string } = await req.json();
  if (!body.buyerId || !body.text?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const buyer = await prisma.buyer.findUnique({ where: { id: body.buyerId } });
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  const now = new Date();
  const timeStr = now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });

  const msg = await prisma.message.create({
    data: {
      buyerId: buyer.id,
      advisorId: buyer.advisorId,
      from: "advisor",
      textNo: body.text.trim(),
      textEn: body.text.trim(),
      time: timeStr,
      dateNo: dateStr,
      dateEn: dateStr,
    },
  });

  return NextResponse.json(msg, { status: 201 });
}
