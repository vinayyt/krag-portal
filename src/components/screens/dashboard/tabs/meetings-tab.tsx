"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MEETINGS_DATA, INSPECTIONS, ADVISOR, BUYER, DASHBOARD_PROJECT } from "@/lib/data";
import { pick } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { RecordButton } from "@/components/ui/record-button";
import type { Meeting } from "@/types";

interface MeetingWithStatus extends Meeting {
  status: "upcoming" | "past";
}

export function MeetingsTab() {
  const locale = useLocale();
  const t = useTranslations("meetings_tab");
  const [activeSection, setActiveSection] = useState<"upcoming" | "past">("upcoming");

  const upcomingMeetings: MeetingWithStatus[] = MEETINGS_DATA.upcoming.map((m) => ({
    ...m,
    status: "upcoming" as const,
  }));
  const pastMeetings: MeetingWithStatus[] = MEETINGS_DATA.past.map((m) => ({
    ...m,
    status: "past" as const,
  }));

  const shown = activeSection === "upcoming" ? upcomingMeetings : pastMeetings;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h2
          className="serif"
          style={{ fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 4, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      {/* Toggle */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--surface-2)",
          borderRadius: 999,
          marginBottom: 20,
          width: "fit-content",
        }}
      >
        {(["upcoming", "past"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setActiveSection(s)}
            style={{
              padding: "7px 18px",
              borderRadius: 999,
              border: "none",
              background: activeSection === s ? "var(--surface)" : "transparent",
              color: activeSection === s ? "var(--ink)" : "var(--ink-3)",
              fontWeight: activeSection === s ? 600 : 400,
              fontSize: 13.5,
              cursor: "pointer",
              boxShadow: activeSection === s ? "var(--shadow-sm)" : "none",
              transition: "all .15s",
            }}
          >
            {s === "upcoming" ? t("upcoming") : t("past")}
          </button>
        ))}
      </div>

      {/* Meetings */}
      {shown.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "40px 24px", color: "var(--ink-3)" }}>
          {t("empty")}
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {shown.map((meeting) => {
            const isOnline = meeting.online === true;
            const iconName = isOnline ? "video" : "building";
            return (
              <Card key={meeting.id} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                {/* Icon chip */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "var(--accent-soft)",
                    color: "var(--accent)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={iconName} size={20} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 6,
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                      {pick(meeting.title, locale)}
                    </div>
                    <Tag
                      tone={meeting.status === "upcoming" ? "accent" : "neutral"}
                      size="sm"
                    >
                      {meeting.status === "upcoming" ? t("upcoming") : t("past")}
                    </Tag>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "4px 16px",
                      fontSize: 13,
                      color: "var(--ink-2)",
                      marginBottom: 12,
                    }}
                  >
                    <span className="mono">{pick(meeting.date, locale)}</span>
                    <span>·</span>
                    <span className="mono">{meeting.time}</span>
                    <span>·</span>
                    <span>{pick(meeting.type, locale)}</span>
                  </div>

                  {meeting.status === "upcoming" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        {isOnline && (
                          <Button variant="accent" size="sm" icon="video">
                            {t("join")}
                          </Button>
                        )}
                        <Button variant="soft" size="sm">
                          {t("reschedule")}
                        </Button>
                      </div>
                      <RecordButton
                        meetingTitle={pick(meeting.title, locale)}
                        meetingDate={pick(meeting.date, locale)}
                        projectName={`${DASHBOARD_PROJECT.name} – ${DASHBOARD_PROJECT.unit}`}
                        pmName={ADVISOR.name}
                        pmEmail={ADVISOR.email}
                        buyerName={BUYER.fullName}
                        locale={locale}
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Inspections section */}
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
          {t("inspections")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {INSPECTIONS.map((ins) => (
            <Card
              key={ins.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                opacity: ins.status === "upcoming" ? 1 : 0.7,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: ins.status === "done" ? "var(--good-soft)" : "var(--surface-2)",
                  color: ins.status === "done" ? "var(--good)" : "var(--ink-3)",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                }}
              >
                <Icon name={ins.status === "done" ? "check" : "tools"} size={17} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>
                  {pick(ins.title, locale)}
                </div>
                <div className="mono" style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {pick(ins.date, locale)} · {ins.time}
                </div>
              </div>
              <Tag tone={ins.status === "done" ? "good" : "neutral"} size="sm">
                {ins.status === "done"
                  ? locale === "nb" ? "Fullført" : "Done"
                  : locale === "nb" ? "Planlagt" : "Planned"}
              </Tag>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
