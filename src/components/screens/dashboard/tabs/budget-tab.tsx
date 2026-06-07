"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { BUDGET, PAYMENTS, CHOICE_GROUPS } from "@/lib/data";
import { deriveAddonsTotal } from "@/lib/recommendations";
import { pick, fmtNOK } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Money } from "@/components/ui/money";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";

export function BudgetTab() {
  const locale = useLocale();
  const t = useTranslations("budget");
  const addonsTotal = deriveAddonsTotal(CHOICE_GROUPS);
  const total = BUDGET.base + addonsTotal;
  const remaining = total - BUDGET.paid;
  const paidPct = (BUDGET.paid / total) * 100;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* 3 stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
        className="budget-stat-row"
      >
        <Card accent>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>{t("total")}</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>
            <Money value={total} />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            {fmtNOK(BUDGET.base)} + {fmtNOK(addonsTotal)} {t("incl_options").replace("incl. options", "").replace("inkl. ", "")}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>{t("paid")}</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--good)", marginBottom: 6 }}>
            <Money value={BUDGET.paid} />
          </div>
          <ProgressBar value={paidPct} height={6} color="var(--good)" />
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>
            {Math.round(paidPct)}%
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4 }}>{t("remaining")}</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--warn)", marginBottom: 6 }}>
            <Money value={remaining} />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            {100 - Math.round(paidPct)}% {locale === "nb" ? "gjenstår" : "remaining"}
          </div>
        </Card>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}
        className="budget-layout"
      >
        {/* Payment schedule */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>{t("schedule")}</div>
            <Button variant="soft" size="sm" icon="download">
              {t("download")}
            </Button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PAYMENTS.map((payment, i) => {
              const isLast = i === PAYMENTS.length - 1;
              return (
                <div key={payment.id} style={{ display: "flex", gap: 14 }}>
                  {/* Status node */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: payment.status === "paid" ? "var(--good-soft)" : "var(--surface-2)",
                        color: payment.status === "paid" ? "var(--good)" : "var(--ink-3)",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Icon name={payment.status === "paid" ? "check" : "clock"} size={14} />
                    </div>
                    {!isLast && (
                      <div style={{ width: 1, flex: 1, minHeight: 20, background: "var(--line)", margin: "3px 0" }} />
                    )}
                  </div>

                  {/* Payment info */}
                  <div
                    style={{
                      flex: 1,
                      paddingBottom: isLast ? 0 : 16,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>
                        {pick(payment.label, locale)}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)", display: "flex", gap: 6 }}>
                        <span className="mono">{payment.pct}</span>
                        <span>·</span>
                        <span className="mono">{pick(payment.date, locale)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                        <Money value={payment.amount} />
                      </span>
                      <Tag
                        tone={payment.status === "paid" ? "good" : "warn"}
                        size="sm"
                      >
                        {payment.status === "paid" ? t("paid_status") : t("upcoming")}
                      </Tag>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Add-ons */}
        <Card>
          <div style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 16, color: "var(--ink)" }}>
            {t("addons")}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {CHOICE_GROUPS.map((g) => {
              const selected = g.options.find((o) => o.selected && o.price > 0);
              if (!selected) return null;
              return (
                <div
                  key={g.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13.5, color: "var(--ink)" }}>
                      {pick(g.name, locale)}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                      {pick(selected.name, locale).split(" — ")[0]}
                    </div>
                  </div>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)", flexShrink: 0 }}>
                    + <Money value={selected.price} />
                  </span>
                </div>
              );
            })}
          </div>
          <div
            style={{
              borderTop: "1px solid var(--line)",
              paddingTop: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{t("options_total")}</span>
            <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--hero-num)" }}>
              <Money value={addonsTotal} />
            </span>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .budget-stat-row { grid-template-columns: 1fr !important; }
          .budget-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 920px) {
          .budget-stat-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
