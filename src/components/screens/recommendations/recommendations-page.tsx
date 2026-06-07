"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { computeRecommendations } from "@/lib/recommendations";
import { pick } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";
import { Money } from "@/components/ui/money";
import { Logo } from "@/components/ui/logo";
import type { QuestionAnswers } from "@/types";

export function RecommendationsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <RecommendationsPageContent />
    </Suspense>
  );
}

function RecommendationsPageContent() {
  const locale = useLocale();
  const t = useTranslations("recommendations");
  const searchParams = useSearchParams();

  const answers = useMemo<QuestionAnswers>(() => {
    try {
      return JSON.parse(searchParams.get("answers") || "{}");
    } catch {
      return {};
    }
  }, [searchParams]);

  const results = useMemo(() => computeRecommendations(answers), [answers]);
  const [top, ...rest] = results;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          background: "rgba(235,229,217,.85)",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size="sm" />
        <Link href={`/${locale}/questionnaire`} style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm" icon="chevL">
            {t("more")}
          </Button>
        </Link>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Eyebrow + title */}
        <div style={{ marginBottom: 40, textAlign: "center" }} className="fade-up">
          <Tag tone="accent" icon="sparkle" style={{ marginBottom: 16 }}>
            {t("eyebrow")}
          </Tag>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
              color: "var(--ink)",
            }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: 16, color: "var(--ink-2)", maxWidth: 520, margin: "0 auto" }}>
            {t("sub")}
          </p>
        </div>

        {/* Top match — featured */}
        {top && (
          <Card
            accent
            style={{ marginBottom: 28, padding: 0, overflow: "hidden" }}
            className="fade-up"
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
              }}
              className="rec-featured-grid"
            >
              {/* Image */}
              <div style={{ position: "relative" }}>
                <ImageBox
                  tone={top.tone}
                  label={top.name}
                  ratio="4/3"
                  radius="var(--radius) 0 0 var(--radius)"
                  style={{ height: "100%" }}
                />
                {/* Match tag */}
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                    background: "var(--ink)",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "6px 14px",
                    fontSize: 14,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  className="mono"
                >
                  <Icon name="sparkle" size={14} />
                  {top.matchScore}% {t("match")}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: 32 }}>
                <div style={{ marginBottom: 12 }}>
                  <Tag tone="good" size="sm" style={{ marginBottom: 10 }}>
                    {pick(top.status, locale)}
                  </Tag>
                  <div
                    style={{ fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <Icon name="pin" size={13} />
                    {pick(top.place, locale)}
                  </div>
                </div>

                <h2
                  className="serif"
                  style={{
                    fontSize: 26,
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                    color: "var(--ink)",
                  }}
                >
                  {top.name}
                </h2>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 20 }}>
                  {pick(top.blurb, locale)}
                </p>

                {/* Why box */}
                {top.why && (
                  <div
                    style={{
                      background: "var(--good-soft)",
                      borderRadius: "var(--radius-sm)",
                      padding: "14px 16px",
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: "var(--good)", marginBottom: 10 }}
                    >
                      {t("why")}
                    </div>
                    {(top.why[locale as keyof typeof top.why] ?? top.why.no).slice(0, 3).map((reason: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          marginBottom: i < 2 ? 8 : 0,
                          fontSize: 13.5,
                          color: "var(--ink-2)",
                        }}
                      >
                        <Icon name="check" size={15} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} />
                        {reason}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{t("from")}</div>
                    <div
                      className="mono"
                      style={{ fontSize: 20, fontWeight: 600, color: "var(--hero-num)" }}
                    >
                      <Money value={top.priceFrom} />
                    </div>
                  </div>
                  <Link
                    href={`/${locale}/projects/${top.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="primary" size="md" iconRight="arrowR">
                      {t("view")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Remaining matches */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {rest.map((p) => (
            <Link key={p.id} href={`/${locale}/projects/${p.id}`} style={{ textDecoration: "none" }}>
              <Card hover style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                <div style={{ position: "relative" }}>
                  <ImageBox
                    tone={p.tone}
                    label={p.name}
                    ratio="16/10"
                    radius="var(--radius) var(--radius) 0 0"
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      background: "rgba(20,18,14,.72)",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "5px 12px",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                    className="mono"
                  >
                    {p.matchScore}% {t("match")}
                  </div>
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink-3)",
                      marginBottom: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Icon name="pin" size={13} />
                    {pick(p.place, locale)} · {pick(p.type, locale)}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                    {(locale === "en" ? p.tags.en : p.tags.no).slice(0, 3).map((tag) => (
                      <Tag key={tag} tone="neutral" size="sm">{tag}</Tag>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--hero-num)" }}>
                      {t("from")} <Money value={p.priceFrom} />
                    </span>
                    <Icon name="arrowR" size={18} style={{ color: "var(--ink-3)" }} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .rec-featured-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
