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

function isImage(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export function DocumentsTab() {
  const locale = useLocale();
  const t = useTranslations("documents");
  const { documents: DOCUMENTS } = useDashboard();
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const catLabels: Record<string, string> = {
    all: t("all"),
    contract: t("contracts"),
    drawing: t("drawings"),
    spec: t("specs"),
  };

  const filtered = filter === "all" ? DOCUMENTS : DOCUMENTS.filter((d) => d.cat === filter);

  // Separate image docs for the thumbnail gallery
  const imageDocs = filtered.filter((d) => d.fileUrl && isImage(d.fileUrl));
  const regularDocs = filtered;

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            alt="Forstørret visning"
            style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 10, boxShadow: "0 32px 80px rgba(0,0,0,.6)" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", top: 20, right: 24,
              background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
              color: "#fff", fontSize: 20, width: 40, height: 40, borderRadius: "50%",
              cursor: "pointer", display: "grid", placeItems: "center",
            }}
          >×</button>
          <a
            href={lightbox}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
              padding: "8px 20px", borderRadius: 20, background: "rgba(255,255,255,.15)",
              border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 13,
              fontWeight: 600, textDecoration: "none",
            }}
          >
            {locale === "nb" ? "Åpne i ny fane" : "Open in new tab"} ↗
          </a>
        </div>
      )}

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

      {/* Image thumbnail gallery (only when there are images) */}
      {imageDocs.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 10 }}>
            {locale === "nb" ? "Bilder" : "Images"} ({imageDocs.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {imageDocs.map((doc) => (
              <div
                key={`thumb-${doc.id}`}
                onClick={() => setLightbox(doc.fileUrl!)}
                title={pick(doc.name, locale)}
                style={{
                  position: "relative",
                  aspectRatio: "1",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "zoom-in",
                  border: "1px solid var(--line)",
                  background: "var(--surface-2)",
                }}
              >
                <img
                  src={doc.fileUrl!}
                  alt={pick(doc.name, locale)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {/* Hover overlay */}
                <div style={{
                  position: "absolute", inset: 0, background: "rgba(0,0,0,.0)",
                  display: "flex", alignItems: "flex-end",
                  padding: "6px 8px",
                  transition: "background .15s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,.35)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,.0)")}
                >
                  <span style={{
                    fontSize: 11, color: "#fff", fontWeight: 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    opacity: 0, transition: "opacity .15s",
                  }}
                    className="thumb-label"
                  >
                    {pick(doc.name, locale)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document list */}
      <Card style={{ padding: 0, overflow: "hidden" }}>
        {regularDocs.length === 0 ? (
          <div style={{ padding: "20px 20px", color: "var(--ink-3)", fontSize: 14 }}>
            {locale === "nb" ? "Ingen dokumenter i denne kategorien." : "No documents in this category."}
          </div>
        ) : (
          regularDocs.map((doc, i) => {
            const hasFile = !!doc.fileUrl;
            const img = hasFile && isImage(doc.fileUrl!);

            return (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 20px",
                  borderBottom: i < regularDocs.length - 1 ? "1px solid var(--line-2)" : "none",
                  opacity: doc.soon ? 0.5 : 1,
                }}
              >
                {/* Icon or mini-thumbnail */}
                {img ? (
                  <img
                    src={doc.fileUrl!}
                    alt=""
                    onClick={() => setLightbox(doc.fileUrl!)}
                    style={{
                      width: 38, height: 38, objectFit: "cover", borderRadius: 6,
                      flexShrink: 0, cursor: "zoom-in", border: "1px solid var(--line)",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 38, height: 38, borderRadius: 8, background: "var(--surface-2)",
                      display: "grid", placeItems: "center", color: "var(--ink-3)", flexShrink: 0,
                    }}
                  >
                    <Icon name="doc" size={18} />
                  </div>
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14.5, fontWeight: 500, color: "var(--ink)", marginBottom: 2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
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
                      {hasFile && (
                        <a href={doc.fileUrl!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                          <Button variant="soft" size="sm" icon="download">{t("open")}</Button>
                        </a>
                      )}
                    </>
                  ) : hasFile ? (
                    img ? (
                      <button
                        onClick={() => setLightbox(doc.fileUrl!)}
                        style={{ ...viewBtn }}
                      >
                        {locale === "nb" ? "Vis" : "View"}
                      </button>
                    ) : (
                      <a href={doc.fileUrl!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                        <Button variant="soft" size="sm" icon="eye">{t("open")}</Button>
                      </a>
                    )
                  ) : (
                    <Button variant="soft" size="sm" icon="eye" disabled>
                      {t("open")}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Card>

      <style>{`
        .thumb-label { opacity: 0; transition: opacity .15s; }
        div:hover > .thumb-label { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

const viewBtn: React.CSSProperties = {
  padding: "5px 14px", borderRadius: 8, border: "1px solid var(--line)",
  background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 13,
  cursor: "pointer", fontWeight: 500,
};
