/**
 * Server-side data fetcher for the builder admin panel.
 * Returns all buyers for all projects managed by this builder.
 * Import ONLY in Server Components or API routes.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface AdminBuyer {
  id: string;
  name: string;
  fullName: string;
  email: string;
  advisorId: string;
  advisorName: string;
  projectName: string;
  unitLabel: string;
  phases: AdminPhase[];
  payments: AdminPayment[];
  documents: AdminDocument[];
  meetings: AdminMeeting[];
  messages: AdminMessage[];
}

export interface AdminPhase {
  id: string;
  nameNo: string;
  nameEn: string;
  pct: number;
  status: string;
  dateNo: string;
  dateEn: string;
  sortOrder: number;
}

export interface AdminPayment {
  id: number;
  labelNo: string;
  labelEn: string;
  amount: number;
  pct: string;
  status: string;
  dateNo: string;
  dateEn: string;
}

export interface AdminDocument {
  id: number;
  nameNo: string;
  nameEn: string;
  cat: string;
  dateNo: string;
  dateEn: string;
  size: string;
  signed: boolean | null;
  soon: boolean;
  fileUrl: string | null;
}

export interface AdminMeeting {
  id: number;
  titleNo: string;
  titleEn: string;
  typeNo: string;
  typeEn: string;
  dateNo: string;
  dateEn: string;
  time: string;
  online: boolean;
  status: string;
}

export interface AdminMessage {
  id: string;
  from: string;
  textNo: string;
  time: string;
  dateNo: string;
  createdAt: Date;
}

export async function fetchAdminData(): Promise<AdminBuyer[]> {
  const buyers = await prisma.buyer.findMany({
    include: {
      user: true,
      project: true,
      unit: true,
      advisor: true,
      phases: { orderBy: { sortOrder: "asc" } },
      payments: { orderBy: { id: "asc" } },
      documents: { orderBy: { id: "asc" } },
      meetings: { orderBy: { id: "asc" } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return buyers.map((b) => ({
    id: b.id,
    name: b.user.name.split(" ")[0],
    fullName: b.user.name,
    email: b.user.email,
    advisorId: b.advisorId,
    advisorName: b.advisor.name,
    projectName: b.project.nameNo,
    unitLabel: b.unit?.label ?? "—",
    phases: b.phases.map((p) => ({
      id: p.id,
      nameNo: p.nameNo,
      nameEn: p.nameEn,
      pct: p.pct,
      status: p.status,
      dateNo: p.dateNo,
      dateEn: p.dateEn,
      sortOrder: p.sortOrder,
    })),
    payments: b.payments.map((p) => ({
      id: p.id,
      labelNo: p.labelNo,
      labelEn: p.labelEn,
      amount: p.amount,
      pct: p.pct,
      status: p.status,
      dateNo: p.dateNo,
      dateEn: p.dateEn,
    })),
    documents: b.documents.map((d) => ({
      id: d.id,
      nameNo: d.nameNo,
      nameEn: d.nameEn,
      cat: d.cat,
      dateNo: d.dateNo,
      dateEn: d.dateEn,
      size: d.size,
      signed: d.signed,
      soon: d.soon,
      fileUrl: d.fileUrl ?? null,
    })),
    meetings: b.meetings.map((m) => ({
      id: m.id,
      titleNo: m.titleNo,
      titleEn: m.titleEn,
      typeNo: m.typeNo,
      typeEn: m.typeEn,
      dateNo: m.dateNo,
      dateEn: m.dateEn,
      time: m.time,
      online: m.online,
      status: m.status,
    })),
    messages: b.messages.map((m) => ({
      id: m.id,
      from: m.from,
      textNo: m.textNo,
      time: m.time,
      dateNo: m.dateNo,
      createdAt: m.createdAt,
    })),
  }));
}
