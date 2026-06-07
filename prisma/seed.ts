/**
 * Krag Portal — Prisma seed script
 *
 * Usage:
 *   npx prisma db seed
 *
 * Configured in package.json:
 *   "prisma": { "seed": "ts-node --transpile-only prisma/seed.ts" }
 */

import { PrismaClient } from "@prisma/client";

// Pre-computed bcrypt hash of "demo1234" (cost 10) — no bcryptjs dependency needed for seeding
const DEMO_PASSWORD_HASH = "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Krag Portal…");

  // ── Advisor ──────────────────────────────────────────────────────────────
  const advisor = await prisma.advisor.upsert({
    where: { email: "sine.kragh@kraggruppen.no" },
    update: {},
    create: {
      name: "Sine Kragh",
      roleNo: "Boligrådgiver",
      roleEn: "Home Advisor",
      phone: "+47 900 12 345",
      email: "sine.kragh@kraggruppen.no",
      initials: "SK",
    },
  });

  // ── Project ───────────────────────────────────────────────────────────────
  const justnes = await prisma.project.upsert({
    where: { slug: "justneshalvoya" },
    update: {},
    create: {
      slug: "justneshalvoya",
      nameNo: "Justneshalvøya",
      placeNo: "Molde",
      placeEn: "Molde",
      typeKey: "house",
      typeNo: "Enebolig",
      typeEn: "Detached house",
      priceFrom: 5_200_000,
      sizeFrom: 110,
      sizeTo: 148,
      bedrooms: "3–4",
      statusNo: "Under bygging",
      statusEn: "Under construction",
      tone: "fjord",
      blurbNo: "Naturtomt med fjordutsikt — romslige eneboliger i Molde.",
      blurbEn: "Natural plot with fjord view — spacious detached homes in Molde.",
      tagsNo: ["Fjordutsikt", "Naturtomt", "Carport"],
      tagsEn: ["Fjord view", "Natural plot", "Carport"],
    },
  });

  // ── Unit ──────────────────────────────────────────────────────────────────
  const unitB7 = await prisma.projectUnit.upsert({
    where: { id: "justnes-b7" },
    update: {},
    create: {
      id: "justnes-b7",
      projectId: justnes.id,
      label: "B7",
      size: 128,
      bedrooms: 4,
      featureNo: "Hjørnetomt",
      featureEn: "Corner plot",
      price: 5_490_000,
      reserved: false,
    },
  });

  // ── Buyer user ────────────────────────────────────────────────────────────
  const buyerUser = await prisma.user.upsert({
    where: { email: "ingrid.haugen@example.com" },
    update: {},
    create: {
      email: "ingrid.haugen@example.com",
      name: "Ingrid Haugen",
      phone: "+47 911 22 333",
      locale: "nb",
      passwordHash: DEMO_PASSWORD_HASH,
    },
  });

  const buyer = await prisma.buyer.upsert({
    where: { userId: buyerUser.id },
    update: {},
    create: {
      userId: buyerUser.id,
      projectId: justnes.id,
      unitId: unitB7.id,
      advisorId: advisor.id,
    },
  });

  // ── Phases ────────────────────────────────────────────────────────────────
  const phases = [
    { slug: "foundation",  nameNo: "Grunnarbeid",        nameEn: "Foundation",            pct: 100, status: "done",     dateNo: "Aug 2025",   dateEn: "Aug 2025",   sortOrder: 1 },
    { slug: "frame",       nameNo: "Råbygg & tak",       nameEn: "Frame & roof",           pct: 100, status: "done",     dateNo: "Okt 2025",   dateEn: "Oct 2025",   sortOrder: 2 },
    { slug: "weathertight",nameNo: "Tett bygg",          nameEn: "Weather-tight",          pct: 100, status: "done",     dateNo: "Nov 2025",   dateEn: "Nov 2025",   sortOrder: 3 },
    { slug: "interior",    nameNo: "Innvendig arbeid",   nameEn: "Interior works",         pct: 55,  status: "active",   dateNo: "Des 2025 – Mar 2026", dateEn: "Dec 2025 – Mar 2026", sortOrder: 4 },
    { slug: "finishing",   nameNo: "Overflater & finish",nameEn: "Surfaces & finishing",   pct: 0,   status: "upcoming", dateNo: "Apr 2026",   dateEn: "Apr 2026",   sortOrder: 5 },
    { slug: "utilities",   nameNo: "VVS & elektro",      nameEn: "Plumbing & electrical",  pct: 0,   status: "upcoming", dateNo: "Apr–Mai 2026",dateEn: "Apr–May 2026", sortOrder: 6 },
    { slug: "handover",    nameNo: "Overtakelse",        nameEn: "Handover",               pct: 0,   status: "upcoming", dateNo: "Jun 2026",   dateEn: "Jun 2026",   sortOrder: 7 },
  ];

  for (const p of phases) {
    await prisma.phase.upsert({
      where: { id: `${buyer.id}-${p.slug}` },
      update: { pct: p.pct, status: p.status },
      create: { id: `${buyer.id}-${p.slug}`, buyerId: buyer.id, ...p },
    });
  }

  // ── Payments ──────────────────────────────────────────────────────────────
  const payments = [
    { labelNo: "Reservasjonsavgift",     labelEn: "Reservation fee",        amount: 50_000,    pct: "1%",  status: "paid",     dateNo: "Jun 2025",  dateEn: "Jun 2025"  },
    { labelNo: "Kjøpesum ved kontrakt",  labelEn: "Purchase at contract",   amount: 549_000,   pct: "10%", status: "paid",     dateNo: "Aug 2025",  dateEn: "Aug 2025"  },
    { labelNo: "Byggestart",             labelEn: "Construction start",     amount: 1_098_000, pct: "20%", status: "paid",     dateNo: "Sep 2025",  dateEn: "Sep 2025"  },
    { labelNo: "Tett bygg",              labelEn: "Weather-tight milestone",amount: 1_647_000, pct: "30%", status: "upcoming", dateNo: "Feb 2026",  dateEn: "Feb 2026"  },
    { labelNo: "Overtakelse",            labelEn: "Handover / completion",  amount: 2_146_000, pct: "39%", status: "upcoming", dateNo: "Jun 2026",  dateEn: "Jun 2026"  },
  ];

  for (const [i, p] of payments.entries()) {
    await prisma.payment.upsert({
      where: { id: i + 1 },
      update: { status: p.status },
      create: { id: i + 1, buyerId: buyer.id, ...p },
    });
  }

  // ── Documents ─────────────────────────────────────────────────────────────
  const documents = [
    { nameNo: "Kjøpekontrakt",                 nameEn: "Purchase contract",              cat: "contract", dateNo: "15. aug 2025", dateEn: "15 Aug 2025", size: "1.2 MB", signed: true  },
    { nameNo: "Tilvalgsavtale kjøkken",        nameEn: "Kitchen options agreement",      cat: "contract", dateNo: "10. jan 2026", dateEn: "10 Jan 2026", size: "—",      signed: false },
    { nameNo: "Situasjonskart",                nameEn: "Site plan",                      cat: "drawing",  dateNo: "Jun 2025",     dateEn: "Jun 2025",    size: "3.4 MB", signed: null  },
    { nameNo: "Plantegninger — B7",            nameEn: "Floor plans — B7",               cat: "drawing",  dateNo: "Jun 2025",     dateEn: "Jun 2025",    size: "5.1 MB", signed: null  },
    { nameNo: "Teknisk beskrivelse",           nameEn: "Technical specification",        cat: "spec",     dateNo: "Jun 2025",     dateEn: "Jun 2025",    size: "890 kB", signed: null  },
    { nameNo: "Bustadoppføringslova — vilkår", nameEn: "Construction Act — terms",       cat: "contract", dateNo: "Jun 2025",     dateEn: "Jun 2025",    size: "220 kB", signed: true  },
    { nameNo: "Overtakelsesprotokoll",         nameEn: "Handover protocol",              cat: "contract", dateNo: "Jun 2026",     dateEn: "Jun 2026",    size: "—",      signed: false, soon: true },
  ];

  for (const [i, d] of documents.entries()) {
    await prisma.document.upsert({
      where: { id: i + 1 },
      update: {},
      create: { id: i + 1, buyerId: buyer.id, soon: false, ...d },
    });
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  await prisma.notification.deleteMany({ where: { buyerId: buyer.id } });
  await prisma.notification.createMany({
    data: [
      { buyerId: buyer.id, icon: "doc",    textNo: "Tilvalgsavtale klar til signering",     textEn: "Options agreement ready to sign",      timeNo: "2t siden",       timeEn: "2h ago",        unread: true  },
      { buyerId: buyer.id, icon: "camera", textNo: "8 nye bilder fra byggeplassen",          textEn: "8 new photos from the site",           timeNo: "I går",          timeEn: "Yesterday",     unread: true  },
      { buyerId: buyer.id, icon: "chat",   textNo: "Ny melding fra Sine Kragh",              textEn: "New message from Sine Kragh",          timeNo: "2 dager siden",  timeEn: "2 days ago",    unread: false },
      { buyerId: buyer.id, icon: "check",  textNo: "Bygget er nå tett",                      textEn: "Building is now weather-tight",        timeNo: "1 uke siden",    timeEn: "1 week ago",    unread: false },
    ],
  });

  console.log(`✅  Seeded buyer: ${buyerUser.email}`);
  console.log(`   Project: ${justnes.nameNo} — Unit ${unitB7.label}`);
  console.log(`   Advisor: ${advisor.name}`);
  console.log("🌱  Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
