"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CHOICE_GROUPS } from "@/lib/data";
import { deriveAddonsTotal } from "@/lib/recommendations";
import { pick, fmtNOK, formatMoney } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";
import type { ChoiceGroup } from "@/types";

export function ChoicesTab() {
  const locale = useLocale();
  const t = useTranslations("choices");
  const [groups, setGroups] = useState<ChoiceGroup[]>(CHOICE_GROUPS);

  function selectOption(groupId: string, optionId: string) {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              options: g.options.map((o) => ({ ...o, selected: o.id === optionId })),
            }
          : g
      )
    );
  }

  const addonsTotal = deriveAddonsTotal(groups);

  return (
    <div style={{ maxWidth: 900, paddingBottom: 80 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          className="serif"
          style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      {groups.map((group) => {
        const selectedOpt = group.options.find((o) => o.selected);
        const isLocked = group.deadlinePassed === true;

        return (
          <div key={group.id} style={{ marginBottom: 32 }}>
            {/* Group header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>
                  {pick(group.name, locale)}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2, display: "flex", gap: 8 }}>
                  {group.deadline && (
                    <>
                      <Icon name="clock" size={12} style={{ marginTop: 1 }} />
                      <span className="mono">{pick(group.deadline, locale)}</span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {selectedOpt ? (
                  <Tag tone="good" size="sm" icon="check">{t("selected")}</Tag>
                ) : (
                  <Tag tone="warn" size="sm">{t("pending")}</Tag>
                )}
                {isLocked && <Tag tone="neutral" size="sm" icon="lock">{t("locked")}</Tag>}
              </div>
            </div>

            {/* Option cards grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              {group.options.map((opt) => {
                const isSelected = opt.selected;
                return (
                  <button
                    key={opt.id}
                    onClick={() => !isLocked && selectOption(group.id, opt.id)}
                    disabled={isLocked}
                    aria-pressed={isSelected}
                    style={{
                      border: `2px solid ${isSelected ? "var(--accent)" : "var(--line)"}`,
                      borderRadius: "var(--radius)",
                      background: isSelected ? "var(--accent-soft)" : "var(--surface)",
                      padding: 0,
                      cursor: isLocked ? "default" : "pointer",
                      textAlign: "left",
                      overflow: "hidden",
                      transition: "border-color .15s, background .15s",
                      position: "relative",
                    }}
                  >
                    <ImageBox
                      tone={opt.tone ?? "indoor"}
                      ratio="4/3"
                      radius="0"
                      style={{ borderRadius: 0 }}
                    />
                    {isSelected && (
                      <div
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: "var(--accent)",
                          color: "#fff",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Icon name="check" size={12} />
                      </div>
                    )}
                    <div style={{ padding: "10px 12px 12px" }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "var(--ink)",
                          marginBottom: 3,
                          lineHeight: 1.3,
                        }}
                      >
                        {pick(opt.name, locale).split(" — ")[0]}
                      </div>
                      {pick(opt.name, locale).includes(" — ") && (
                        <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>
                          {pick(opt.name, locale).split(" — ")[1]}
                        </div>
                      )}
                      <div
                        className="mono"
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: opt.price > 0 ? "var(--accent)" : "var(--good)",
                        }}
                      >
                        {opt.price === 0
                          ? locale === "nb" ? "Inkludert" : "Included"
                          : `+ ${formatMoney(opt.price, locale)}`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Sticky total bar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--sidebar-bg, var(--primary))",
          color: "#fff",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 40,
          boxShadow: "0 -2px 16px rgba(0,0,0,.15)",
        }}
        className="choices-total-bar"
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>{t("total_addons")}</div>
          <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>
            + {formatMoney(addonsTotal, locale)}
          </div>
        </div>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            border: "none",
            cursor: "pointer",
          }}
        >
          {t("confirm")}
        </button>
      </div>

      <style>{`
        .choices-total-bar {
          padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
        }
        @media (min-width: 921px) {
          .choices-total-bar {
            left: 256px;
          }
        }
      `}</style>
    </div>
  );
}
