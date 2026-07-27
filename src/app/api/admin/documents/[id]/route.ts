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

  const body: {
    nameNo?: string;
    nameEn?: string;
    cat?: string;
    signed?: boolean | null;
    fileUrl?: string | null;
    size?: string;
  } = await req.json();

  const updated = await prisma.document.update({
    where: { id: Number(params.id) },
    data: {
      ...(body.nameNo !== undefined ? { nameNo: body.nameNo } : {}),
      ...(body.nameEn !== undefined ? { nameEn: body.nameEn } : {}),
      ...(body.cat !== undefined ? { cat: body.cat } : {}),
      ...(body.signed !== undefined ? { signed: body.signed } : {}),
      ...(body.fileUrl !== undefined ? { fileUrl: body.fileUrl } : {}),
      ...(body.size !== undefined ? { size: body.size } : {}),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") return builderOnly();

  await prisma.document.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
