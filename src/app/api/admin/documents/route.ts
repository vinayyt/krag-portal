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
    nameNo: string;
    nameEn?: string;
    cat: string;
    signed?: boolean | null;
  } = await req.json();

  if (!body.buyerId || !body.nameNo || !body.cat) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 422 });
  }

  const now = new Date();
  const dateNo = now.toLocaleDateString("nb-NO", { day: "numeric", month: "short", year: "numeric" });
  const dateEn = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  const doc = await prisma.document.create({
    data: {
      buyerId: body.buyerId,
      nameNo: body.nameNo,
      nameEn: body.nameEn || body.nameNo,
      cat: body.cat,
      dateNo,
      dateEn,
      size: "—",
      signed: body.signed ?? null,
      soon: false,
    },
  });

  return NextResponse.json(doc, { status: 201 });
}
