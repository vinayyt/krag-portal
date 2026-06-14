"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { pick, fmtNOK } from "@/lib/format";
import { Card, CardHeader } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import { ImageBox } from "@/components/ui/image-box";
import { Money } from "@/components/ui/money";
import { RecordButton } from "@/components/ui/record-button";
import {
  RENO_PM, RENO_PROJECT, RENO_BUYER, RENO_PHASES, RENO_AVVIK, RENO_ROOMS,
  RENO_MATERIAL_GROUPS, RENO_BUDGET, RENO_PAYMENTS, RENO_DOCUMENTS,
  RENO_PHOTO_ALBUMS, RENO_MESSAGES, RENO_MEETINGS_DATA, RENO_INSPECTIONS,
  RENO_ON_SITE_TODAY, RENO_ACTIVITY_TODAY,
} from "@/lib/data";
import type { Avvik, AvvikStatus } from "@/types";
import type { RenoTab } from "./reno-dashboard-shell";

// ─── TabHead helper ────────────────────────────────────────────────────────────
function TabHead({
  title, sub, action,
}: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: "var(--ink)" }}>{title}</h2>
        {sub && <p style={{ fontSize: 14, color: "var(--ink-2)", margin: "4px 0 0", lineHeight: 1.5 }}>{sub}</p>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

// ─── On-site banner ────────────────────────────────────────────────────────────
export function OnSiteBanner({ onHide }: { onHide: () => void }) {
  const locale = useLocale();
  const o = RENO_ON_SITE_TODAY;
  return (
    <Card style={{ borderTop: "3px solid var(--accent)", display: "flex", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, minWidth: 0 }}>
        <span style={{ width: 46, height: 46, borderRadius: 12, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
          <Icon name="truck" size={24} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
              {locale === "en" ? "We're at your home today" : "Vi er hos deg i dag"}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "var(--good)" }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--good)", boxShadow: "0 0 0 3px var(--good-soft)" }} />
              {locale === "en" ? "On site" : "På plass"}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3, whiteSpace: "nowrap" }}>
            {pick(o.crew, locale)} · {o.hours}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 240 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{pick(o.note, locale)}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          <Tag tone="warn" size="sm" icon="droplet">{pick(o.waterOff, locale)}</Tag>
          <Tag size="sm" icon="key">{pick(o.access, locale)}</Tag>
        </div>
      </div>
      <button onClick={onHide} style={{ flexShrink: 0, fontSize: 12.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="x" size={14} />
        {locale === "en" ? "Hide" : "Skjul"}
      </button>
    </Card>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — Overview
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoOverview({ onNav }: { onNav: (tab: RenoTab) => void }) {
  const locale = useLocale();
  const [showBanner, setShowBanner] = useState(true);
  const b = RENO_BUDGET;
  const paidPct = Math.round((b.paid / (b.contract + b.materials + b.changes)) * 100);
  const pending = RENO_AVVIK.filter((a) => a.status === "pending");
  const pendingSum = pending.reduce((s, a) => s + a.cost, 0);
  const nextPay = RENO_PAYMENTS.find((p) => p.status === "upcoming");
  const total = b.contract + b.materials + b.changes;

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {showBanner ? (
        <OnSiteBanner onHide={() => setShowBanner(false)} />
      ) : (
        <button
          onClick={() => setShowBanner(true)}
          style={{ fontSize: 13, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}
        >
          <Icon name="truck" size={15} />
          {locale === "en" ? "Show daily overview" : "Vis dagsoversikt"}
        </button>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }} className="ov-top">
        {/* Progress */}
        <Card>
          <CardHeader title={locale === "en" ? "Progress" : "Fremdrift"} icon="activity" />
          <div style={{ fontSize: 44, fontWeight: 700, color: "var(--hero-num)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {RENO_PROJECT.progress}%
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-2)", margin: "8px 0 12px" }}>
            {locale === "en" ? "Extension weather-tight — services underway" : "Tilbygget er tett — teknisk pågår"}
          </div>
          <ProgressBar value={RENO_PROJECT.progress} height={8} />
          <button
            onClick={() => onNav("fremdrift")}
            style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "10px 12px", borderRadius: 10, background: "var(--surface-2)", width: "100%", textAlign: "left" }}
          >
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface)", display: "grid", placeItems: "center", color: "var(--accent)", boxShadow: "inset 0 0 0 1px var(--line)" }}>
              <Icon name="droplet" size={16} />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-3)" }}>{locale === "en" ? "Next phase" : "Neste fase"}</span>
              <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>{locale === "en" ? "Membrane & tiling" : "Membran & flis"}</span>
            </span>
            <Icon name="arrowR" size={16} style={{ color: "var(--ink-3)" }} />
          </button>
        </Card>

        {/* Budget */}
        <Card>
          <CardHeader title={locale === "en" ? "Budget status" : "Budsjettstatus"} icon="wallet" />
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, whiteSpace: "nowrap" }}>
            {fmtNOK(total)}
          </div>
          <div style={{ fontSize: 13, color: "var(--ink-3)", margin: "6px 0 14px" }}>
            {locale === "en" ? "Contract + options + changes" : "Kontrakt + tilvalg + endringer"}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 6 }}>
            <span style={{ color: "var(--good)", fontWeight: 600 }}>{locale === "en" ? "Paid" : "Innbetalt"} {fmtNOK(b.paid)}</span>
            <span style={{ color: "var(--ink-3)" }}>{paidPct}%</span>
          </div>
          <ProgressBar value={paidPct} height={8} color="var(--good)" />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line-2)" }}>
            <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{locale === "en" ? "Next payment" : "Neste betaling"}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{nextPay ? fmtNOK(nextPay.amount, false) + " kr" : "—"}</span>
          </div>
        </Card>

        {/* Avvik — the star */}
        <Card accent style={{ cursor: "pointer" }} onClick={() => onNav("avvik")}>
          <CardHeader
            title={locale === "en" ? "Changes" : "Avvik & endringer"}
            icon="alert"
            action={pending.length > 0 ? <Tag tone="warn" size="sm">{pending.length} {locale === "en" ? "pending" : "venter"}</Tag> : undefined}
          />
          {pending.length > 0 ? (
            <>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginBottom: 12, lineHeight: 1.45 }}>
                {locale === "en" ? "We've found something that needs your decision." : "Vi har funnet noe som trenger din avgjørelse."}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {pending.slice(0, 2).map((a) => (
                  <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 99, background: "var(--warn)", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pick(a.title, locale)}</span>
                    <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink-2)" }}>+{fmtNOK(a.cost, false)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {locale === "en" ? "All changes handled." : "Alle avvik er behandlet."}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line-2)" }}>
            <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{locale === "en" ? "Reassurance:" : "Ingen endring utføres"}</span>
            <Icon name="arrowR" size={16} style={{ color: "var(--accent)" }} />
          </div>
        </Card>

        {/* Rooms summary */}
        <Card>
          <CardHeader title={locale === "en" ? "Rooms & scope" : "Rom & omfang"} icon="layers" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RENO_ROOMS.slice(0, 3).map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, flexShrink: 0, background: r.status === "done" ? "var(--good)" : r.status === "active" ? "var(--accent)" : "var(--line)" }} />
                <span style={{ flex: 1, fontSize: 13.5 }}>{pick(r.name, locale)}</span>
                {r.status !== "upcoming" && <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>{r.pct}%</span>}
              </div>
            ))}
          </div>
          <button
            onClick={() => onNav("rom")}
            style={{ marginTop: 14, fontSize: 13.5, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}
          >
            {locale === "en" ? "See all" : "Se alle"} <Icon name="arrowR" size={14} />
          </button>
        </Card>
      </div>

      {/* Activity today */}
      <Card>
        <CardHeader title={locale === "en" ? "Activity today" : "Aktivitet i dag"} icon="clock" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {RENO_ACTIVITY_TODAY.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-3)", flexShrink: 0, width: 44 }}>{a.time}</span>
              <span style={{ fontSize: 14, color: "var(--ink-2)" }}>{pick(a.text, locale)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — Progress
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoProgress() {
  const locale = useLocale();
  const phases = RENO_PHASES;
  const overall = RENO_PROJECT.progress;
  const done = phases.filter((p) => p.status === "done").length;

  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Progress" : "Fremdrift"}
        sub={locale === "en" ? "Follow the renovation from inspection to finished keys." : "Følg renoveringen fra befaring til ferdige nøkler."}
      />
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ width: 104, height: 104, position: "relative", flexShrink: 0 }}>
            <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--surface-3)" strokeWidth="10" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent)" strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 44 * overall / 100} ${2 * Math.PI * 44 * (1 - overall / 100)}`}
                strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <span className="mono" style={{ fontSize: 22, fontWeight: 700 }}>{overall}%</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {locale === "en" ? "Extension weather-tight — services underway" : "Tilbygget er tett — teknisk pågår"}
            </div>
            <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 4 }}>
              {locale === "en" ? "You're on track for handover in" : "Du er godt i rute mot overtakelse i"}{" "}
              <strong>{pick(RENO_PROJECT.handover, locale)}</strong>.
            </div>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{done}/{phases.length}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{locale === "en" ? "Phases done" : "Faser fullført"}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)" }}>{pick(RENO_PROJECT.start, locale).split(" ")[0]}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{locale === "en" ? "Started" : "Oppstart"}</div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title={locale === "en" ? "Renovation phases" : "Renoveringsfaser"} icon="activity" />
        <div style={{ position: "relative" }}>
          {phases.map((ph, i) => {
            const last = i === phases.length - 1;
            const color = ph.status === "done" ? "var(--good)" : ph.status === "active" ? "var(--accent)" : "var(--ink-3)";
            return (
              <div key={ph.id} style={{ display: "flex", gap: 16, paddingBottom: last ? 0 : 22 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{
                    width: 32, height: 32, borderRadius: 999, display: "grid", placeItems: "center", flexShrink: 0,
                    background: ph.status === "upcoming" ? "var(--surface-2)" : color,
                    color: ph.status === "upcoming" ? "var(--ink-3)" : "#fff",
                    boxShadow: ph.status === "active" ? "0 0 0 4px var(--accent-soft)" : "none",
                  }}>
                    {ph.status === "done" ? <Icon name="check" size={17} /> : ph.status === "active" ? <Icon name="tools" size={16} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                  </span>
                  {!last && <span style={{ flex: 1, width: 2, background: ph.status === "done" ? "var(--good)" : "var(--line)", marginTop: 4, minHeight: 26 }} />}
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 15.5, fontWeight: 600 }}>{pick(ph.name, locale)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{pick(ph.date, locale)}</span>
                      {ph.status === "done" && <Tag tone="good" size="sm">{locale === "en" ? "Done" : "Fullført"}</Tag>}
                      {ph.status === "active" && <Tag tone="accent" size="sm">{ph.pct}% {locale === "en" ? "complete" : "fullført"}</Tag>}
                      {ph.status === "upcoming" && <Tag size="sm">{locale === "en" ? "Upcoming" : "Kommer"}</Tag>}
                    </div>
                  </div>
                  {ph.status === "active" && <ProgressBar value={ph.pct} height={6} style={{ marginTop: 10 }} />}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — Rooms & scope
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoRooms() {
  const locale = useLocale();
  const statusTag = (status: string) =>
    status === "active" ? <Tag tone="accent" size="sm">{locale === "en" ? "In progress" : "Pågår"}</Tag>
    : status === "done" ? <Tag tone="good" size="sm" icon="check">{locale === "en" ? "Done" : "Ferdig"}</Tag>
    : <Tag size="sm">{locale === "en" ? "Planned" : "Planlagt"}</Tag>;

  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Rooms & scope" : "Rom & omfang"}
        sub={locale === "en" ? "What's being done in each space, with chosen materials and progress." : "Hva som gjøres i hvert rom, med valgte materialer og fremdrift."}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="rec-grid">
        {RENO_ROOMS.map((r) => (
          <Card key={r.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ position: "relative" }}>
              <ImageBox tone={r.tone as "fjord"} ratio="16/10" icon="home" radius="0" label={pick(r.name, locale)} />
              <div style={{ position: "absolute", top: 12, left: 12 }}>{statusTag(r.status)}</div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{pick(r.name, locale)}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.5, margin: "6px 0 12px" }}>{pick(r.scope, locale)}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: r.status === "upcoming" ? 0 : 14 }}>
                {(locale === "en" ? r.mats.en : r.mats.no).map((m, i) => (
                  <Tag key={i} size="sm" icon="swatch">{m}</Tag>
                ))}
              </div>
              {r.status !== "upcoming" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--ink-3)", marginBottom: 5 }}>
                    <span>{locale === "en" ? "Progress" : "Fremdrift"}</span>
                    <span className="mono">{r.pct}%</span>
                  </div>
                  <ProgressBar value={r.pct} height={6} color={r.status === "done" ? "var(--good)" : "var(--accent)"} />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 — Avvik & endringer (THE STAR)
// ═══════════════════════════════════════════════════════════════════════════════
const AVVIK_ICON: Record<string, string> = {
  rate: "droplet", el: "activity", ror: "droplet", konstruksjon: "layers", miljo: "shield", info: "checkCircle",
};

export function RenoAvvik({ onNav }: { onNav: (tab: RenoTab) => void }) {
  const locale = useLocale();
  const [items, setItems] = useState<Avvik[]>(() => RENO_AVVIK.map((a) => ({ ...a })));
  const [openId, setOpenId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const setStatus = (id: string, status: AvvikStatus) => {
    setItems((xs) => xs.map((a) => a.id === id ? { ...a, status } : a));
    setToast(status === "approved"
      ? (locale === "en" ? "Change approved ✓" : "Endring godkjent ✓")
      : (locale === "en" ? "Change declined" : "Endring avslått"));
    setTimeout(() => setToast(null), 2500);
  };

  const pending = items.filter((a) => a.status === "pending");
  const approved = items.filter((a) => a.status === "approved");
  const approvedSum = approved.reduce((s, a) => s + a.cost, 0);
  const approvedDays = approved.reduce((s, a) => s + a.days, 0);
  const pendingSum = pending.reduce((s, a) => s + a.cost, 0);

  const statusBadge = (a: Avvik) => {
    if (a.status === "approved") return <Tag tone="good" size="sm" icon="check">{locale === "en" ? "Approved" : "Godkjent"}</Tag>;
    if (a.status === "declined") return <Tag size="sm">{locale === "en" ? "Declined" : "Avslått"}</Tag>;
    if (a.status === "info") return <Tag size="sm" icon="checkCircle">{locale === "en" ? "FYI" : "Til info"}</Tag>;
    return <Tag tone="warn" size="sm" icon="clock">{locale === "en" ? "Awaiting reply" : "Venter på svar"}</Tag>;
  };

  const impact = (a: Avvik) => (
    <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{locale === "en" ? "Cost" : "Kostnad"}</div>
        <div className="mono" style={{ fontSize: 15.5, fontWeight: 700, color: a.cost ? "var(--ink)" : "var(--good)" }}>
          {a.cost ? "+" + fmtNOK(a.cost) : (locale === "en" ? "Included" : "Inkludert")}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{locale === "en" ? "Schedule" : "Tidsplan"}</div>
        <div className="mono" style={{ fontSize: 15.5, fontWeight: 700 }}>
          {a.days ? "+" + a.days + " " + (locale === "en" ? "days" : "dager") : (locale === "en" ? "None" : "Ingen")}
        </div>
      </div>
    </div>
  );

  const actions = (a: Avvik) =>
    a.status === "pending" ? (
      <div style={{ display: "flex", gap: 8 }}>
        <Button variant="soft" size="sm" onClick={() => setStatus(a.id, "declined")}>{locale === "en" ? "Decline" : "Avslå"}</Button>
        <Button variant="primary" size="sm" icon="check" onClick={() => setStatus(a.id, "approved")}>{locale === "en" ? "Approve" : "Godkjenn"}</Button>
      </div>
    ) : a.status === "declined" ? (
      <Button variant="ghost" size="sm" onClick={() => setStatus(a.id, "pending")}>{locale === "en" ? "Undo" : "Angre"}</Button>
    ) : null;

  return (
    <div className="fade-up">
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--ink)", color: "#fff", padding: "12px 22px", borderRadius: 999, fontSize: 14.5, fontWeight: 600, zIndex: 999, boxShadow: "var(--shadow-lg)" }}>
          {toast}
        </div>
      )}

      <TabHead
        title={locale === "en" ? "Changes & deviations" : "Avvik & endringer"}
        sub={locale === "en"
          ? "When we open up an older home, the unexpected sometimes appears. Here you see it all openly — and you decide."
          : "Når vi åpner opp et eldre hus, dukker det av og til opp noe uforutsett. Her ser du alt åpent — og bestemmer selv."}
      />

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 18 }} className="g3">
        <Card accent>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Awaiting your decision" : "Venter på din avgjørelse"}</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: "var(--warn)" }}>{pending.length}</span>
            {pendingSum > 0 && <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-2)" }}>+{fmtNOK(pendingSum)}</span>}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Approved changes" : "Godkjente endringer"}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--good)", letterSpacing: "-0.02em" }}>+{fmtNOK(approvedSum)}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>{approved.length} {locale === "en" ? "approved" : "godkjent"}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Added to schedule" : "Lagt til tidsplan"}</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>+{approvedDays} {locale === "en" ? "days" : "dager"}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>
            {locale === "en" ? "Handover still Nov 2026" : "Overtakelse fortsatt nov. 2026"}
          </div>
        </Card>
      </div>

      {/* List (accordion) */}
      <Card style={{ padding: 0 }}>
        {items.map((a, i) => {
          const open = openId === a.id;
          return (
            <div key={a.id} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--line-2)" : "none", opacity: a.status === "declined" ? .62 : 1 }}>
              <button
                onClick={() => setOpenId(open ? null : a.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", width: "100%", textAlign: "left" }}
              >
                <span style={{ width: 42, height: 42, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, background: a.status === "pending" ? "var(--warn-soft)" : "var(--surface-2)", color: a.status === "pending" ? "var(--warn)" : "var(--ink-2)" }}>
                  <Icon name={AVVIK_ICON[a.cat] ?? "alert"} size={20} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{pick(a.title, locale)}</span>
                    {a.urgent && a.status === "pending" && <Tag tone="warn" size="sm" icon="alert">{locale === "en" ? "Urgent" : "Haster"}</Tag>}
                    {a.optional && <Tag size="sm">{locale === "en" ? "Recommended" : "Anbefalt"}</Tag>}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>
                    {pick(a.room, locale)} · {locale === "en" ? "found" : "funnet"} {pick(a.found, locale)}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div className="mono" style={{ fontSize: 14.5, fontWeight: 700, color: a.cost ? "var(--ink)" : "var(--good)" }}>
                    {a.cost ? "+" + fmtNOK(a.cost, false) : (locale === "en" ? "Incl." : "Inkl.")}
                  </div>
                  <div style={{ marginTop: 4 }}>{statusBadge(a)}</div>
                </div>
                <Icon name="chevD" size={18} style={{ color: "var(--ink-3)", flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
              </button>

              {open && (
                <div className="fade-in" style={{ padding: "0 20px 20px 76px", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18, alignItems: "start" }} >
                  <ImageBox tone={a.tone as "fjord"} ratio="4/3" icon="camera" label={locale === "en" ? "On-site finding" : "Funn på stedet"} />
                  <div>
                    <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.55, margin: "0 0 12px" }}>{pick(a.desc, locale)}</p>
                    <div style={{ background: "var(--surface-2)", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 5 }}>
                        {locale === "en" ? "Our proposal" : "Vårt forslag"}
                      </div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{pick(a.solution, locale)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      {impact(a)}
                      {actions(a)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, padding: "14px 16px", background: "var(--surface-2)", borderRadius: 14 }}>
        <Icon name="shield" size={18} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5 }}>
          {locale === "en"
            ? "No change is carried out without your approval. Everything is documented with photos and added to your contract under Norwegian consumer-services law."
            : "Ingen endring utføres uten din godkjenning. Alt dokumenteres med bilder og legges til kontrakten din etter håndverkertjenesteloven."}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5 — Materials & options
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoMaterials() {
  const locale = useLocale();
  const [groups, setGroups] = useState(() => JSON.parse(JSON.stringify(RENO_MATERIAL_GROUPS)));
  const [toast, setToast] = useState<string | null>(null);

  const select = (gi: number, oi: number) =>
    setGroups((gs: typeof groups) =>
      gs.map((g: typeof groups[0], i: number) =>
        i !== gi ? g : { ...g, options: g.options.map((o: typeof g.options[0], j: number) => ({ ...o, selected: j === oi })) }
      )
    );

  const total = groups.reduce((s: number, g: typeof groups[0]) => s + (g.options.find((o: typeof g.options[0]) => o.selected)?.price || 0), 0);

  const handleSave = () => {
    setToast(locale === "en" ? "Choices saved ✓" : "Valg lagret ✓");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="fade-up" style={{ paddingBottom: 70 }}>
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--ink)", color: "#fff", padding: "12px 22px", borderRadius: 999, fontSize: 14.5, fontWeight: 600, zIndex: 999, boxShadow: "var(--shadow-lg)" }}>
          {toast}
        </div>
      )}
      <TabHead
        title={locale === "en" ? "Materials" : "Materialer & tilvalg"}
        sub={locale === "en" ? "Make the home yours. Deadlines are marked per category." : "Sett ditt preg på hjemmet. Frist for valg er markert per kategori."}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {groups.map((g: typeof groups[0], gi: number) => (
          <Card key={g.id}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>{pick(g.name, locale)}</div>
              <Tag tone="warn" size="sm" icon="clock">{locale === "en" ? "Deadline" : "Frist"}: {pick(g.deadline, locale)}</Tag>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="g3">
              {g.options.map((o: typeof g.options[0], oi: number) => {
                const sel = o.selected;
                return (
                  <button
                    key={o.id}
                    onClick={() => select(gi, oi)}
                    style={{
                      textAlign: "left", borderRadius: 14, overflow: "hidden", transition: "all .15s",
                      background: "var(--surface)", boxShadow: sel ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1.5px var(--line)",
                    }}
                  >
                    <ImageBox tone="wood" ratio="16/10" icon="swatch" label={pick(o.name, locale)} />
                    <div style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.25 }}>{pick(o.name, locale)}</span>
                        {sel && <span style={{ width: 20, height: 20, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="check" size={13} /></span>}
                      </div>
                      <div style={{ fontSize: 13, color: o.price === 0 ? "var(--good)" : "var(--ink-2)", fontWeight: 600, marginTop: 6 }}>
                        {o.price === 0 ? (locale === "en" ? "Included" : "Inkludert") : "+ " + fmtNOK(o.price)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
      <div style={{ position: "sticky", bottom: 16, marginTop: 18 }}>
        <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, boxShadow: "var(--shadow-lg)", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{locale === "en" ? "Options total" : "Sum tilvalg"}</div>
            <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>{fmtNOK(total)}</div>
          </div>
          <Button variant="primary" size="lg" icon="check" onClick={handleSave}>{locale === "en" ? "Save choices" : "Lagre valg"}</Button>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 6 — Budget
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoBudget({ onNav }: { onNav: (tab: RenoTab) => void }) {
  const locale = useLocale();
  const b = RENO_BUDGET;
  const total = b.contract + b.materials + b.changes;
  const remaining = total - b.paid;
  const paidPct = Math.round((b.paid / total) * 100);

  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Budget" : "Økonomi"}
        sub={locale === "en" ? "Contract sum, options, approved changes and payment plan." : "Kontraktsum, tilvalg, godkjente endringer og betalingsplan."}
        action={<Button variant="soft" size="sm" icon="download">{locale === "en" ? "Download plan" : "Last ned plan"}</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 16 }} className="g3">
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Total so far" : "Sum så langt"}</div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em" }}>{fmtNOK(total)}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>
            {locale === "en" ? "Contract" : "Kontrakt"} {fmtNOK(b.contract, false)} + {locale === "en" ? "options" : "tilvalg"} {fmtNOK(b.materials, false)} + {locale === "en" ? "changes" : "endringer"} {fmtNOK(b.changes, false)}
          </div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Paid" : "Innbetalt"}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--good)", letterSpacing: "-0.02em" }}>{fmtNOK(b.paid)}</div>
          <ProgressBar value={paidPct} height={6} color="var(--good)" style={{ marginTop: 12 }} />
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 7 }}>{paidPct}% {locale === "en" ? "paid" : "innbetalt"}</div>
        </Card>
        <Card>
          <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>{locale === "en" ? "Remaining" : "Gjenstår"}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>{fmtNOK(remaining)}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>
            {locale === "en" ? "Across 3 instalments" : "Fordeles på 3 innbetalinger"}
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16, alignItems: "start" }} className="bd-grid">
        <Card>
          <CardHeader title={locale === "en" ? "Payment schedule" : "Betalingsplan"} icon="wallet" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            {RENO_PAYMENTS.map((p, i) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: i < RENO_PAYMENTS.length - 1 ? "1px solid var(--line-2)" : "none" }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, display: "grid", placeItems: "center", flexShrink: 0, fontSize: 12, fontWeight: 700, background: p.status === "paid" ? "var(--good-soft)" : "var(--surface-2)", color: p.status === "paid" ? "var(--good)" : "var(--ink-3)" }}>
                  {p.status === "paid" ? <Icon name="check" size={16} /> : p.pct}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600 }}>{pick(p.label, locale)}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{p.status === "paid" ? (locale === "en" ? "Paid" : "Betalt") : (locale === "en" ? "Due" : "Forfaller")} · {pick(p.date, locale)}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mono" style={{ fontSize: 14.5, fontWeight: 600 }}>{fmtNOK(p.amount)}</div>
                  {p.status === "paid" ? <Tag tone="good" size="sm">{locale === "en" ? "Paid" : "Betalt"}</Tag> : <Tag tone="warn" size="sm">{locale === "en" ? "Upcoming" : "Kommende"}</Tag>}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title={locale === "en" ? "Changes & deviations" : "Endringer & avvik"} icon="alert" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {RENO_AVVIK.filter((a) => a.status === "approved").map((a) => (
              <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 13.5 }}>
                <span style={{ color: "var(--ink-2)" }}>{pick(a.title, locale)}</span>
                <span className="mono" style={{ fontWeight: 600, whiteSpace: "nowrap" }}>+{fmtNOK(a.cost, false)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 4, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
              <span>{locale === "en" ? "Approved changes" : "Godkjente endringer"}</span>
              <span className="mono">{fmtNOK(b.changes)}</span>
            </div>
          </div>
          <button
            onClick={() => onNav("avvik")}
            style={{ marginTop: 14, fontSize: 13.5, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}
          >
            {locale === "en" ? "See all changes" : "Se alle avvik"} <Icon name="arrowR" size={15} />
          </button>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 7 — Documents
// ═══════════════════════════════════════════════════════════════════════════════
const DOC_CATS = [
  { id: "all",      label: { no: "Alle",      en: "All" } },
  { id: "contract", label: { no: "Kontrakt",  en: "Contract" } },
  { id: "drawing",  label: { no: "Tegninger", en: "Drawings" } },
  { id: "spec",     label: { no: "Dokumentasjon", en: "Documentation" } },
];

export function RenoDocuments() {
  const locale = useLocale();
  const [cat, setCat] = useState("all");
  const docs = cat === "all" ? RENO_DOCUMENTS : RENO_DOCUMENTS.filter((d) => d.cat === cat);

  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Documents" : "Dokumenter"}
        sub={locale === "en" ? "Contract, reports and completion docs — gathered and signed digitally." : "Kontrakt, rapporter og sluttdokumentasjon — samlet og signert digitalt."}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {DOC_CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            style={{
              padding: "8px 15px", borderRadius: 999, fontSize: 13.5, fontWeight: 600,
              background: cat === c.id ? "var(--primary)" : "var(--surface)",
              color: cat === c.id ? "var(--primary-ink)" : "var(--ink-2)",
              boxShadow: cat === c.id ? "none" : "inset 0 0 0 1px var(--line)",
            }}
          >
            {pick(c.label, locale)}
          </button>
        ))}
      </div>
      <Card style={{ padding: 0 }}>
        {docs.map((d, i) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: i < docs.length - 1 ? "1px solid var(--line-2)" : "none", opacity: d.soon ? .55 : 1 }}>
            <span style={{ width: 42, height: 42, borderRadius: 10, display: "grid", placeItems: "center", flexShrink: 0, background: "var(--surface-2)", color: "var(--ink-2)" }}>
              <Icon name={d.cat === "spec" ? "droplet" : "doc"} size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{pick(d.name, locale)}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{pick(d.date, locale)}{d.size !== "—" ? " · " + d.size : ""}</div>
            </div>
            {d.soon && <Tag size="sm">{locale === "en" ? "Ready at handover" : "Klar ved overtakelse"}</Tag>}
            {d.signed === true && <Tag tone="good" size="sm" icon="check">{locale === "en" ? "Signed" : "Signert"}</Tag>}
            {d.signed === false && <Tag tone="warn" size="sm">{locale === "en" ? "Needs signature" : "Trenger signatur"}</Tag>}
            {!d.soon && (
              d.signed === false
                ? <Button variant="primary" size="sm" icon="signature">{locale === "en" ? "Sign" : "Signer"}</Button>
                : <Button variant="soft" size="sm" icon="download">{locale === "en" ? "Open" : "Åpne"}</Button>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 8 — Photos
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoPhotos() {
  const locale = useLocale();
  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Photo log" : "Bildelogg"}
        sub={locale === "en" ? "Before, during and after — we document the whole way." : "Før, under og etter — vi dokumenterer hele veien."}
      />
      {RENO_PHOTO_ALBUMS.map((al, ai) => (
        <div key={ai} style={{ marginBottom: 26 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{pick(al.phase, locale)}</span>
              <Tag tone={al.tag.no === "Før" ? "neutral" : "accent"} size="sm">{pick(al.tag, locale)}</Tag>
              <Tag size="sm" icon="camera">{al.count}</Tag>
            </div>
            <span style={{ fontSize: 13, color: "var(--ink-3)" }}>{pick(al.date, locale)}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }} className="photo-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <ImageBox key={i} tone={al.tone} ratio="1/1" icon="camera" label={`${pick(al.phase, locale)} ${i + 1}`} style={{ cursor: "pointer" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 9 — Messages
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoMessages() {
  const locale = useLocale();
  const [msgs, setMsgs] = useState(RENO_MESSAGES.map((m) => ({ ...m })));
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { id: `msg-${Date.now()}`, from: "me" as const, text: { no: input, en: input }, time: locale === "en" ? "now" : "nå", date: { no: "I dag", en: "Today" } };
    setMsgs((m) => [...m, newMsg]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, {
        id: `reply-${Date.now()}`,
        from: "advisor" as const,
        text: { no: "Takk for meldingen! Jeg er på byggeplass nå, men svarer så snart jeg kan 🙂", en: "Thanks for your message! I'm on site now but will reply as soon as I can 🙂" },
        time: locale === "en" ? "now" : "nå",
        date: { no: "I dag", en: "Today" },
      }]);
    }, 1400);
  };

  return (
    <div className="fade-up" style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 150px)" }}>
      <Card style={{ padding: 0, flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid var(--line)" }}>
          <Avatar initials={RENO_PM.initials} size={42} tone="accent" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{RENO_PM.name}</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{pick(RENO_PM.role, locale)}</div>
          </div>
          <Button variant="soft" size="sm" icon="phone">{RENO_PM.phone}</Button>
        </div>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 12, background: "var(--surface-2)" }}>
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--ink-3)" }}>
            {locale === "en" ? "5 May" : "5. mai"}
          </div>
          {msgs.map((m, i) => {
            const me = m.from === "me";
            return (
              <div key={i} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", gap: 10 }}>
                {!me && <Avatar initials={RENO_PM.initials} size={30} tone="accent" />}
                <div style={{ maxWidth: "70%" }}>
                  <div
                    className="fade-up"
                    style={{
                      padding: "11px 15px", borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      fontSize: 14, lineHeight: 1.5,
                      background: me ? "var(--primary)" : "var(--surface)",
                      color: me ? "var(--primary-ink)" : "var(--ink)",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    {pick(m.text, locale)}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, textAlign: me ? "right" : "left" }}>{m.time}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 10, padding: "14px 16px", borderTop: "1px solid var(--line)", alignItems: "center" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={locale === "en" ? "Write a message…" : "Skriv en melding…"}
            style={{ flex: 1, border: "1.5px solid var(--line)", borderRadius: 999, padding: "11px 18px", fontSize: 14.5, outline: "none", background: "var(--surface)", color: "var(--ink)" }}
          />
          <button
            onClick={send}
            style={{ width: 44, height: 44, borderRadius: 999, background: "var(--primary)", color: "var(--primary-ink)", display: "grid", placeItems: "center", flexShrink: 0 }}
          >
            <Icon name="send" size={18} />
          </button>
        </div>
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 10 — Meetings & inspections
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoMeetings() {
  const locale = useLocale();
  const m = RENO_MEETINGS_DATA;
  const insp = RENO_INSPECTIONS;

  const MeetRow = ({ it, past, isInsp }: { it: typeof m.upcoming[number] | typeof insp[number]; past?: boolean; isInsp?: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: "1px solid var(--line-2)" }}>
      <div style={{ width: 56, textAlign: "center", flexShrink: 0 }}>
        <div className="mono" style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>
          {pick(it.date, locale).split(" ")[0].replace(".", "")}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "capitalize" }}>
          {pick(it.date, locale).split(" ")[1]}
        </div>
      </div>
      <div style={{ width: 1, alignSelf: "stretch", background: "var(--line)" }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{pick(it.title, locale)}</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 8, marginTop: 3, flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="clock" size={13} />{it.time}
          </span>
          {"type" in it && it.type && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name={"online" in it && it.online ? "video" : "building"} size={13} />
              {pick(it.type, locale)}
            </span>
          )}
          {"with" in it && it.with && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="people" size={13} />{it.with}
            </span>
          )}
          {isInsp && "note" in it && it.note && (
            <span style={{ color: "var(--ink-3)" }}>· {pick(it.note, locale)}</span>
          )}
        </div>
      </div>
      {(past || ("status" in it && it.status === "done"))
        ? <Tag tone="good" size="sm" icon="check">{locale === "en" ? "Completed" : "Gjennomført"}</Tag>
        : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {"online" in it && it.online && <Button variant="primary" size="sm" icon="video">{locale === "en" ? "Join" : "Bli med"}</Button>}
              <Button variant="soft" size="sm">{locale === "en" ? "Reschedule" : "Endre"}</Button>
            </div>
            <RecordButton
              meetingTitle={"title" in it ? pick(it.title, locale) : ""}
              meetingDate={"date" in it ? pick(it.date, locale) : ""}
              projectName={`${RENO_PROJECT.addressShort} – ${locale === "en" ? "Full renovation" : "Totalrenovering"}`}
              pmName={RENO_PM.name}
              pmEmail={RENO_PM.email}
              buyerName={RENO_BUYER.name}
              locale={locale}
            />
          </div>
        )
      }
    </div>
  );

  return (
    <div className="fade-up">
      <TabHead
        title={locale === "en" ? "Meetings & inspections" : "Møter & befaring"}
        sub={locale === "en" ? "Site meetings with your project manager and on-site checks." : "Byggemøter med prosjektleder og kontroller på stedet."}
        action={<Button variant="primary" size="sm" icon="plus">{locale === "en" ? "Book new meeting" : "Book nytt møte"}</Button>}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, alignItems: "start" }} className="bd-grid">
        <Card>
          <CardHeader title={locale === "en" ? "Upcoming meetings" : "Kommende møter"} icon="calendar" />
          {m.upcoming.map((it) => <MeetRow key={it.id} it={it} />)}
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".04em", margin: "16px 0 4px" }}>
            {locale === "en" ? "Past" : "Tidligere"}
          </div>
          {m.past.map((it) => <MeetRow key={it.id} it={it} past />)}
        </Card>
        <Card>
          <CardHeader title={locale === "en" ? "Inspections & checks" : "Befaringer & kontroller"} icon="check" />
          {insp.map((it) => <MeetRow key={it.id} it={it} isInsp />)}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 11 — Settings
// ═══════════════════════════════════════════════════════════════════════════════
export function RenoSettings() {
  const locale = useLocale();
  const rows = [
    { icon: "people", label: locale === "en" ? "Profile & contact" : "Profil og kontaktinfo" },
    { icon: "bell", label: locale === "en" ? "Notifications" : "Varsler" },
    { icon: "key", label: locale === "en" ? "Access & lockbox" : "Adgang og nøkkelboks" },
    { icon: "people", label: locale === "en" ? "Co-owners & access" : "Medeiere og tilganger" },
    { icon: "shield", label: locale === "en" ? "Privacy" : "Personvern" },
  ];
  return (
    <div className="fade-up">
      <TabHead title={locale === "en" ? "Settings" : "Innstillinger"} />
      <Card style={{ padding: 0 }}>
        {rows.map((r, i) => (
          <button
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", width: "100%", textAlign: "left", borderBottom: i < rows.length - 1 ? "1px solid var(--line-2)" : "none" }}
          >
            <span style={{ width: 38, height: 38, borderRadius: 10, display: "grid", placeItems: "center", background: "var(--surface-2)", color: "var(--ink-2)" }}>
              <Icon name={r.icon} size={18} />
            </span>
            <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>{r.label}</span>
            <Icon name="chevR" size={18} style={{ color: "var(--ink-3)" }} />
          </button>
        ))}
      </Card>
    </div>
  );
}
