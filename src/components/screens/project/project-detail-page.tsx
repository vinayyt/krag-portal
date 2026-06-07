"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { PROJECTS, PROJECT_UNITS, ADVISOR } from "@/lib/data";
import { pick } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";
import { Money } from "@/components/ui/money";
import { Avatar } from "@/components/ui/avatar";
import { Logo } from "@/components/ui/logo";

export function ProjectDetailPage({ projectId }: { projectId: string }) {
  const locale = useLocale();
  const t = useTranslations("project");
  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];
  const units = PROJECT_UNITS[project.id] || [];

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
        <Link href={`/${locale}/recommendations`} style={{ textDecoration: "none" }}>
          <Button variant="ghost" size="sm" icon="chevL">
            {t("back")}
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <div style={{ position: "relative", height: "340px", overflow: "hidden" }}>
        <ImageBox
          tone={project.tone}
          label={`${project.name} — render`}
          ratio="21/8"
          radius="0"
          style={{ height: "100%", borderRadius: 0 }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(20,18,14,.7) 0%, transparent 60%)",
          }}
        />
        {/* Hero text */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            left: 28,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {project.match && (
            <Tag tone="solid" style={{ alignSelf: "flex-start" }}>
              {project.match}% match
            </Tag>
          )}
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.8)", display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="pin" size={13} />
            {pick(project.place, locale)}
          </div>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              color: "#fff",
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {project.name}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 28, alignItems: "start" }}
          className="pd-grid"
        >
          {/* Left */}
          <div>
            {/* Key facts */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "var(--ink)" }}>
                {t("facts")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                {[
                  { label: t("size"), value: `${project.sizeFrom}–${project.sizeTo} m²`, icon: "ruler" },
                  { label: t("bedrooms"), value: project.bedrooms, icon: "bed" },
                  { label: t("type"), value: pick(project.type, locale), icon: "home" },
                  { label: t("status"), value: pick(project.status, locale), icon: "check" },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px",
                      background: "var(--surface-2)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <Icon name={icon} size={18} style={{ color: "var(--ink-3)" }} />
                    <div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{label}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* About */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: "var(--ink)" }}>
                {t("about")}
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "var(--ink-2)", marginBottom: 16 }}>
                {pick(project.blurb, locale)}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(locale === "en" ? project.tags.en : project.tags.no).map((tag) => (
                  <Tag key={tag} tone="neutral" size="sm">{tag}</Tag>
                ))}
              </div>
            </Card>

            {/* Available units */}
            {units.length > 0 && (
              <Card>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "var(--ink)" }}>
                  {t("units")}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {units.map((unit) => (
                    <div
                      key={unit.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--line)",
                        background: unit.reserved ? "var(--surface-2)" : "var(--surface)",
                        opacity: unit.reserved ? 0.6 : 1,
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <span
                          className="mono"
                          style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", minWidth: 28 }}
                        >
                          {unit.label}
                        </span>
                        <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
                          {unit.size} m² · {unit.bedrooms} {t("bedrooms").toLowerCase()}
                          {unit.feature && ` · ${pick(unit.feature, locale)}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--hero-num)" }}>
                          <Money value={unit.price} />
                        </span>
                        {unit.reserved ? (
                          <Tag tone="neutral" size="sm">{t("reserved")}</Tag>
                        ) : (
                          <Link href={`/${locale}/meeting?unit=${unit.id}&project=${project.id}`} style={{ textDecoration: "none" }}>
                            <Button variant="soft" size="sm">
                              {t("choose")}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right sticky CTA */}
          <div style={{ position: "sticky", top: 88 }}>
            <Card accent>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Fra</div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 700, color: "var(--hero-num)" }}>
                  <Money value={project.priceFrom} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                <Link href={`/${locale}/meeting?project=${project.id}`} style={{ textDecoration: "none" }}>
                  <Button variant="primary" size="md" full>
                    {t("book")}
                  </Button>
                </Link>
                <Button variant="soft" size="md" full>
                  {t("interested")}
                </Button>
              </div>

              {/* Advisor mini card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px",
                  background: "var(--surface-2)",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: 14,
                }}
              >
                <Avatar initials={ADVISOR.initials} size={36} tone="primary" />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>
                    {ADVISOR.name}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    {pick(ADVISOR.role, locale)}
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-3)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {t("trust")}
              </p>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .pd-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
