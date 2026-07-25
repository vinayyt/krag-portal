import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function builderOnly() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") return builderOnly();

  const body: { pct?: number; status?: string } = await req.json();

  const updated = await prisma.phase.update({
    where: { id: params.id },
    data: {
      ...(typeof body.pct === "number" ? { pct: Math.min(100, Math.max(0, body.pct)) } : {}),
      ...(body.status ? { status: body.status } : {}),
    },
  });

  return NextResponse.json(updated);
}
