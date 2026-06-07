"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FLOORS, DASHBOARD_PROJECT } from "@/lib/data";
import { pick } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { ImageBox } from "@/components/ui/image-box";

const CONTROLS = [
  { id: "exterior", icon: "building" },
  { id: "interior", icon: "home" },
  { id: "kitchen", icon: "tools" },
  { id: "bath", icon: "layers" },
] as const;

export function Model3DTab() {
  const locale = useLocale();
  const t = useTranslations("model3d");
  const [activeFloor, setActiveFloor] = useState<string>(FLOORS[0]?.id ?? "");
  const [activeControl, setActiveControl] = useState<string>("exterior");

  const selectedFloor = FLOORS.find((f) => f.id === activeFloor);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 20 }}>
        <h2
          className="serif"
          style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>
          {DASHBOARD_PROJECT.name} B7
        </p>
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 }}
        className="model-layout"
      >
        {/* Viewer */}
        <div>
          <Card style={{ padding: 0, overflow: "hidden" }}>
            {/* Viewer area */}
            <div style={{ position: "relative" }}>
              <ImageBox
                tone="render"
                ratio="4/3"
                radius="0"
                label={`${DASHBOARD_PROJECT.name} · ${selectedFloor ? pick(selectedFloor.name, locale) : ""}`}
                icon="cube"
                style={{ borderRadius: 0 }}
              />

              {/* Control chips overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 12,
                  display: "flex",
                  gap: 6,
                }}
              >
                {CONTROLS.map((ctrl) => (
                  <button
                    key={ctrl.id}
                    onClick={() => setActiveControl(ctrl.id)}
                    aria-pressed={activeControl === ctrl.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.3)",
                      background:
                        activeControl === ctrl.id
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(0,0,0,0.35)",
                      color: activeControl === ctrl.id ? "var(--ink)" : "#fff",
                      fontSize: 12.5,
                      fontWeight: activeControl === ctrl.id ? 600 : 400,
                      cursor: "pointer",
                      backdropFilter: "blur(4px)",
                      transition: "all .15s",
                    }}
                  >
                    <Icon name={ctrl.icon} size={13} />
                    {t(ctrl.id)}
                  </button>
                ))}
              </div>

              {/* Fullscreen hint */}
              <button
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "none",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  fontSize: 12.5,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                }}
              >
                <Icon name="expand" size={13} />
                {t("fullscreen")}
              </button>
            </div>

            {/* Info bar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                background: "var(--surface-2)",
                borderTop: "1px solid var(--line-2)",
                fontSize: 13,
                color: "var(--ink-2)",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", gap: 14 }}>
                <span className="mono">{DASHBOARD_PROJECT.unit}</span>
                <span>·</span>
                <span>{pick(DASHBOARD_PROJECT.place, locale)}</span>
              </div>
              <span style={{ fontSize: 12, color: "var(--ink-3)" }}>
                {t("viewer_note")}
              </span>
            </div>
          </Card>
        </div>

        {/* Floor selector sidebar */}
        <div>
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: "var(--ink)" }}>
              {t("floors")}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {FLOORS.map((floor) => {
                const isActive = activeFloor === floor.id;
                return (
                  <button
                    key={floor.id}
                    onClick={() => setActiveFloor(floor.id)}
                    aria-pressed={isActive}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      borderRadius: "var(--radius-sm)",
                      border: `1.5px solid ${isActive ? "var(--accent)" : "var(--line)"}`,
                      background: isActive ? "var(--accent-soft)" : "var(--surface)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all .15s",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "var(--accent)" : "var(--ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pick(floor.name, locale)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .model-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
