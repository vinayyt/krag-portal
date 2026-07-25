import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { fetchAdminData } from "@/lib/admin-data";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "BUILDER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const buyers = await fetchAdminData();
  return NextResponse.json(buyers);
}
