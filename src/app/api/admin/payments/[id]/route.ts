import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: { status: string } = await req.json();
  if (!["paid", "upcoming"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  const updated = await prisma.payment.update({
    where: { id: Number(params.id) },
    data: { status: body.status },
  });

  return NextResponse.json(updated);
}
