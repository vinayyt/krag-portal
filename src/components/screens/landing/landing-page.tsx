"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";
import { Money } from "@/components/ui/money";
import { Logo } from "@/components/ui/logo";
import { PROJECTS } from "@/lib/data";
import { pick } from "@/lib/format";

function LangToggle() {
  const locale = useLocale();
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--surface-2)",
        borderRadius: 999,
        padding: 3,
        gap: 2,
        border: "1px solid var(--line)",
      }}
    >
      {(["nb", "en"] as const).map((l) => {
        const active = locale === l;
        return (
          <Link
            key={l}
            href={`/${l}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 11px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              background: active ? "var(--surface)" : "transparent",
              color: active ? "var(--ink)" : "var(--ink-3)",
              boxShadow: active ? "var(--shadow-sm)" : "none",
              textDecoration: "none",
              transition: "all .15s",
            }}
          >
            {l === "nb" ? "NO" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}

const STEPS = [
  { icon: "people", key: "step1" },
  { icon: "heart", key: "step2" },
  { icon: "calendar", key: "step3" },
  { icon: "building", key: "step4" },
] as const;

export function LandingPage() {
  const t = useTranslations("landing");
  const tc = useTranslations("common");
  const locale = useLocale();

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          background: "rgba(235,229,217,.85)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Logo size="md" />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LangToggle />
            <Link href={`/${locale}/auth?mode=login`} style={{ textDecoration: "none" }}>
              <Button variant="ghost" size="sm">
                {t("login")}
              </Button>
            </Link>
            <Link href={`/${locale}/auth?mode=create`} style={{ textDecoration: "none" }}>
              <Button variant="primary" size="sm">
                {t("cta")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "80px 24px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 56,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left copy */}
          <div className="fade-up">
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--accent-soft)",
                color: "var(--accent)",
                padding: "7px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              {t("eyebrow")}
            </div>

            <h1
              className="serif"
              style={{
                fontSize: "clamp(40px, 5vw, 68px)",
                lineHeight: 1.02,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                margin: "0 0 24px",
                whiteSpace: "pre-line",
                color: "var(--ink)",
              }}
            >
              {t("h1")}
            </h1>

            <p
              style={{
                fontSize: 18,
                lineHeight: 1.6,
                color: "var(--ink-2)",
                margin: "0 0 36px",
                maxWidth: 480,
              }}
            >
              {t("sub")}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <Link href={`/${locale}/auth?mode=create`} style={{ textDecoration: "none" }}>
                <Button variant="primary" size="lg">
                  {t("cta")}
                </Button>
              </Link>
              <Link href={`/${locale}/auth?mode=login`} style={{ textDecoration: "none" }}>
                <Button variant="outline" size="lg">
                  {t("login")}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {(["stat1", "stat2", "stat3"] as const).map((key) => (
                <div
                  key={key}
                  style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--ink-2)" }}
                >
                  <Icon name="check" size={16} style={{ color: "var(--good)", flexShrink: 0 }} />
                  {t(key)}
                </div>
              ))}
            </div>
          </div>

          {/* Right hero image */}
          <div style={{ position: "relative" }}>
            <ImageBox
              tone="fjord"
              label="Justneshalvøya — render"
              ratio="4/5"
              radius="var(--radius-lg)"
              style={{ boxShadow: "var(--shadow-lg)" }}
            />
            {/* Floating badge */}
            <div
              style={{
                position: "absolute",
                bottom: -16,
                left: -16,
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                padding: "14px 18px",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--line)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div style={{ position: "relative", width: 48, height: 48 }}>
                <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
                  <circle cx={24} cy={24} r={20} fill="none" stroke="var(--surface-3)" strokeWidth={5} />
                  <circle
                    cx={24}
                    cy={24}
                    r={20}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth={5}
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * 0.38}`}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--hero-num)",
                  }}
                  className="mono"
                >
                  62%
                </div>
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                  Byggefremdrift
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  Innvendige arbeider
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface)",
          padding: "72px 24px",
          borderTop: "1px solid var(--line)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px, 3vw, 38px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              textAlign: "center",
              marginBottom: 48,
              color: "var(--ink)",
            }}
          >
            {t("how")}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {STEPS.map(({ icon, key }, i) => (
              <Card key={key} hover style={{ padding: 24 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--accent)",
                    marginBottom: 16,
                  }}
                >
                  <Icon name={icon} size={22} />
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 8, letterSpacing: ".06em" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 8 }}>
                  {t(`${key}_t` as any)}
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {t(`${key}_d` as any)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECT SHOWCASE ────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px", maxWidth: 1280, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 32,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <h2
            className="serif"
            style={{
              fontSize: "clamp(24px, 2.5vw, 34px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            {t("showcase")}
          </h2>
          <Link href={`/${locale}/auth?mode=create`} style={{ textDecoration: "none" }}>
            <Button variant="soft" size="sm" iconRight="arrowR">
              {t("cta")}
            </Button>
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {PROJECTS.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/auth?mode=create`}
              style={{ textDecoration: "none" }}
            >
              <Card hover style={{ padding: 0, overflow: "hidden" }}>
                <ImageBox
                  tone={p.tone}
                  label={`${p.name} — ${pick(p.place, locale)}`}
                  ratio="16/10"
                  radius="0"
                  style={{ borderRadius: "var(--radius) var(--radius) 0 0" }}
                />
                <div style={{ padding: "16px 18px" }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink-3)",
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon name="pin" size={13} />
                    {pick(p.place, locale)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      className="mono"
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--hero-num)",
                      }}
                    >
                      {tc("from")} <Money value={p.priceFrom} />
                    </span>
                    <Tag tone="neutral" size="sm">
                      {pick(p.status, locale)}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ────────────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--sidebar-bg)",
          backgroundImage: "var(--sidebar)",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            className="serif"
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#fff",
              marginBottom: 16,
            }}
          >
            {t("cta_band_h")}
          </h2>
          <p style={{ fontSize: 17, color: "var(--sidebar-ink)", marginBottom: 36, lineHeight: 1.6 }}>
            {t("cta_band_sub")}
          </p>
          <Link href={`/${locale}/auth?mode=create`} style={{ textDecoration: "none" }}>
            <Button variant="accent" size="lg">
              {t("cta")}
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--line)",
          padding: "28px 24px",
          background: "var(--surface)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Logo size="sm" />
          <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
            © 2026 Krag Gruppen · {t("footer")}
          </p>
        </div>
      </footer>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 720px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 920px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
