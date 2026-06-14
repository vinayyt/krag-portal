"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

// ─── Left brand panel (shared with auth) ──────────────────────────────────────
function BrandPanel({ locale }: { locale: string }) {
  return (
    <div
      style={{
        background: "var(--sidebar-bg)",
        backgroundImage: "var(--sidebar)",
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}
      className="auth-brand-panel"
    >
      {/* Radial glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "40%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,106,64,.18), transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 80 }}>
          <Logo size="md" dark />
          {/* Lang toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,.08)", borderRadius: 999, padding: 3, gap: 2 }}>
            {(["nb", "en"] as const).map((l) => {
              const active = locale === l;
              return (
                <Link
                  key={l}
                  href={`/${l}/start`}
                  style={{
                    display: "inline-flex", alignItems: "center", padding: "5px 11px",
                    borderRadius: 999, fontSize: 13, fontWeight: 600,
                    background: active ? "rgba(255,255,255,.15)" : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,.5)",
                    textDecoration: "none", transition: "all .15s",
                  }}
                >
                  {l === "nb" ? "NO" : "EN"}
                </Link>
              );
            })}
          </div>
        </div>

        <h1
          className="serif"
          style={{
            fontSize: "clamp(28px, 3vw, 40px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: 16,
          }}
        >
          {locale === "en" ? "Your home journey starts here" : "Din boligreise starter her"}
        </h1>
        <p style={{ fontSize: 16, color: "var(--sidebar-ink)", lineHeight: 1.6 }}>
          {locale === "en"
            ? "Whether you're building new or renovating — we give you full overview and peace of mind."
            : "Enten du bygger nytt eller pusser opp — vi gir deg full oversikt og ro i sjelen."}
        </p>
      </div>

      {/* Bottom feature list */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {[
          { icon: "shield", text: locale === "en" ? "Secure and personal portal" : "Trygg og personlig portal" },
          { icon: "people", text: locale === "en" ? "Dedicated project manager" : "Dedikert prosjektleder" },
          { icon: "building", text: locale === "en" ? "Krag quality guarantee" : "Krag-kvalitetsgaranti" },
        ].map(({ icon, text }, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
              borderTop: "1px solid rgba(255,255,255,.12)",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,255,255,.08)", display: "grid", placeItems: "center", color: "var(--sidebar-ink)", flexShrink: 0 }}>
              <Icon name={icon} size={18} />
            </div>
            <span style={{ fontSize: 14, color: "var(--sidebar-ink)" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project type card ─────────────────────────────────────────────────────────
interface TypeCardProps {
  icon: string;
  title: string;
  sub: string;
  features: string[];
  cta: string;
  badge?: string;
  accent: string;
  accentSoft: string;
  onClick: () => void;
  loading: boolean;
}

function TypeCard({ icon, title, sub, features, cta, badge, accent, accentSoft, onClick, loading }: TypeCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      style={{
        position: "relative",
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        padding: "28px 26px", borderRadius: 20, textAlign: "left", width: "100%",
        border: `2px solid ${hovered ? accent : "var(--line)"}`,
        background: hovered ? accentSoft : "var(--surface)",
        boxShadow: hovered ? `0 8px 32px ${accent}22` : "var(--shadow-sm)",
        cursor: loading ? "default" : "pointer",
        transition: "all .18s cubic-bezier(0.2, 0.7, 0.3, 1)",
        opacity: loading ? 0.6 : 1,
      }}
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: "absolute", top: -12, right: 20,
          background: accent, color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
          letterSpacing: ".04em",
        }}>
          {badge}
        </div>
      )}

      {/* Icon */}
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: hovered ? accent : "var(--surface-2)",
        display: "grid", placeItems: "center",
        color: hovered ? "#fff" : accent,
        marginBottom: 18, transition: "all .18s", flexShrink: 0,
      }}>
        <Icon name={icon} size={26} />
      </div>

      {/* Text */}
      <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)", marginBottom: 6 }}>
        {title}
      </div>
      <div style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 20, lineHeight: 1.4 }}>
        {sub}
      </div>

      {/* Feature list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24, width: "100%" }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "var(--ink-2)" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: hovered ? accent : "var(--surface-3)", display: "grid", placeItems: "center", flexShrink: 0, transition: "all .18s" }}>
              <Icon name="check" size={12} style={{ color: hovered ? "#fff" : accent }} />
            </div>
            {f}
          </div>
        ))}
      </div>

      {/* CTA row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginTop: "auto",
        fontSize: 14.5, fontWeight: 700, color: accent,
      }}>
        {loading ? (
          <span style={{ fontSize: 13 }}>{/* spinner */}…</span>
        ) : (
          <>
            {cta}
            <Icon name="arrowR" size={18} />
          </>
        )}
      </div>
    </button>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export function StartPage() {
  const locale = useLocale();
  const t = useTranslations("start");
  const router = useRouter();
  const [loading, setLoading] = useState<"build" | "reno" | null>(null);

  async function pick(type: "build" | "reno") {
    setLoading(type);
    await new Promise((r) => setTimeout(r, 300));
    router.push(type === "build" ? `/${locale}/questionnaire` : `/${locale}/renovering`);
  }

  return (
    <div
      style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "var(--bg)" }}
      className="auth-layout"
    >
      {/* Left brand panel */}
      <BrandPanel locale={locale} />

      {/* Right: type picker */}
      <div
        style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "48px", background: "var(--bg)", overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 500, width: "100%", margin: "0 auto" }}>
          {/* Back link */}
          <Link
            href={`/${locale}/auth?mode=create`}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "var(--ink-3)", textDecoration: "none", marginBottom: 36 }}
          >
            <Icon name="chevL" size={15} />
            {locale === "en" ? "Back" : "Tilbake"}
          </Link>

          {/* Heading */}
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--ink)" }}>
            {t("heading")}
          </h2>
          <p style={{ fontSize: 14.5, color: "var(--ink-3)", marginBottom: 32, lineHeight: 1.5 }}>
            {t("sub")}
          </p>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <TypeCard
              icon="home"
              title={t("build_title")}
              sub={t("build_sub")}
              features={[t("build_feat1"), t("build_feat2"), t("build_feat3")]}
              cta={t("build_cta")}
              accent="var(--accent)"
              accentSoft="var(--accent-soft)"
              onClick={() => pick("build")}
              loading={loading === "build"}
            />
            <TypeCard
              icon="tools"
              title={t("reno_title")}
              sub={t("reno_sub")}
              features={[t("reno_feat1"), t("reno_feat2"), t("reno_feat3")]}
              cta={t("reno_cta")}
              badge={t("popular")}
              accent="#2563eb"
              accentSoft="rgba(37,99,235,.06)"
              onClick={() => pick("reno")}
              loading={loading === "reno"}
            />
          </div>

          {/* Already have account */}
          <p style={{ fontSize: 13, color: "var(--ink-3)", textAlign: "center", marginTop: 28 }}>
            {locale === "en" ? "Already have an account?" : "Har du allerede konto?"}{" "}
            <Link href={`/${locale}/auth?mode=login`} style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
              {locale === "en" ? "Log in" : "Logg inn"}
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile: hide brand panel */}
      <style>{`
        @media (max-width: 720px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
