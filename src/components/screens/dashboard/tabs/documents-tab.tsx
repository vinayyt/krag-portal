"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboard } from "../dashboard-context";
import { pick } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

const CATS = ["all", "contract", "drawing", "spec"] as const;

export function DocumentsTab() {
  const locale = useLocale();
  const t = useTranslations("documents");
  const { documents: DOCUMENTS } = useDashboard();
  const [filter, setFilter] = useState<string>("all");

  const catLabels: Record<string, string> = {
    all: t("all"),
    contract: t("contracts"),
    drawing: t("drawings"),
    spec: t("specs"),
  };

  const filtered = filter === "all" ? DOCUMENTS : DOCUMENTS.filter((d) => d.cat === filter);

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2
          className="serif"
          style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {CATS.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: `1.5px solid ${filter === cat ? "var(--primary)" : "var(--line)"}`,
              background: filter === cat ? "var(--primary)" : "var(--surface)",
              color: filter === cat ? "var(--primary-ink)" : "var(--ink-2)",
              fontSize: 13.5,
              fontWeight: filter === cat ? 600 : 400,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {catLabels[cat]}
          </button>
        ))}
      </div>

      {/* Document list */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {filtered.map((doc, i) => (
          <div
            key={doc.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 20px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--line-2)" : "none",
              opacity: doc.soon ? 0.5 : 1,
            }}
          >
            {/* Doc icon */}
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: "var(--surface-2)",
                display: "grid",
                placeItems: "center",
                color: "var(--ink-3)",
                flexShrink: 0,
              }}
            >
              <Icon name="doc" size={18} />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 500,
                  color: "var(--ink)",
                  marginBottom: 2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {pick(doc.name, locale)}
              </div>
              <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {pick(doc.date, locale)}{doc.size !== "—" ? ` · ${doc.size}` : ""}
              </div>
            </div>

            {/* Status + action */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {doc.soon ? (
                <Tag tone="neutral" size="sm">{t("soon")}</Tag>
              ) : doc.signed === false ? (
                <>
                  <Tag tone="warn" size="sm" icon="signature">{t("needs")}</Tag>
                  <Button variant="accent" size="sm" icon="signature">
                    {t("sign")}
                  </Button>
                </>
              ) : doc.signed === true ? (
                <>
                  <Tag tone="good" size="sm" icon="check">{t("signed")}</Tag>
                  <Button variant="soft" size="sm" icon="download">
                    {t("open")}
                  </Button>
                </>
              ) : (
                <Button variant="soft" size="sm" icon="eye">
                  {t("open")}
                </Button>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
