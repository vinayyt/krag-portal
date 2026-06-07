"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PHOTO_ALBUMS } from "@/lib/data";
import { pick } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";

export function PhotosTab() {
  const locale = useLocale();
  const t = useTranslations("photos");

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          className="serif"
          style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      {PHOTO_ALBUMS.map((album, ai) => (
        <div key={ai} style={{ marginBottom: 32 }}>
          {/* Album header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>
                {pick(album.phase, locale)}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", display: "flex", gap: 8, marginTop: 2 }}>
                <span className="mono">{pick(album.date, locale)}</span>
                <span>·</span>
                <span className="mono">{album.count} {t("photos")}</span>
              </div>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 13,
                color: "var(--accent)",
                fontWeight: 600,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <Icon name="expand" size={14} />
              {locale === "nb" ? "Se alle" : "See all"}
            </button>
          </div>

          {/* Photo grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 8,
            }}
            className="photo-grid"
          >
            {Array.from({ length: Math.min(album.count, 8) }).map((_, i) => (
              <ImageBox
                key={i}
                tone={album.tone}
                ratio="1/1"
                radius="var(--radius-sm)"
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      ))}

      <style>{`
        @media (max-width: 720px) {
          .photo-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
