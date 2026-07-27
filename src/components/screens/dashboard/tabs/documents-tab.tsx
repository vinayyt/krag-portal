"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboard } from "../dashboard-context";
import { pick } from "@/lib/format";
import { Tag } from "@/components/ui/tag";
import { Button } from "@/components/ui/button";
import type { KragDocument } from "@/types";

const CATS = ["all", "contract", "drawing", "spec"] as const;

function isImage(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}
function isPdf(url: string) {
  return /\.pdf(\?.*)?$/i.test(url);
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
    >
      <button onClick={onClose} style={{ position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", color: "#fff", fontSize: 20, width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center" }}>×</button>
      <img
        src={url} alt={name}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "92vw", maxHeight: "80vh", borderRadius: 10, boxShadow: "0 32px 80px rgba(0,0,0,.6)", cursor: "default" }}
      />
      <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <span style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 500 }}>{name}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
          style={{ padding: "8px 18px", borderRadius: 20, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Åpne i ny fane ↗
        </a>
      </div>
    </div>
  );
}

// ── Image gallery card ────────────────────────────────────────────────────────
function ImageCard({ doc, locale, onOpen }: { doc: KragDocument; locale: string; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      style={{
        borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)",
        background: "var(--surface)", cursor: "zoom-in",
        transition: "box-shadow .15s, transform .15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-md)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "none"; }}
    >
      <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
        <img src={doc.fileUrl!} alt={pick(doc.name, locale)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ padding: "10px 12px" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pick(doc.name, locale)}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{pick(doc.date, locale)}</div>
      </div>
    </div>
  );
}

// ── Document row ──────────────────────────────────────────────────────────────
function DocRow({ doc, locale, t, onImageClick, isLast }: {
  doc: KragDocument; locale: string; t: ReturnType<typeof useTranslations>;
  onImageClick: () => void; isLast: boolean;
}) {
  const hasFile = !!doc.fileUrl;
  const img = hasFile && isImage(doc.fileUrl!);
  const pdf = hasFile && isPdf(doc.fileUrl!);

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
      borderBottom: isLast ? "none" : "1px solid var(--line-2)",
      opacity: doc.soon ? 0.5 : 1,
    }}>
      {/* File type indicator */}
      {img ? (
        <img src={doc.fileUrl!} alt="" onClick={onImageClick}
          style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 7, border: "1px solid var(--line)", flexShrink: 0, cursor: "zoom-in" }} />
      ) : pdf ? (
        <div style={{ width: 44, height: 44, borderRadius: 7, background: "#fef2f2", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#dc2626", letterSpacing: ".03em" }}>
          PDF
        </div>
      ) : (
        <div style={{ width: 44, height: 44, borderRadius: 7, background: "var(--surface-2)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 20 }}>
          {doc.soon ? "🔒" : "📋"}
        </div>
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {pick(doc.name, locale)}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span>{pick(doc.date, locale)}</span>
          {doc.size && doc.size !== "—" && <><span>·</span><span>{doc.size}</span></>}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {doc.soon ? (
          <Tag tone="neutral" size="sm">{t("soon")}</Tag>
        ) : doc.signed === false ? (
          <>
            <Tag tone="warn" size="sm">⚠ {t("needs")}</Tag>
            {hasFile && (
              <a href={doc.fileUrl!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                <Button variant="accent" size="sm">{t("sign")}</Button>
              </a>
            )}
          </>
        ) : doc.signed === true ? (
          <>
            <Tag tone="good" size="sm">✓ {t("signed")}</Tag>
            {hasFile && (
              img ? (
                <button onClick={onImageClick} style={actionBtn}>
                  {locale === "nb" ? "Vis" : "View"}
                </button>
              ) : (
                <a href={doc.fileUrl!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="soft" size="sm">{t("open")}</Button>
                </a>
              )
            )}
          </>
        ) : hasFile ? (
          img ? (
            <button onClick={onImageClick} style={actionBtn}>{locale === "nb" ? "Vis bilde" : "View"}</button>
          ) : (
            <a href={doc.fileUrl!} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <Button variant="soft" size="sm">{t("open")}</Button>
            </a>
          )
        ) : null}
      </div>
    </div>
  );
}

// ── Main tab ──────────────────────────────────────────────────────────────────
export function DocumentsTab() {
  const locale = useLocale();
  const t = useTranslations("documents");
  const { documents: ALL_DOCS } = useDashboard();
  const [filter, setFilter] = useState<string>("all");
  const [lightbox, setLightbox] = useState<KragDocument | null>(null);

  const catLabels: Record<string, string> = {
    all: t("all"),
    contract: t("contracts"),
    drawing: t("drawings"),
    spec: t("specs"),
  };

  const filtered = filter === "all" ? ALL_DOCS : ALL_DOCS.filter((d) => d.cat === filter);
  const imageDocs = filtered.filter((d) => d.fileUrl && isImage(d.fileUrl) && !d.soon);
  const listDocs  = filtered;

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Lightbox */}
      {lightbox?.fileUrl && (
        <Lightbox url={lightbox.fileUrl} name={pick(lightbox.name, locale)} onClose={() => setLightbox(null)} />
      )}

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 className="serif" style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}>
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {CATS.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} aria-pressed={filter === cat}
            style={{
              padding: "7px 16px", borderRadius: 999,
              border: `1.5px solid ${filter === cat ? "var(--primary)" : "var(--line)"}`,
              background: filter === cat ? "var(--primary)" : "var(--surface)",
              color: filter === cat ? "var(--primary-ink)" : "var(--ink-2)",
              fontSize: 13.5, fontWeight: filter === cat ? 600 : 400,
              cursor: "pointer", transition: "all .15s",
            }}>
            {catLabels[cat]}
          </button>
        ))}
      </div>

      {/* ── IMAGE GALLERY ── only shown when images exist */}
      {imageDocs.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 12 }}>
            {locale === "nb" ? `Bilder og tegninger (${imageDocs.length})` : `Images & drawings (${imageDocs.length})`}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {imageDocs.map((doc) => (
              <ImageCard key={`img-${doc.id}`} doc={doc} locale={locale} onOpen={() => setLightbox(doc)} />
            ))}
          </div>
        </div>
      )}

      {/* ── DOCUMENT LIST ── */}
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--ink-3)", marginBottom: 12 }}>
        {locale === "nb" ? `Alle dokumenter (${listDocs.length})` : `All documents (${listDocs.length})`}
      </div>

      {listDocs.length === 0 ? (
        <div style={{ padding: "28px 20px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink-3)", fontSize: 14, textAlign: "center" }}>
          {locale === "nb" ? "Ingen dokumenter i denne kategorien." : "No documents in this category."}
        </div>
      ) : (
        <div style={{ borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface)", overflow: "hidden" }}>
          {listDocs.map((doc, i) => (
            <DocRow
              key={doc.id}
              doc={doc}
              locale={locale}
              t={t}
              onImageClick={() => setLightbox(doc)}
              isLast={i === listDocs.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)",
  background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 13,
  cursor: "pointer", fontWeight: 500,
};
