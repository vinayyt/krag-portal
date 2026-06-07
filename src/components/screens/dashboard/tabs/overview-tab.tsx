"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  DASHBOARD_PROJECT,
  ADVISOR,
  BUDGET,
  PAYMENTS,
  UPDATES,
  ACTIVITY_TODAY,
  CHOICE_GROUPS,
  DOCUMENTS,
  PHOTO_ALBUMS,
  PHASES,
} from "@/lib/data";
import { pick, fmtNOK } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";
import { Avatar } from "@/components/ui/avatar";
import { Money } from "@/components/ui/money";
import { Ring, ProgressBar } from "@/components/ui/progress";
import type { DashboardTab } from "../dashboard-shell";

interface OverviewTabProps {
  setTab: (tab: DashboardTab) => void;
}

export function OverviewTab({ setTab }: OverviewTabProps) {
  const locale = useLocale();
  const t = useTranslations("overview");
  const project = DASHBOARD_PROJECT;
  const nextPayment = PAYMENTS.find((p) => p.status === "upcoming");
  const activePhase = PHASES.find((p) => p.status === "active");
  const unreadMessages = 1;

  return (
    <div>
      {/* Stat row — 4 cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 20,
        }}
        className="stat-row"
      >
        {/* Build progress */}
        <Card>
          <CardHeader title={t("progress")} icon="activity" />
          <div
            className="mono"
            style={{ fontSize: 40, fontWeight: 700, color: "var(--hero-num)", lineHeight: 1, marginBottom: 6 }}
          >
            {project.progress}%
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 10 }}>
            {t("on_track")}
          </div>
          <ProgressBar value={project.progress} />
          {activePhase && (
            <button
              onClick={() => setTab("progress")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginTop: 10,
                fontSize: 12.5,
                color: "var(--accent)",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {pick(activePhase.name, locale)}
              <Icon name="chevR" size={13} />
            </button>
          )}
        </Card>

        {/* Budget status */}
        <Card>
          <CardHeader title={t("budget_status")} icon="wallet" />
          <div
            className="mono"
            style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}
          >
            <Money value={BUDGET.total} />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 8 }}>
            {fmtNOK(BUDGET.paid)} {locale === "nb" ? "innbetalt" : "paid"}
          </div>
          <ProgressBar value={(BUDGET.paid / BUDGET.total) * 100} />
          {nextPayment && (
            <div style={{ marginTop: 10, fontSize: 12.5, color: "var(--ink-2)" }}>
              {t("next_payment")}: <span className="mono" style={{ fontWeight: 600 }}>
                <Money value={nextPayment.amount} />
              </span>
            </div>
          )}
        </Card>

        {/* Latest update */}
        <Card>
          <CardHeader
            title={t("last_update")}
            icon="camera"
            action={
              <button
                onClick={() => setTab("photos")}
                style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {t("see_all")}
              </button>
            }
          />
          <ImageBox
            tone={PHOTO_ALBUMS[0].tone}
            label={pick(PHOTO_ALBUMS[0].phase, locale)}
            ratio="16/9"
            badge={`${PHOTO_ALBUMS[0].count} ${t("photos_count")}`}
            style={{ marginBottom: 8 }}
          />
          <div style={{ fontSize: 12.5, color: "var(--ink-2)" }}>
            {pick(PHOTO_ALBUMS[0].phase, locale)} · {pick(PHOTO_ALBUMS[0].date, locale)}
          </div>
        </Card>

        {/* Activity today */}
        <Card>
          <CardHeader title={t("today")} icon="tools" />
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {ACTIVITY_TODAY.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  paddingBottom: i < ACTIVITY_TODAY.length - 1 ? 10 : 0,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i === ACTIVITY_TODAY.length - 1 ? "var(--accent)" : "var(--line)",
                      marginTop: 4,
                    }}
                  />
                  {i < ACTIVITY_TODAY.length - 1 && (
                    <div style={{ width: 1, flex: 1, background: "var(--line)", marginTop: 2 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 8 }}>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>{item.time}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.4 }}>
                    {pick(item.text, locale)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Middle row — 3D model + AI */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.7fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
        className="middle-row"
      >
        {/* 3D model preview */}
        <Card>
          <CardHeader
            title={locale === "nb" ? "3D-modell" : "3D Model"}
            icon="cube"
            action={
              <Button variant="soft" size="sm" onClick={() => setTab("model3d")}>
                {locale === "nb" ? "Åpne" : "Open"}
              </Button>
            }
          />
          <ImageBox
            tone="render"
            label={`${project.name} B7 — 3D`}
            ratio="16/9"
            icon="cube"
          />
        </Card>

        {/* AI Assistant mini */}
        <Card>
          <CardHeader title={locale === "nb" ? "AI Byggeassistent" : "AI Build Assistant"} icon="sparkle" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(locale === "nb"
              ? ["Hva skjer denne uken?", "Når er neste betaling?", "Kjøkken-frist?"]
              : ["What's happening this week?", "When's my next payment?", "Kitchen deadline?"]
            ).map((q) => (
              <button
                key={q}
                onClick={() => setTab("overview")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "9px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                  color: "var(--ink-2)",
                  fontSize: 13.5,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color .15s",
                }}
              >
                <Icon name="sparkle" size={14} style={{ color: "var(--accent)", flexShrink: 0 }} />
                {q}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 14, borderTop: "1px solid var(--line-2)", paddingTop: 12, display: "flex", gap: 8 }}>
            <input
              placeholder={locale === "nb" ? "Still et spørsmål…" : "Ask a question…"}
              style={{
                flex: 1,
                padding: "9px 12px",
                borderRadius: 999,
                border: "1.5px solid var(--line)",
                background: "var(--surface)",
                fontSize: 13.5,
                outline: "none",
                color: "var(--ink)",
              }}
            />
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "var(--primary)",
                color: "var(--primary-ink)",
                border: "none",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              aria-label="Send"
            >
              <Icon name="send" size={16} />
            </button>
          </div>
        </Card>
      </div>

      {/* Bottom row — 3 cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
        className="bottom-row"
      >
        {/* Choices preview */}
        <Card>
          <CardHeader
            title={locale === "nb" ? "Tilvalg" : "Choices"}
            icon="swatch"
            action={
              <button
                onClick={() => setTab("choices")}
                style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {t("see_all")}
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CHOICE_GROUPS.slice(0, 3).map((g) => {
              const selected = g.options.find((o) => o.selected);
              return (
                <div
                  key={g.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>
                      {pick(g.name, locale)}
                    </div>
                    {selected && (
                      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>
                        {pick(selected.name, locale).split(" — ")[0]}
                      </div>
                    )}
                  </div>
                  <Tag tone={selected ? "good" : "warn"} size="sm">
                    {selected
                      ? locale === "nb" ? "Valgt" : "Selected"
                      : locale === "nb" ? "Venter" : "Pending"}
                  </Tag>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Photo log preview */}
        <Card>
          <CardHeader
            title={locale === "nb" ? "Bildelogg" : "Photos"}
            icon="photo"
            action={
              <button
                onClick={() => setTab("photos")}
                style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {t("see_all")}
              </button>
            }
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
            {PHOTO_ALBUMS.slice(0, 4).map((album, i) => (
              <ImageBox
                key={i}
                tone={album.tone}
                label={pick(album.phase, locale)}
                ratio="1/1"
                radius="var(--radius-sm)"
                badge={album.count}
              />
            ))}
          </div>
        </Card>

        {/* Documents preview */}
        <Card>
          <CardHeader
            title={locale === "nb" ? "Dokumenter" : "Documents"}
            icon="doc"
            action={
              <button
                onClick={() => setTab("documents")}
                style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
              >
                {t("see_all")}
              </button>
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DOCUMENTS.filter((d) => !d.soon).slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                  <Icon name="doc" size={16} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--ink)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pick(doc.name, locale)}
                  </div>
                </div>
                {doc.signed === false ? (
                  <Tag tone="warn" size="sm">{locale === "nb" ? "Signer" : "Sign"}</Tag>
                ) : doc.signed === true ? (
                  <Tag tone="good" size="sm">{locale === "nb" ? "Signert" : "Signed"}</Tag>
                ) : (
                  <Tag tone="neutral" size="sm">{locale === "nb" ? "Åpne" : "Open"}</Tag>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1100px) {
          .stat-row { grid-template-columns: repeat(2, 1fr) !important; }
          .bottom-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 720px) {
          .stat-row { grid-template-columns: 1fr !important; }
          .middle-row { grid-template-columns: 1fr !important; }
          .bottom-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
