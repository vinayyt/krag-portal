"use client";

import React, { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { pick, fmtNOK } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { ProgressBar } from "@/components/ui/progress";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import {
  RENO_PM,
  RENO_SERVICES,
  RENO_INTAKE_QUESTIONS,
  RENO_ESTIMATE_BASE,
} from "@/lib/data";
import type { IntakeQuestion } from "@/types";

export function RenoIntakePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <RenoIntakeContent />
    </Suspense>
  );
}

// ─── booking day helper ────────────────────────────────────────────────────────
function buildRenoDays(locale: string, n = 8) {
  const days = [];
  const lang = locale === "en" ? "en-GB" : "nb-NO";
  let d = new Date(2026, 5, 15);
  while (days.length < n) {
    d = new Date(d.getTime() + 86400000);
    const wd = d.getDay();
    if (wd === 0 || wd === 6) continue;
    days.push({
      key: d.toISOString().slice(0, 10),
      wd: new Intl.DateTimeFormat(lang, { weekday: "short" }).format(d),
      day: d.getDate(),
      mon: new Intl.DateTimeFormat(lang, { month: "short" }).format(d),
    });
  }
  return days;
}

type Phase = "intake" | "estimate" | "done";

function RenoIntakeContent() {
  const locale = useLocale();
  const router = useRouter();

  const [step, setStep] = useState(0); // 0=services, 1..N=questions, N+1=photos
  const [services, setServices] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [phase, setPhase] = useState<Phase>("intake");

  const qs = RENO_INTAKE_QUESTIONS;
  const totalSteps = 2 + qs.length; // services + questions + photos
  const stepIndex = step + 1;

  const toggleService = (id: string) =>
    setServices((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const setAnswer = (qid: string, v: string, multi?: boolean) =>
    setAnswers((a) => {
      if (!multi) return { ...a, [qid]: v };
      const arr = Array.isArray(a[qid]) ? (a[qid] as string[]).slice() : [];
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(v);
      return { ...a, [qid]: arr };
    });

  const isSel = (qid: string, v: string, multi?: boolean) =>
    multi
      ? Array.isArray(answers[qid]) && (answers[qid] as string[]).includes(v)
      : answers[qid] === v;

  // estimate range
  const ambition = (answers.ambition as string) ||
    (services.includes("total") ? "total" : services.length > 2 ? "total" : "upgrade");
  const range = RENO_ESTIMATE_BASE[ambition] ?? RENO_ESTIMATE_BASE.upgrade;

  // booking
  const [bType, setBType] = useState("home");
  const [bDay, setBDay] = useState<{ key: string; wd: string; day: number; mon: string } | null>(null);
  const [bTime, setBTime] = useState<string | null>(null);
  const days = useMemo(() => buildRenoDays(locale), [locale]);
  const bTimes = ["08:00", "09:00", "10:00", "11:30", "13:00", "14:30", "15:30"];
  const bTypes = [
    { id: "home", icon: "home", label: locale === "en" ? "At your home" : "Hjemme hos deg" },
    { id: "digital", icon: "video", label: locale === "en" ? "Online" : "Digitalt" },
    { id: "phone", icon: "phone", label: locale === "en" ? "Phone" : "Telefon" },
  ];

  /* ── DONE ─────────────────────────────────────────────────────────── */
  if (phase === "done") {
    const bTypeLabel = bTypes.find((x) => x.id === bType)?.label ?? "";
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
        <RenoIntakeHeader locale={locale} />
        <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 24 }}>
          <div className="fade-up" style={{ textAlign: "center", maxWidth: 460 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--good-soft)", color: "var(--good)", display: "grid", placeItems: "center", margin: "0 auto 24px" }}>
              <Icon name="check" size={40} />
            </div>
            <h1 className="serif" style={{ fontSize: 32, margin: "0 0 10px", letterSpacing: "-0.02em", fontWeight: 500 }}>
              {locale === "en" ? "Inspection booked!" : "Befaring booket!"}
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", margin: "0 0 22px", lineHeight: 1.55 }}>
              {locale === "en"
                ? "We look forward to seeing your project. You'll get a confirmation by email and SMS, and can follow everything on your page."
                : "Vi gleder oss til å se prosjektet ditt. Du får en bekreftelse på e-post og SMS, og kan følge alt videre på din side."}
            </p>
            <Card style={{ textAlign: "left", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <Avatar initials={RENO_PM.initials} size={46} tone="accent" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{RENO_PM.name}</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{bTypeLabel}</div>
                </div>
                {bDay && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{bDay.wd} {bDay.day}. {bDay.mon}</div>
                    <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{bTime}</div>
                  </div>
                )}
              </div>
            </Card>
            <Link href={`/${locale}/reno`} style={{ textDecoration: "none" }}>
              <Button variant="primary" size="lg" iconRight="arrowR">
                {locale === "en" ? "Go to my page" : "Gå til min side"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── ESTIMATE + BOOKING ───────────────────────────────────────────── */
  if (phase === "estimate") {
    const canConfirm = bDay && bTime;
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <RenoIntakeHeader
          locale={locale}
          onBack={() => setPhase("intake")}
          backLabel={locale === "en" ? "Back" : "Tilbake"}
        />
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "10px 28px 80px" }}>
          <div className="fade-up" style={{ marginBottom: 22 }}>
            <Tag tone="accent" icon="sparkle" style={{ marginBottom: 12 }}>
              {locale === "en" ? "Your project" : "Ditt prosjekt"}
            </Tag>
            <h1 className="serif" style={{ fontSize: "clamp(28px,4vw,40px)", margin: "14px 0 8px", letterSpacing: "-0.02em", fontWeight: 500 }}>
              {locale === "en" ? "A solid starting point" : "Et godt utgangspunkt"}
            </h1>
            <p style={{ fontSize: 16, color: "var(--ink-2)", margin: 0, maxWidth: 560 }}>
              {locale === "en"
                ? "Here's a preliminary estimate based on what you told us. We'll set the final price together after a free inspection."
                : "Her er et foreløpig anslag basert på det du har fortalt. Endelig pris setter vi sammen etter en gratis befaring."}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start", marginBottom: 16 }} className="pd-grid">
            {/* Estimate card */}
            <Card accent>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>
                {locale === "en" ? "Preliminary estimate" : "Foreløpig prisanslag"}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                {fmtNOK(range[0], false)}–{fmtNOK(range[1])}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0 6px" }}>
                {services.map((id) => {
                  const s = RENO_SERVICES.find((x) => x.id === id);
                  if (!s) return null;
                  return (
                    <Tag key={id} icon={s.icon} size="sm">
                      {pick(s.label, locale)}
                    </Tag>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                <Icon name="shield" size={18} style={{ color: "var(--good)", flexShrink: 0, marginTop: 1 }} />
                <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                  {locale === "en"
                    ? "An estimate, not a quote. In older homes we always allow for what may hide behind the walls — any findings are handled openly as change orders along the way."
                    : "Et anslag, ikke et tilbud. I eldre hus tar vi alltid høyde for det som kan skjule seg bak veggene — eventuelle funn håndteres åpent som avvik underveis."}
                </div>
              </div>
            </Card>

            {/* How we work */}
            <Card>
              <CardHeader
                title={locale === "en" ? "How we work" : "Slik jobber vi"}
                icon="tools"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { icon: "pin", t: locale === "en" ? "Free inspection" : "Gratis befaring", d: locale === "en" ? "We look at the home and listen to your wishes." : "Vi ser på boligen og lytter til ønskene dine." },
                  { icon: "doc", t: locale === "en" ? "Fixed quote" : "Fast tilbud", d: locale === "en" ? "Clear price and schedule before we start." : "Tydelig pris og fremdriftsplan før vi starter." },
                  { icon: "alert", t: locale === "en" ? "Open change orders" : "Åpne endringer", d: locale === "en" ? "You approve unforeseen findings digitally — no surprises." : "Uforutsette funn godkjenner du digitalt — ingen overraskelser." },
                  { icon: "key", t: locale === "en" ? "Handover" : "Overtakelse", d: locale === "en" ? "Full documentation and warranty on the work." : "Full dokumentasjon og garanti på arbeidet." },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--surface-2)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon name={r.icon} size={17} />
                    </span>
                    <div>
                      <div style={{ fontSize: 14.5, fontWeight: 600 }}>{r.t}</div>
                      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 1, lineHeight: 1.45 }}>{r.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking */}
          <Card>
            <CardHeader
              title={locale === "en" ? "Book a free inspection" : "Book en gratis befaring"}
              icon="calendar"
              sub={locale === "en" ? "No obligation — pick what suits you." : "Uforpliktende — velg det som passer deg."}
            />
            {/* Type selector */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
              {bTypes.map((ty) => {
                const active = bType === ty.id;
                return (
                  <button
                    key={ty.id}
                    onClick={() => setBType(ty.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 8px", borderRadius: 14, transition: "all .15s",
                      background: active ? "var(--accent-soft)" : "var(--surface-2)",
                      boxShadow: active ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1px var(--line)",
                    }}
                  >
                    <Icon name={ty.icon} size={22} style={{ color: active ? "var(--accent)" : "var(--ink-2)" }} />
                    <span style={{ fontSize: 13, fontWeight: 600, textAlign: "center" }}>{ty.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Day picker */}
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 9 }}>
              {locale === "en" ? "Pick a day" : "Velg dag"}
            </div>
            <div style={{ display: "flex", gap: 9, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
              {days.map((d) => {
                const active = bDay?.key === d.key;
                return (
                  <button
                    key={d.key}
                    onClick={() => setBDay(d)}
                    style={{
                      flexShrink: 0, width: 64, padding: "12px 0", borderRadius: 12, textAlign: "center", transition: "all .15s",
                      background: active ? "var(--primary)" : "var(--surface-2)",
                      color: active ? "var(--primary-ink)" : "var(--ink)",
                      boxShadow: active ? "none" : "inset 0 0 0 1px var(--line)",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: .75, textTransform: "capitalize" }}>{d.wd}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, margin: "2px 0" }}>{d.day}</div>
                    <div style={{ fontSize: 11, opacity: .75, textTransform: "capitalize" }}>{d.mon}</div>
                  </button>
                );
              })}
            </div>

            {/* Time picker */}
            {bDay && (
              <div className="fade-up">
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-2)", marginBottom: 9 }}>
                  {locale === "en" ? "Pick a time" : "Velg tid"}
                </div>
                <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                  {bTimes.map((tm) => {
                    const active = bTime === tm;
                    return (
                      <button
                        key={tm}
                        onClick={() => setBTime(tm)}
                        style={{
                          padding: "10px 18px", borderRadius: 999, fontSize: 14.5, fontWeight: 600, transition: "all .15s",
                          background: active ? "var(--primary)" : "var(--surface-2)",
                          color: active ? "var(--primary-ink)" : "var(--ink)",
                          boxShadow: active ? "none" : "inset 0 0 0 1px var(--line)",
                        }}
                      >
                        {tm}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="primary"
                size="lg"
                disabled={!canConfirm}
                icon="check"
                onClick={() => setPhase("done")}
              >
                {locale === "en" ? "Confirm inspection" : "Bekreft befaring"}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  /* ── INTAKE STEPPER ───────────────────────────────────────────────── */
  const isServices = step === 0;
  const isPhotos = step === qs.length + 1;
  const q: IntakeQuestion | null = !isServices && !isPhotos ? qs[step - 1] : null;
  const stepAnswered = isServices ? services.length > 0 : true;

  const next = () => {
    if (step < totalSteps - 1) { setStep(step + 1); window.scrollTo({ top: 0 }); }
    else { setPhase("estimate"); window.scrollTo({ top: 0 }); }
  };
  const back = () => {
    if (step === 0) router.push(`/${locale}`);
    else setStep(step - 1);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <RenoIntakeHeader
        locale={locale}
        onBack={back}
        backLabel={step === 0 ? (locale === "en" ? "Home" : "Forsiden") : (locale === "en" ? "Back" : "Tilbake")}
      />
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "10px 28px 80px" }}>
        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "var(--ink-3)", marginBottom: 8, fontWeight: 500 }}>
            <span>{locale === "en" ? "About the project" : "Om prosjektet"}</span>
            <span className="mono">{stepIndex} {locale === "en" ? "of" : "av"} {totalSteps}</span>
          </div>
          <ProgressBar value={(stepIndex / totalSteps) * 100} height={6} />
        </div>

        <div className="fade-up" key={step}>
          {/* Step icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
            <span style={{ width: 50, height: 50, borderRadius: 14, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
              <Icon name={isServices ? "tools" : isPhotos ? "camera" : (q?.icon ?? "star")} size={24} />
            </span>
          </div>

          <h1 className="serif" style={{ fontSize: 28, margin: "14px 0 6px", letterSpacing: "-0.02em", fontWeight: 500 }}>
            {isServices
              ? (locale === "en" ? "What do you want to do?" : "Hva vil du gjøre?")
              : isPhotos
              ? (locale === "en" ? "Photos of the current state" : "Bilder av dagens tilstand")
              : pick(q!.q, locale)}
          </h1>
          <p style={{ fontSize: 15, color: "var(--ink-2)", margin: "0 0 24px" }}>
            {isServices
              ? (locale === "en" ? "Pick one or more. You can change this later." : "Velg én eller flere. Du kan endre dette senere.")
              : isPhotos
              ? (locale === "en" ? "Optional, but helpful." : "Valgfritt, men nyttig.")
              : pick(q!.help, locale)}
          </p>

          {/* Content */}
          {isServices && (
            <ServicesGrid services={services} onToggle={toggleService} locale={locale} />
          )}
          {!isServices && !isPhotos && q && (
            <QuestionGrid q={q} answers={answers} onAnswer={setAnswer} isSel={isSel} locale={locale} />
          )}
          {isPhotos && <PhotosBlock locale={locale} />}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <Button variant="ghost" onClick={back}>
            {step === 0 ? (locale === "en" ? "Cancel" : "Avbryt") : (locale === "en" ? "Back" : "Tilbake")}
          </Button>
          <div style={{ display: "flex", gap: 10 }}>
            {(isPhotos || (q && !q.multi)) && (
              <Button variant="soft" onClick={next}>
                {locale === "en" ? "Skip" : "Hopp over"}
              </Button>
            )}
            <Button variant="primary" iconRight="arrowR" disabled={!stepAnswered} onClick={next}>
              {step === totalSteps - 1
                ? (locale === "en" ? "See estimate" : "Se anslag")
                : (locale === "en" ? "Next" : "Neste")}
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .pd-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────────── */

function RenoIntakeHeader({
  locale,
  onBack,
  backLabel,
}: {
  locale: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <header style={{
      maxWidth: 1100, width: "100%", margin: "0 auto",
      padding: "20px 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Logo size="sm" />
        {onBack && backLabel && (
          <Button variant="ghost" size="sm" icon="chevL" onClick={onBack}>
            {backLabel}
          </Button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {(["nb", "en"] as const).map((l) => (
          <Link
            key={l}
            href={`/${l}/renovering`}
            style={{
              display: "inline-flex", alignItems: "center", padding: "5px 11px",
              borderRadius: 999, fontSize: 13, fontWeight: 600,
              background: locale === l ? "var(--surface-3)" : "transparent",
              color: locale === l ? "var(--ink)" : "var(--ink-3)",
              textDecoration: "none",
            }}
          >
            {l === "nb" ? "NO" : "EN"}
          </Link>
        ))}
      </div>
    </header>
  );
}

function ServicesGrid({
  services, onToggle, locale,
}: {
  services: string[]; onToggle: (id: string) => void; locale: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }} className="q-opts">
      {RENO_SERVICES.map((s) => {
        const active = services.includes(s.id);
        return (
          <button
            key={s.id}
            onClick={() => onToggle(s.id)}
            style={{
              textAlign: "left", padding: 18, borderRadius: 16, transition: "all .15s",
              background: active ? "var(--accent-soft)" : "var(--surface)",
              boxShadow: active ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1.5px var(--line)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, display: "grid", placeItems: "center", background: active ? "var(--accent)" : "var(--surface-2)", color: active ? "#fff" : "var(--accent)" }}>
                <Icon name={s.icon} size={22} />
              </span>
              {active && (
                <span style={{ width: 22, height: 22, borderRadius: 999, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center" }}>
                  <Icon name="check" size={14} />
                </span>
              )}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{pick(s.label, locale)}</div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{pick(s.sub, locale)}</div>
          </button>
        );
      })}
    </div>
  );
}

function QuestionGrid({
  q, answers, onAnswer, isSel, locale,
}: {
  q: IntakeQuestion;
  answers: Record<string, string | string[]>;
  onAnswer: (qid: string, v: string, multi?: boolean) => void;
  isSel: (qid: string, v: string, multi?: boolean) => boolean;
  locale: string;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {q.options.map((o) => {
        const selected = isSel(q.id, o.id, q.multi);
        return (
          <button
            key={o.id}
            onClick={() => onAnswer(q.id, o.id, q.multi)}
            style={{
              textAlign: "left", padding: "18px 20px", borderRadius: 14, transition: "all .15s",
              background: selected ? "var(--accent-soft)" : "var(--surface)",
              boxShadow: selected ? "inset 0 0 0 2px var(--accent)" : "inset 0 0 0 1.5px var(--line)",
              display: "flex", alignItems: "flex-start", gap: 12,
            }}
          >
            <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, marginTop: 1, display: "grid", placeItems: "center", background: selected ? "var(--accent)" : "var(--surface-2)", boxShadow: selected ? "none" : "inset 0 0 0 1.5px var(--line)" }}>
              {selected && <Icon name="check" size={13} />}
            </span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{pick(o.label, locale)}</div>
              {o.sub && <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{pick(o.sub, locale)}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PhotosBlock({ locale }: { locale: string }) {
  const labels =
    locale === "en"
      ? ["Façade", "Room 1", "Room 2", "+ Add"]
      : ["Fasade", "Rom 1", "Rom 2", "+ Legg til"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {labels.map((l, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "4/3", borderRadius: 14, border: "1.5px dashed var(--line)",
              background: "var(--surface-2)", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8, color: "var(--ink-3)", cursor: "pointer",
            }}
          >
            <Icon name="camera" size={24} />
            <span className="mono" style={{ fontSize: 10.5, letterSpacing: ".06em", textTransform: "uppercase" }}>{l}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 12, display: "flex", alignItems: "center", gap: 7 }}>
        <Icon name="camera" size={15} />
        {locale === "en"
          ? "Optional — photos help us prepare for the inspection."
          : "Valgfritt — bilder hjelper oss å forberede befaringen."}
      </div>
    </div>
  );
}
