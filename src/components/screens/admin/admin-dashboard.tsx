"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { PhasesSection } from "./sections/phases-section";
import { PaymentsSection } from "./sections/payments-section";
import { MeetingsSection } from "./sections/meetings-section";
import { DocumentsSection } from "./sections/documents-section";
import { MessagesSection } from "./sections/messages-section";
import type { AdminBuyer } from "@/lib/admin-data";

interface AdminDashboardProps {
  locale: string;
  builderName: string;
  buyers: AdminBuyer[];
}

type SectionKey = "phases" | "meetings" | "payments" | "documents" | "messages" | null;

const SECTIONS = [
  { key: "phases"    as const, icon: "chart"    as const, label: "Byggefremdrift", labelEn: "Build progress",  desc: "Oppdater fase-prosenter",       descEn: "Update phase percentages" },
  { key: "meetings"  as const, icon: "calendar" as const, label: "Møter",          labelEn: "Meetings",        desc: "Legg til og rediger møter",     descEn: "Add and edit meetings"    },
  { key: "payments"  as const, icon: "check"    as const, label: "Betalinger",     labelEn: "Payments",        desc: "Merk milepæler som betalt",     descEn: "Mark milestones as paid"  },
  { key: "documents" as const, icon: "doc"      as const, label: "Dokumenter",     labelEn: "Documents",       desc: "Administrer filer og dokumenter",descEn: "Upload and manage files"  },
  { key: "messages"  as const, icon: "chat"     as const, label: "Meldinger",      labelEn: "Messages",        desc: "Kommuniser med boligkjøper",    descEn: "Communicate with buyer"   },
];

