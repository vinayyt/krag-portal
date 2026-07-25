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

  const body: {
    buyerId: string;
    titleNo: string;
    titleEn: string;
    typeNo: string;
    typeEn: string;
    dateNo: string;
    dateEn: string;
    time: string;
    online: boolean;
  } = await req.json();

  if (!body.buyerId || !body.titleNo || !body.dateNo || !body.time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const buyer = await prisma.buyer.findUnique({ where: { id: body.buyerId } });
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 });

  const meeting = await prisma.meeting.create({
    data: {
      buyerId: body.buyerId,
      advisorId: buyer.advisorId,
      titleNo: body.titleNo,
      titleEn: body.titleEn || body.titleNo,
      typeNo: body.typeNo || (body.online ? "Videomøte" : "Byggemøte"),
      typeEn: body.typeEn || (body.online ? "Video call" : "Site meeting"),
      dateNo: body.dateNo,
      dateEn: body.dateEn || body.dateNo,
      time: body.time,
      online: body.online ?? false,
      status: "upcoming",
    },
  });

  return NextResponse.json(meeting, { status: 201 });
}
