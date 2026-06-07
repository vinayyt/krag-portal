"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PHASES, DASHBOARD_PROJECT } from "@/lib/data";
import { pick } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Ring, ProgressBar } from "@/components/ui/progress";

export function ProgressTab() {
  const locale = useLocale();
  const t = useTranslations("progress");
  const project = DASHBOARD_PROJECT;
  const donePhasesCount = PHASES.filter((p) => p.status === "done").length;
  const daysToHandover = 90; // computed in production from handover date

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Summary card */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <Ring value={project.progress} size={104} strokeWidth={9}>
            <div style={{ textAlign: "center" }}>
              <div
                className="mono"
                style={{ fontSize: 22, fontWeight: 700, color: "var(--hero-num)", lineHeight: 1 }}
              >
                {project.progress}%
              </div>
            </div>
          </Ring>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>
              {t("active")}
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 12 }}>
              {donePhasesCount}/{PHASES.length} {t("phases")} · ~{daysToHandover} {t("days_to")}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Tag tone="good">{donePhasesCount} {t("done")}</Tag>
              <Tag tone="accent">1 {t("active")}</Tag>
              <Tag tone="neutral">{PHASES.length - donePhasesCount - 1} {t("upcoming")}</Tag>
            </div>
          </div>
        </div>
      </Card>

      {/* Phase timeline */}
      <Card>
        <div style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 20, color: "var(--ink)" }}>
          {t("title")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {PHASES.map((phase, i) => {
            const isLast = i === PHASES.length - 1;
            return (
              <div key={phase.id} style={{ display: "flex", gap: 16 }}>
                {/* Status node + connector */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 32 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      background:
                        phase.status === "done"
                          ? "var(--good-soft)"
                          : phase.status === "active"
                          ? "var(--accent-soft)"
                          : "var(--surface-2)",
                      color:
                        phase.status === "done"
                          ? "var(--good)"
                          : phase.status === "active"
                          ? "var(--accent)"
                          : "var(--ink-3)",
                      flexShrink: 0,
                      boxShadow:
                        phase.status === "active"
                          ? "0 0 0 4px var(--accent-soft)"
                          : "none",
                      fontSize: 13,
                      fontWeight: 600,
                      zIndex: 1,
                    }}
                    className="mono"
                  >
                    {phase.status === "done" ? (
                      <Icon name="check" size={16} />
                    ) : phase.status === "active" ? (
                      <Icon name="tools" size={16} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 28,
                        background:
                          phase.status === "done" ? "var(--good-soft)" : "var(--line)",
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>

                {/* Content */}
                <div style={{ paddingBottom: isLast ? 0 : 20, flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: phase.status === "active" ? 600 : 400,
                          color:
                            phase.status === "upcoming" ? "var(--ink-3)" : "var(--ink)",
                          marginBottom: 4,
                        }}
                      >
                        {pick(phase.name, locale)}
                      </div>
                      <div className="mono" style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
                        {pick(phase.date, locale)}
                      </div>
                    </div>
                    <Tag
                      tone={
                        phase.status === "done"
                          ? "good"
                          : phase.status === "active"
                          ? "accent"
                          : "neutral"
                      }
                      size="sm"
                    >
                      {phase.status === "done"
                        ? t("done")
                        : phase.status === "active"
                        ? t("active")
                        : t("upcoming")}
                    </Tag>
                  </div>
                  {phase.status === "active" && phase.pct > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                          fontSize: 12.5,
                          color: "var(--ink-3)",
                        }}
                      >
                        <span>{phase.pct}% {t("complete")}</span>
                      </div>
                      <ProgressBar value={phase.pct} height={6} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