export function AdminDashboard({ locale, builderName, buyers }: AdminDashboardProps) {
  const isNb = locale !== "en";
  const [activeSection, setActiveSection] = useState<SectionKey>(null);
  // For pilot: single buyer
  const [buyer, setBuyer] = useState<AdminBuyer>(buyers[0]);

  // Refresh buyer data from server after mutations
  async function refreshBuyer() {
    const res = await fetch("/api/admin/buyer-data");
    if (res.ok) {
      const data: AdminBuyer[] = await res.json();
      if (data[0]) setBuyer(data[0]);
    }
  }

  const handleSaved = () => {
    refreshBuyer();
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ background: "var(--sidebar-bg)", backgroundImage: "var(--sidebar)", borderBottom: "1px solid rgba(255,255,255,.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Logo size="sm" dark />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.15)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", letterSpacing: ".06em", textTransform: "uppercase" }}>
              {isNb ? "Byggherre" : "Builder"}
            </span>
            {activeSection && (
              <>
                <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.15)" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,.55)" }}>
                  {SECTIONS.find((s) => s.key === activeSection)?.[isNb ? "label" : "labelEn"]}
                </span>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,.6)" }}>{builderName}</span>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/auth` })}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,.2)", background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.7)", fontSize: 13, cursor: "pointer" }}
            >
              <Icon name="x" size={13} />
              {isNb ? "Logg ut" : "Sign out"}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>

        {/* ── Section panels ── */}
        {activeSection === "phases" && buyer && (
          <PhasesSection
            buyerId={buyer.id}
            phases={buyer.phases}
            onBack={() => setActiveSection(null)}
            onSaved={handleSaved}
          />
        )}
        {activeSection === "meetings" && buyer && (
          <MeetingsSection
            buyerId={buyer.id}
            meetings={buyer.meetings}
            onBack={() => setActiveSection(null)}
            onSaved={handleSaved}
          />
        )}
        {activeSection === "payments" && buyer && (
          <PaymentsSection
            payments={buyer.payments}
            onBack={() => setActiveSection(null)}
            onSaved={handleSaved}
          />
        )}
        {activeSection === "documents" && buyer && (
          <DocumentsSection
            buyerId={buyer.id}
            documents={buyer.documents}
            onBack={() => setActiveSection(null)}
            onSaved={handleSaved}
          />
        )}
        {activeSection === "messages" && buyer && (
          <MessagesSection
            buyerId={buyer.id}
            buyerName={buyer.name}
            messages={buyer.messages}
            onBack={() => setActiveSection(null)}
            onSaved={handleSaved}
          />
        )}

        {/* ── Home / card grid ── */}
        {activeSection === null && (
          <>
            {/* Welcome */}
            <div style={{ marginBottom: 32 }}>
              <h1 className="serif" style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 8 }}>
                {isNb ? "God dag, Krag Gruppen" : "Welcome, Krag Gruppen"}
              </h1>
              <p style={{ fontSize: 15, color: "var(--ink-3)" }}>
                {isNb
                  ? "Her administrerer du kundens prosjektportal."
                  : "Manage your customer's project portal from here."}
              </p>
            </div>

            {/* Buyer summary card */}
            {buyer && (
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)", marginBottom: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {buyer.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{buyer.fullName}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
                    {buyer.email} · {buyer.projectName} {buyer.unitLabel}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--good)" }}>
                    {isNb ? "Portal er live" : "Portal is live"}
                  </span>
                </div>
              </div>
            )}

            {/* Quick stats row */}
            {buyer && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }} className="admin-stats">
                {[
                  { label: isNb ? "Faser" : "Phases",        value: `${buyer.phases.filter(p => p.status === "done").length}/${buyer.phases.length} ${isNb ? "ferdig" : "done"}` },
                  { label: isNb ? "Betalinger" : "Payments",  value: `${buyer.payments.filter(p => p.status === "paid").length}/${buyer.payments.length} ${isNb ? "betalt" : "paid"}` },
                  { label: isNb ? "Møter" : "Meetings",       value: `${buyer.meetings.filter(m => m.status === "upcoming").length} ${isNb ? "kommende" : "upcoming"}` },
                  { label: isNb ? "Dokumenter" : "Documents", value: `${buyer.documents.length} ${isNb ? "totalt" : "total"}` },
                ].map((stat) => (
                  <div key={stat.label} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 6 }}>{stat.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Section grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {SECTIONS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  style={{
                    padding: "20px 22px", borderRadius: 14, background: "var(--surface)",
                    border: "1px solid var(--line)", cursor: "pointer", textAlign: "left",
                    transition: "border-color .15s, box-shadow .15s", display: "block", width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.borderColor = "var(--accent)";
                    (e.currentTarget).style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.borderColor = "var(--line)";
                    (e.currentTarget).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon name={s.icon} size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
                        {isNb ? s.label : s.labelEn}
                      </div>
                      <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
                        {isNb ? s.desc : s.descEn}
                      </div>
                    </div>
                    <Icon name="chevR" size={16} style={{ color: "var(--ink-3)", marginTop: 2 }} />
                  </div>
                </button>
              ))}

              {/* Buyers — coming soon */}
              <div style={{ padding: "20px 22px", borderRadius: 14, background: "var(--surface)", border: "1px solid var(--line)", opacity: 0.5 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface-2)", color: "var(--ink-3)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Icon name="people" size={18} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
                      {isNb ? "Boligkjøpere" : "Buyers"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--ink-3)" }}>
                      {isNb ? "Oversikt over alle kjøpere" : "Overview of all buyers"}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", color: "var(--ink-3)", letterSpacing: ".05em" }}>
                    SNART
                  </span>
                </div>
              </div>
            </div>

            {/* Credentials reminder */}
            <div style={{ marginTop: 36, padding: "18px 22px", borderRadius: 12, background: "var(--surface-2)", border: "1px dashed var(--line)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 10 }}>
                {isNb ? "Testinnlogginger (fjernes før produksjon)" : "Test credentials (remove before production)"}
              </div>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Byggherre" : "Builder"}</div>
                  <code style={{ fontSize: 13, color: "var(--ink)" }}>builder@kraggruppen.no</code>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}> / </span>
                  <code style={{ fontSize: 13, color: "var(--ink)" }}>Bygger2024!</code>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Boligkjøper" : "Buyer"}</div>
                  <code style={{ fontSize: 13, color: "var(--ink)" }}>ingrid.haugen@example.com</code>
                  <span style={{ fontSize: 13, color: "var(--ink-3)" }}> / </span>
                  <code style={{ fontSize: 13, color: "var(--ink)" }}>Kjøper2024!</code>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .admin-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
