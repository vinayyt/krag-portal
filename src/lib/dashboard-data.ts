/**
 * Server-side data fetcher for the buyer dashboard.
 * Queries Prisma and adapts records to the app's BiString types.
 * Import this ONLY in Server Components or API routes.
 */

import { PrismaClient } from "@prisma/client";
import type {
  Buyer, Advisor, DashboardProject, Phase, Payment,
  KragDocument, Meeting, Message, Notification, Budget,
} from "@/types";

const prisma = new PrismaClient();

export interface DashboardData {
  buyer: Buyer;
  advisor: Advisor;
  project: DashboardProject;
  phases: Phase[];
  payments: Payment[];
  budget: Budget;
  documents: KragDocument[];
  meetings: Meeting[];
  messages: Message[];
  notifications: Notification[];
}

export async function fetchDashboardData(userId: string): Promise<DashboardData | null> {
  const rec = await prisma.buyer.findUnique({
    where: { userId },
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
      notifications: { orderBy: { id: "desc" } },
    },
  });

  if (!rec) return null;

  // ── Phases ──────────────────────────────────────────────────────────────────
  const phases: Phase[] = rec.phases.map((p) => ({
    id: p.id,
    name: { no: p.nameNo, en: p.nameEn },
    pct: p.pct,
    status: p.status as Phase["status"],
    date: { no: p.dateNo, en: p.dateEn },
  }));

  // ── Payments ─────────────────────────────────────────────────────────────────
  const payments: Payment[] = rec.payments.map((p) => ({
    id: p.id,
    label: { no: p.labelNo, en: p.labelEn },
    amount: p.amount,
    pct: p.pct,
    status: p.status as Payment["status"],
    date: { no: p.dateNo, en: p.dateEn },
  }));

  // ── Budget ───────────────────────────────────────────────────────────────────
  const basePrice = rec.unit?.price ?? rec.project.priceFrom;
  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const budget: Budget = { base: basePrice, addons: 0, total: basePrice, paid };

  // ── Documents ────────────────────────────────────────────────────────────────
  const documents: KragDocument[] = rec.documents.map((d) => ({
    id: d.id,
    name: { no: d.nameNo, en: d.nameEn },
    cat: d.cat as KragDocument["cat"],
    date: { no: d.dateNo, en: d.dateEn },
    size: d.size,
    signed: d.signed,
    soon: d.soon,
  }));

  // ── Meetings ─────────────────────────────────────────────────────────────────
  const meetings: Meeting[] = rec.meetings.map((m) => ({
    id: m.id,
    title: { no: m.titleNo, en: m.titleEn },
    type: { no: m.typeNo, en: m.typeEn },
    date: { no: m.dateNo, en: m.dateEn },
    time: m.time,
    with: rec.advisor.name,
    online: m.online,
    status: m.status as "upcoming" | "past",
  }));

  // ── Messages ──────────────────────────────────────────────────────────────────
  const messages: Message[] = rec.messages.map((m) => ({
    id: m.id,
    from: m.from as Message["from"],
    text: { no: m.textNo, en: m.textEn },
    time: m.time,
    date: { no: m.dateNo, en: m.dateEn },
  }));

  // ── Notifications ────────────────────────────────────────────────────────────
  const notifications: Notification[] = rec.notifications.map((n) => ({
    id: n.id,
    icon: n.icon,
    text: { no: n.textNo, en: n.textEn },
    time: { no: n.timeNo, en: n.timeEn },
    unread: n.unread,
  }));

  // ── Overall progress (avg pct across all phases) ──────────────────────────────
  const progress = phases.length
    ? Math.round(phases.reduce((s, p) => s + p.pct, 0) / phases.length)
    : 0;
  const handoverPhase = rec.phases.find((p) => p.slug === "handover");

  // ── Project ───────────────────────────────────────────────────────────────────
  const project: DashboardProject = {
    id: rec.project.id,
    name: rec.project.nameNo,
    unit: rec.unit?.label ?? "—",
    place: { no: rec.project.placeNo, en: rec.project.placeEn },
    address: { no: rec.project.placeNo, en: rec.project.placeEn },
    progress,
    handover: handoverPhase
      ? { no: handoverPhase.dateNo, en: handoverPhase.dateEn }
      : { no: "—", en: "—" },
    type: { no: rec.project.typeNo, en: rec.project.typeEn },
    bedrooms: rec.unit?.bedrooms ?? 0,
  };

  // ── Buyer ─────────────────────────────────────────────────────────────────────
  const nameParts = rec.user.name.split(" ");
  const buyer: Buyer = {
    id: rec.user.id,
    name: nameParts[0],
    fullName: rec.user.name,
    initials: nameParts.map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
    email: rec.user.email,
    phone: rec.user.phone ?? undefined,
    locale: (rec.user.locale ?? "nb") as "nb" | "en",
  };

  // ── Advisor ───────────────────────────────────────────────────────────────────
  const advisor: Advisor = {
    id: rec.advisor.id,
    name: rec.advisor.name,
    role: { no: rec.advisor.roleNo, en: rec.advisor.roleEn },
    phone: rec.advisor.phone,
    email: rec.advisor.email,
    initials: rec.advisor.initials,
  };

  return { buyer, advisor, project, phases, payments, budget, documents, meetings, messages, notifications };
}
