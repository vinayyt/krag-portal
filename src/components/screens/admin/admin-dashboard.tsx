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

type SectionKey = "home" | "phases" | "meetings" | "payments" | "documents" | "messages";

const NAV: { key: SectionKey; icon: string; labelNo: string; labelEn: string }[] = [
  { key: "home",      icon: "building", labelNo: "Oversikt",        labelEn: "Overview"        },
  { key: "phases",    icon: "chart",    labelNo: "Byggefremdrift",   labelEn: "Build progress"  },
  { key: "meetings",  icon: "calendar", labelNo: "Møter",            labelEn: "Meetings"        },
  { key: "payments",  icon: "check",    labelNo: "Betalinger",       labelEn: "Payments"        },
  { key: "documents", icon: "doc",      labelNo: "Dokumenter",       labelEn: "Documents"       },
  { key: "messages",  icon: "chat",     labelNo: "Meldinger",        labelEn: "Messages"        },
];

export function AdminDashboard({ locale, builderName, buyers }: AdminDashboardProps) {
  const isNb = locale !== "en";
  const [active, setActive] = useState<SectionKey>("home");
  const [buyer, setBuyer] = useState<AdminBuyer | null>(buyers[0] ?? null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile

  async function refreshBuyer() {
    const res = await fetch("/api/admin/buyer-data");
    if (res.ok) {
      const data: AdminBuyer[] = await res.json();
      if (data[0]) setBuyer(data[0]);
    }
  }

  const currentNav = NAV.find((n) => n.key === active)!;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>

      {/* ── TOP HEADER ─────────────────────────────────────────────────────── */}
      <header style={{
        background: "var(--sidebar-bg)", backgroundImage: "var(--sidebar)",
        borderBottom: "1px solid rgba(255,255,255,.08)",
        position: "sticky", top: 0, zIndex: 20,
        flexShrink: 0,
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo — always goes to overview */}
          <button
            onClick={() => setActive("home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}
            title={isNb ? "Tilbake til oversikt" : "Back to overview"}
          >
            <Logo size="sm" dark />
          </button>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.15)" }} />

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => setActive("home")}
              style={{ fontSize: 12, fontWeight: 600, color: active === "home" ? "rgba(255,255,255,.9)" : "rgba(255,255,255,.5)", letterSpacing: ".06em", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {isNb ? "Byggherre" : "Builder"}
            </button>
            {active !== "home" && (
              <>
                <span style={{ color: "rgba(255,255,255,.3)", fontSize: 14 }}>›</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,.9)", letterSpacing: ".04em" }}>
                  {isNb ? currentNav.labelNo : currentNav.labelEn}
                </span>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.7)", display: "none", padding: 4 }}
            className="admin-hamburger"
          >
            ☰
          </button>

          {/* Desktop: user + sign out */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }} className="admin-user-area">
            {buyer && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--good)" }} />
                <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{buyer.fullName}</span>
              </div>
            )}
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.4)" }}>|</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,.55)" }}>{builderName}</span>
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/auth` })}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 7, border: "1px solid rgba(255,255,255,.18)", background: "rgba(255,255,255,.06)", color: "rgba(255,255,255,.65)", fontSize: 12, cursor: "pointer" }}
            >
              <Icon name="x" size={12} />
              {isNb ? "Logg ut" : "Sign out"}
            </button>
          </div>
        </div>
      </header>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", maxWidth: 1280, margin: "0 auto", width: "100%", padding: "0 24px", gap: 0 }}>

        {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
        <aside style={{
          width: 220, flexShrink: 0, paddingTop: 28, paddingRight: 16, paddingBottom: 28,
          borderRight: "1px solid var(--line)",
        }} className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>

          {/* Buyer chip */}
          {buyer && (
            <div style={{ marginBottom: 24, padding: "10px 12px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {buyer.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{buyer.fullName}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{buyer.projectName} {buyer.unitLabel}</div>
                </div>
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav>
            {NAV.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setActive(item.key); setSidebarOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    padding: "9px 12px", borderRadius: 9, marginBottom: 2,
                    border: "none", cursor: "pointer", textAlign: "left",
                    background: isActive ? "var(--accent-soft)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--ink-2)",
                    fontWeight: isActive ? 700 : 400, fontSize: 14,
                    transition: "background .1s, color .1s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget).style.background = "var(--surface-2)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget).style.background = "transparent"; }}
                >
                  <Icon name={item.icon as Parameters<typeof Icon>[0]["name"]} size={16} />
                  {isNb ? item.labelNo : item.labelEn}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <main style={{ flex: 1, minWidth: 0, paddingTop: 28, paddingLeft: 32, paddingBottom: 48 }}>

          {/* ── OVERVIEW ── */}
          {active === "home" && (
            <div>
              <h1 className="serif" style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 6 }}>
                {isNb ? "God dag, Krag Gruppen" : "Welcome, Krag Gruppen"}
              </h1>
              <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 28 }}>
                {isNb ? "Velg en seksjon i menyen til venstre for å begynne." : "Select a section in the left menu to get started."}
              </p>

              {!buyer && (
                <div style={{ padding: "16px 20px", borderRadius: 10, background: "#fef9e7", border: "1px solid #ca8a04", marginBottom: 24, fontSize: 14, color: "#92400e" }}>
                  {isNb ? "Ingen kjøper er koblet til portalen ennå. Kjør seed-scriptet for å sette opp testdata." : "No buyer connected yet. Run the seed script to set up test data."}
                </div>
              )}

              {/* Quick-action cards — each navigates directly */}
              {buyer && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                  {[
                    { key: "phases"    as SectionKey, icon: "chart"    as const, labelNo: "Byggefremdrift",  stat: `${buyer.phases.filter(p => p.status === "done").length}/${buyer.phases.length} ${isNb ? "faser ferdig" : "phases done"}` },
                    { key: "payments"  as SectionKey, icon: "check"    as const, labelNo: "Betalinger",      stat: `${buyer.payments.filter(p => p.status === "paid").length}/${buyer.payments.length} ${isNb ? "betalt" : "paid"}` },
                    { key: "meetings"  as SectionKey, icon: "calendar" as const, labelNo: "Møter",           stat: `${buyer.meetings.filter(m => m.status === "upcoming").length} ${isNb ? "kommende" : "upcoming"}` },
                    { key: "documents" as SectionKey, icon: "doc"      as const, labelNo: "Dokumenter",      stat: `${buyer.documents.length} ${isNb ? "totalt" : "total"}` },
                    { key: "messages"  as SectionKey, icon: "chat"     as const, labelNo: "Meldinger",       stat: `${buyer.messages.length} ${isNb ? "meldinger" : "messages"}` },
                  ].map((card) => (
                    <button
                      key={card.key}
                      onClick={() => setActive(card.key)}
                      style={{
                        padding: "18px 20px", borderRadius: 12, background: "var(--surface)",
                        border: "1px solid var(--line)", cursor: "pointer", textAlign: "left",
                        transition: "border-color .15s, box-shadow .15s", display: "block", width: "100%",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget).style.borderColor = "var(--accent)"; (e.currentTarget).style.boxShadow = "var(--shadow-sm)"; }}
                      onMouseLeave={(e) => { (e.currentTarget).style.borderColor = "var(--line)"; (e.currentTarget).style.boxShadow = "none"; }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                          <Icon name={card.icon} size={17} />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>{card.labelNo}</div>
                          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{card.stat}</div>
                        </div>
                        <Icon name="chevR" size={15} style={{ color: "var(--ink-3)", marginLeft: "auto" }} />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Credentials reminder */}
              <div style={{ marginTop: 32, padding: "16px 20px", borderRadius: 10, background: "var(--surface-2)", border: "1px dashed var(--line)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 8 }}>
                  {isNb ? "Testinnlogginger (fjernes før produksjon)" : "Test credentials (remove before production)"}
                </div>
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Byggherre" : "Builder"}</div>
                    <code style={{ fontSize: 13, color: "var(--ink)" }}>builder@kraggruppen.no</code><span style={{ color: "var(--ink-3)" }}> / </span><code style={{ fontSize: 13, color: "var(--ink)" }}>Bygger2024!</code>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Boligkjøper" : "Buyer"}</div>
                    <code style={{ fontSize: 13, color: "var(--ink)" }}>ingrid.haugen@example.com</code><span style={{ color: "var(--ink-3)" }}> / </span><code style={{ fontSize: 13, color: "var(--ink)" }}>Kjøper2024!</code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTIONS ── */}
          {active === "phases" && buyer && (
            <PhasesSection buyerId={buyer.id} phases={buyer.phases} onBack={() => setActive("home")} onSaved={refreshBuyer} />
          )}
          {active === "meetings" && buyer && (
            <MeetingsSection buyerId={buyer.id} meetings={buyer.meetings} onBack={() => setActive("home")} onSaved={refreshBuyer} />
          )}
          {active === "payments" && buyer && (
            <PaymentsSection payments={buyer.payments} onBack={() => setActive("home")} onSaved={refreshBuyer} />
          )}
          {active === "documents" && buyer && (
            <DocumentsSection
              key={buyer.documents.length} /* remount when doc count changes so list refreshes */
              buyerId={buyer.id}
              documents={buyer.documents}
              onBack={() => setActive("home")}
              onSaved={refreshBuyer}
            />
          )}
          {active === "messages" && buyer && (
            <MessagesSection buyerId={buyer.id} buyerName={buyer.name} messages={buyer.messages} onBack={() => setActive("home")} onSaved={refreshBuyer} />
          )}
        </main>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .admin-sidebar { display: none; position: fixed; inset: 56px 0 0 0; background: var(--bg); z-index: 15; padding: 20px 20px; overflow-y: auto; }
          .admin-sidebar.open { display: block; }
          .admin-hamburger { display: block !important; }
          .admin-user-area { display: none !important; }
        }
      `}</style>
    </div>
  );
}
