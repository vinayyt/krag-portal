"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ADVISOR } from "@/lib/data";
import { getBookingSlots, pick } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { TextareaField } from "@/components/ui/field";
import { Logo } from "@/components/ui/logo";
import type { MeetingType } from "@/types";

const MEETING_TYPES: Array<{ id: MeetingType; icon: string; labelKey: string }> = [
  { id: "office", icon: "briefcase", labelKey: "office" },
  { id: "digital", icon: "video", labelKey: "digital" },
  { id: "site", icon: "pin", labelKey: "site" },
  { id: "phone", icon: "phone", labelKey: "phone" },
];

export function MeetingBookingPage() {
  const locale = useLocale();
  const t = useTranslations("meeting");
  const router = useRouter();

  const [meetingType, setMeetingType] = useState<MeetingType | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const slots = getBookingSlots(10, locale);
  const currentSlot = slots.find((s) => s.date === selectedDay);

  const canConfirm = !!meetingType && !!selectedDay && !!selectedTime;

  async function handleConfirm() {
    if (!canConfirm) return;
    setLoading(true);
    // In production: POST /api/meetings with booking details
    await new Promise((r) => setTimeout(r, 800));
    setBooked(true);
    setLoading(false);
  }

  if (booked) {
    return <BookingSuccess locale={locale} t={t} meetingType={meetingType!} day={selectedDay!} time={selectedTime!} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--line)",
          background: "rgba(235,229,217,.85)",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Logo size="sm" />
        <Button variant="ghost" size="sm" icon="chevL" onClick={() => router.back()}>
          {t("with")}
        </Button>
      </header>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <h1
            className="serif"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              marginBottom: 8,
              color: "var(--ink)",
            }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-2)" }}>{t("sub")}</p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 28, alignItems: "start" }}
          className="meeting-grid"
        >
          {/* Left form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Advisor */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials={ADVISOR.initials} size={44} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{ADVISOR.name}</div>
                <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{pick(ADVISOR.role, locale)}</div>
              </div>
            </div>

            {/* Meeting type */}
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 12 }}>
                {t("type")}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {MEETING_TYPES.map(({ id, icon, labelKey }) => {
                  const sel = meetingType === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setMeetingType(id)}
                      aria-pressed={sel}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "14px 16px",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${sel ? "var(--accent)" : "var(--line)"}`,
                        background: sel ? "var(--accent-soft)" : "var(--surface)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: sel ? "var(--accent)" : "var(--surface-2)",
                          color: sel ? "#fff" : "var(--ink-2)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          transition: "all .15s",
                        }}
                      >
                        <Icon name={icon} size={18} />
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          color: sel ? "var(--accent)" : "var(--ink)",
                        }}
                      >
                        {t(labelKey as any)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Day picker */}
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 12 }}>
                {t("pickday")}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  paddingBottom: 8,
                }}
                className="scroll-snap-x"
              >
                {slots.map((slot) => {
                  const sel = selectedDay === slot.date;
                  return (
                    <button
                      key={slot.date}
                      onClick={() => { setSelectedDay(slot.date); setSelectedTime(null); }}
                      aria-pressed={sel}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        minWidth: 60,
                        padding: "10px 8px",
                        borderRadius: "var(--radius-sm)",
                        border: `2px solid ${sel ? "var(--primary)" : "var(--line)"}`,
                        background: sel ? "var(--primary)" : "var(--surface)",
                        color: sel ? "var(--primary-ink)" : "var(--ink)",
                        cursor: "pointer",
                        transition: "all .15s",
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7, textTransform: "capitalize" }}>
                        {pick(slot.dayLabel, locale)}
                      </span>
                      <span className="mono" style={{ fontSize: 20, fontWeight: 700 }}>
                        {pick(slot.dayName, locale)}
                      </span>
                      <span style={{ fontSize: 11, opacity: 0.7 }}>
                        {pick(slot.month, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time picker */}
            {selectedDay && currentSlot && (
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)", marginBottom: 12 }}>
                  {t("picktime")}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {currentSlot.times.map((time) => {
                    const sel = selectedTime === time;
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        aria-pressed={sel}
                        style={{
                          padding: "9px 16px",
                          borderRadius: 999,
                          border: `2px solid ${sel ? "var(--primary)" : "var(--line)"}`,
                          background: sel ? "var(--primary)" : "var(--surface)",
                          color: sel ? "var(--primary-ink)" : "var(--ink)",
                          fontSize: 14,
                          fontWeight: sel ? 600 : 400,
                          cursor: "pointer",
                          transition: "all .15s",
                        }}
                        className="mono"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Note */}
            <TextareaField
              label={t("note")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={locale === "nb" ? "Gi oss gjerne litt kontekst…" : "Feel free to give us some context…"}
              rows={3}
            />
          </div>

          {/* Right summary */}
          <div style={{ position: "sticky", top: 88 }}>
            <Card accent>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{t("summary")}</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                <SummaryRow
                  icon="briefcase"
                  label={t("type")}
                  value={meetingType ? t(meetingType as any) : t("no_type")}
                  muted={!meetingType}
                />
                <SummaryRow
                  icon="calendar"
                  label={t("pickday")}
                  value={
                    selectedDay && currentSlot
                      ? `${pick(currentSlot.dayName, locale)} ${pick(currentSlot.month, locale)}`
                      : t("no_day")
                  }
                  muted={!selectedDay}
                />
                <SummaryRow
                  icon="clock"
                  label={t("picktime")}
                  value={selectedTime || t("no_time")}
                  muted={!selectedTime}
                />
                <SummaryRow
                  icon="people"
                  label={t("with")}
                  value={ADVISOR.name}
                  muted={false}
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                full
                disabled={!canConfirm}
                loading={loading}
                onClick={handleConfirm}
              >
                {t("confirm")}
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .meeting-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  muted,
}: {
  icon: string;
  label: string;
  value: string;
  muted: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Icon name={icon} size={16} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{label}</div>
        <div
          style={{ fontSize: 14, fontWeight: muted ? 400 : 600, color: muted ? "var(--ink-3)" : "var(--ink)" }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

function BookingSuccess({
  locale,
  t,
  meetingType,
  day,
  time,
}: {
  locale: string;
  t: any;
  meetingType: MeetingType;
  day: string;
  time: string;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }} className="fade-up">
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "var(--good-soft)",
            color: "var(--good)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 24px",
          }}
        >
          <Icon name="checkCircle" size={36} />
        </div>
        <h1
          className="serif"
          style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 12, color: "var(--ink)" }}
        >
          {t("booked_t")}
        </h1>
        <p style={{ fontSize: 16, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 32 }}>
          {t("booked_d")}
        </p>
        <Card style={{ marginBottom: 28 }}>
          <SummaryRow icon="briefcase" label={t("type")} value={t(meetingType as any)} muted={false} />
          <div style={{ height: 12 }} />
          <SummaryRow icon="calendar" label={t("pickday")} value={day} muted={false} />
          <div style={{ height: 12 }} />
          <SummaryRow icon="clock" label={t("picktime")} value={time} muted={false} />
          <div style={{ height: 12 }} />
          <SummaryRow icon="people" label={t("with")} value={ADVISOR.name} muted={false} />
        </Card>
        <Link href={`/${locale}/dashboard`} style={{ textDecoration: "none" }}>
          <Button variant="primary" size="lg">
            {t("goto")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
