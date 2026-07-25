"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

interface AdminDashboardProps {
  locale: string;
  builderName: string;
}

const SECTIONS = [
  { icon: "chart" as const,    label: "Byggefremdrift",   labelEn: "Build progress",   desc: "Oppdater fase-prosenter",          descEn: "Update phase percentages",   coming: false },
  { icon: "calendar" as const, label: "Møter",            labelEn: "Meetings",          desc: "Legg til og rediger møter",        descEn: "Add and edit meetings",      coming: false },
  { icon: "check" as const,    label: "Betalinger",       labelEn: "Payments",          desc: "Merk milepæler som betalt",        descEn: "Mark milestones as paid",    coming: false },
  { icon: "doc" as const,      label: "Dokumenter",       labelEn: "Documents",         desc: "Last opp og administrer filer",    descEn: "Upload and manage files",    coming: false },
  { icon: "chat" as const,     label: "Meldinger",        labelEn: "Messages",          desc: "Kommuniser med boligkjøper",       descEn: "Communicate with buyer",     coming: false },
  { icon: "people" as const,   label: "Boligkjøpere",     labelEn: "Buyers",            desc: "Oversikt over alle kjøpere",       descEn: "Overview of all buyers",     coming: true  },
];

export function AdminDashboard({ locale, builderName }: AdminDashboardProps) {
  const isNb = locale !== "en";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ background: "var(--sidebar-bg)", backgroundImage: "var(--sidebar)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Logo size="sm" dark />
            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,.15)" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)", letterSpacing: ".06em", textTransform: "uppercase" }}>
              {isNb ? "Byggherre" : "Builder"}
            </span>
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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 40 }}>
          <h1 className="serif" style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 8 }}>
            {isNb ? "God dag, Krag Gruppen" : "Welcome, Krag Gruppen"}
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-3)" }}>
            {isNb
              ? "Her administrerer du kundens prosjektportal. Velg en seksjon for å begynne."
              : "Manage your customer's project portal from here. Choose a section to begin."}
          </p>
        </div>

        {/* Status banner */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "var(--good-soft)", border: "1px solid var(--good)", marginBottom: 36 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--good)", flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "var(--good)", fontWeight: 600 }}>
            {isNb ? "Portal er live — kunden kan logge inn" : "Portal is live — customer can log in"}
          </span>
          <span style={{ fontSize: 13, color: "var(--ink-3)", marginLeft: "auto" }}>
            {isNb ? "Kjøper: ingrid.haugen@example.com" : "Buyer: ingrid.haugen@example.com"}
          </span>
        </div>

        {/* Section grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {SECTIONS.map((s) => (
            <div
              key={s.label}
              style={{
                padding: "22px 24px",
                borderRadius: 14,
                background: "var(--surface)",
                border: "1px solid var(--line)",
                opacity: s.coming ? 0.5 : 1,
                cursor: s.coming ? "default" : "pointer",
                transition: "border-color .15s, box-shadow .15s",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!s.coming) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--line)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
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
                {s.coming && (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: "var(--surface-2)", color: "var(--ink-3)", letterSpacing: ".05em" }}>
                    SNART
                  </span>
                )}
                {!s.coming && (
                  <Icon name="chevR" size={16} style={{ color: "var(--ink-3)", marginTop: 2 }} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Credentials reminder */}
        <div style={{ marginTop: 40, padding: "20px 24px", borderRadius: 12, background: "var(--surface-2)", border: "1px dashed var(--line)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 10 }}>
            {isNb ? "Testinnlogginger (fjernes før produksjon)" : "Test credentials (remove before production)"}
          </div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Byggherre" : "Builder"}</div>
              <code style={{ fontSize: 13, color: "var(--ink)" }}>builder@kraggruppen.no</code>
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}> / </span>
              <code style={{ fontSize: 13, color: "var(--ink)" }}>Bygger2024!</code>
            </div>
            <div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 2 }}>{isNb ? "Boligkjøper" : "Buyer"}</div>
              <code style={{ fontSize: 13, color: "var(--ink)" }}>ingrid.haugen@example.com</code>
              <span style={{ fontSize: 13, color: "var(--ink-3)" }}> / </span>
              <code style={{ fontSize: 13, color: "var(--ink)" }}>Kjøper2024!</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
