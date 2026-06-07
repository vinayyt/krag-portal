"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { QUESTIONS } from "@/lib/data";
import { pick } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Segmented } from "@/components/ui/segmented";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import type { QuestionAnswers, QuestionnaireStyle } from "@/types";

// ─── Shared answer toggle logic ───────────────────────────────────────────────

function toggleAnswer(
  answers: QuestionAnswers,
  questionId: string,
  optionId: string,
  multi: boolean,
  max?: number
): QuestionAnswers {
  if (!multi) {
    return { ...answers, [questionId]: optionId };
  }
  const current = (answers[questionId] as string[] | undefined) || [];
  if (current.includes(optionId)) {
    return { ...answers, [questionId]: current.filter((id) => id !== optionId) };
  }
  if (max && current.length >= max) {
    return answers; // at max, don't add
  }
  return { ...answers, [questionId]: [...current, optionId] };
}

function isSelected(answers: QuestionAnswers, questionId: string, optionId: string): boolean {
  const val = answers[questionId];
  if (!val) return false;
  if (Array.isArray(val)) return val.includes(optionId);
  return val === optionId;
}

// ─── Style selector ───────────────────────────────────────────────────────────

export function QuestionnairePage() {
  const locale = useLocale();
  const t = useTranslations("questionnaire");
  const router = useRouter();
  const [style, setStyle] = useState<QuestionnaireStyle>("stepper");
  const [answers, setAnswers] = useState<QuestionAnswers>({});

  const styleOptions = [
    { id: "stepper", label: t("stepper") },
    { id: "chat", label: t("chat") },
    { id: "cards", label: t("cards") },
  ];

  function handleComplete() {
    // In production, POST answers to /api/questionnaire, then redirect
    const params = new URLSearchParams({ answers: JSON.stringify(answers) });
    router.push(`/${locale}/recommendations?${params}`);
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
          gap: 16,
        }}
      >
        <Link href={`/${locale}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, color: "var(--ink-3)", fontSize: 13.5 }}>
          <Icon name="chevL" size={15} />
          Krag
        </Link>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-2)" }}>
          {t("title")}
        </div>
        <Segmented
          options={styleOptions}
          value={style}
          onChange={(v) => setStyle(v as QuestionnaireStyle)}
          size="sm"
          ariaLabel={t("style")}
        />
      </header>

      {/* Style views */}
      {style === "stepper" && (
        <StepperView
          answers={answers}
          onAnswer={(qId, oId, multi, max) =>
            setAnswers((a) => toggleAnswer(a, qId, oId, multi, max))
          }
          onComplete={handleComplete}
          locale={locale}
        />
      )}
      {style === "chat" && (
        <ChatView
          answers={answers}
          onAnswer={(qId, oId, multi, max) =>
            setAnswers((a) => toggleAnswer(a, qId, oId, multi, max))
          }
          onComplete={handleComplete}
          locale={locale}
        />
      )}
      {style === "cards" && (
        <CardsView
          answers={answers}
          onAnswer={(qId, oId, multi, max) =>
            setAnswers((a) => toggleAnswer(a, qId, oId, multi, max))
          }
          onComplete={handleComplete}
          locale={locale}
        />
      )}
    </div>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

interface ViewProps {
  answers: QuestionAnswers;
  onAnswer: (qId: string, oId: string, multi: boolean, max?: number) => void;
  onComplete: () => void;
  locale: string;
}

function StepperView({ answers, onAnswer, onComplete, locale }: ViewProps) {
  const t = useTranslations("questionnaire");
  const [step, setStep] = useState(0);
  const q = QUESTIONS[step];
  const total = QUESTIONS.length;
  const isLast = step === total - 1;
  const hasAnswer = !!answers[q.id] && (!Array.isArray(answers[q.id]) || (answers[q.id] as string[]).length > 0);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 120px" }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 8 }}>
          {step + 1} {t("of")} {total}
        </div>
        <ProgressBar value={((step + 1) / total) * 100} />
      </div>

      {/* Question */}
      <div
        key={q.id}
        className="fade-up"
        style={{ marginBottom: 32 }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "var(--accent-soft)",
            color: "var(--accent)",
            display: "grid",
            placeItems: "center",
            marginBottom: 20,
          }}
        >
          <Icon name={q.icon} size={24} />
        </div>
        <h2
          className="serif"
          style={{
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            marginBottom: 8,
            color: "var(--ink)",
          }}
        >
          {pick(q.q, locale)}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)", margin: 0 }}>{pick(q.help, locale)}</p>
      </div>

      {/* Options grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          marginBottom: 32,
        }}
        role={q.multi ? "group" : "radiogroup"}
        aria-label={pick(q.q, locale)}
      >
        {q.options.map((opt) => {
          const sel = isSelected(answers, q.id, opt.id);
          return (
            <button
              key={opt.id}
              role={q.multi ? "checkbox" : "radio"}
              aria-checked={sel}
              onClick={() => onAnswer(q.id, opt.id, !!q.multi, q.max)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 4,
                padding: "16px",
                borderRadius: "var(--radius-sm)",
                border: `2px solid ${sel ? "var(--accent)" : "var(--line)"}`,
                background: sel ? "var(--accent-soft)" : "var(--surface)",
                cursor: "pointer",
                textAlign: "left",
                transition: "border-color .15s, background .15s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span
                  style={{ fontSize: 15, fontWeight: 600, color: sel ? "var(--accent)" : "var(--ink)" }}
                >
                  {pick(opt.label, locale)}
                </span>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: q.multi ? 4 : "50%",
                    border: `2px solid ${sel ? "var(--accent)" : "var(--line)"}`,
                    background: sel ? "var(--accent)" : "transparent",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    transition: "all .15s",
                  }}
                >
                  {sel && <Icon name="check" size={12} style={{ color: "#fff" }} />}
                </div>
              </div>
              <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{pick(opt.sub, locale)}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, justifyContent: "space-between" }}>
        <Button
          variant="ghost"
          size="md"
          icon="chevL"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {t("back")}
        </Button>
        <div style={{ display: "flex", gap: 8 }}>
          {!hasAnswer && (
            <Button variant="soft" size="md" onClick={() => {
              if (isLast) onComplete();
              else setStep((s) => s + 1);
            }}>
              {t("skip")}
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            iconRight={isLast ? undefined : "chevR"}
            onClick={() => { if (isLast) onComplete(); else setStep((s) => s + 1); }}
          >
            {isLast ? t("see") : t("next")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Chat view ────────────────────────────────────────────────────────────────

function ChatView({ answers, onAnswer, onComplete, locale }: ViewProps) {
  const t = useTranslations("questionnaire");
  const [revealed, setRevealed] = useState(1); // how many questions are revealed

  const currentQ = QUESTIONS[revealed - 1];
  const hasAllAnswers = QUESTIONS.slice(0, revealed).every(
    (q) => answers[q.id] !== undefined
  );

  function handleNext() {
    if (revealed < QUESTIONS.length) setRevealed((r) => r + 1);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px 140px" }}>
      {/* Intro bubble */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 24 }}>
        <Avatar initials="SK" size={36} tone="primary" />
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "18px 18px 18px 4px",
            padding: "12px 16px",
            fontSize: 14.5,
            color: "var(--ink)",
            maxWidth: 360,
          }}
        >
          {t("chat_intro")}
        </div>
      </div>

      {/* Questions */}
      {QUESTIONS.slice(0, revealed).map((q, qi) => {
        const answered = answers[q.id];
        const answeredArr = Array.isArray(answered) ? answered : answered ? [answered] : [];

        return (
          <div key={q.id} className="fade-up" style={{ marginBottom: 20 }}>
            {/* Advisor bubble */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 12 }}>
              <Avatar initials="SK" size={36} tone="primary" />
              <div
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "18px 18px 18px 4px",
                  padding: "12px 16px",
                  fontSize: 14.5,
                  color: "var(--ink)",
                }}
              >
                {pick(q.q, locale)}
              </div>
            </div>

            {/* Option chips — show as user answer if selected, or as choices */}
            {answeredArr.length > 0 ? (
              <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                {answeredArr.map((id) => {
                  const opt = q.options.find((o) => o.id === id);
                  if (!opt) return null;
                  return (
                    <div
                      key={id}
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-ink)",
                        borderRadius: "18px 18px 4px 18px",
                        padding: "10px 16px",
                        fontSize: 14,
                        fontWeight: 500,
                      }}
                    >
                      {pick(opt.label, locale)}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingLeft: 46 }}>
                {q.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onAnswer(q.id, opt.id, !!q.multi, q.max)}
                    style={{
                      padding: "9px 16px",
                      borderRadius: 999,
                      border: "1.5px solid var(--line)",
                      background: "var(--surface)",
                      fontSize: 14,
                      cursor: "pointer",
                      color: "var(--ink)",
                      transition: "border-color .15s",
                    }}
                  >
                    {pick(opt.label, locale)}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Next / See recommendations */}
      {hasAllAnswers && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          {revealed < QUESTIONS.length ? (
            <Button variant="primary" size="md" onClick={handleNext}>
              {t("next")}
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={onComplete} iconRight="arrowR">
              {t("see")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Cards view ───────────────────────────────────────────────────────────────

function CardsView({ answers, onAnswer, onComplete, locale }: ViewProps) {
  const t = useTranslations("questionnaire");
  const answeredCount = QUESTIONS.filter((q) => {
    const a = answers[q.id];
    return a && (!Array.isArray(a) || a.length > 0);
  }).length;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 120px" }}>
      <div style={{ marginBottom: 32 }}>
        <h2
          className="serif"
          style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8, color: "var(--ink)" }}
        >
          {t("title")}
        </h2>
        <p style={{ fontSize: 14, color: "var(--ink-3)" }}>{t("sub")}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 100 }}>
        {QUESTIONS.map((q) => {
          const answered = answers[q.id];
          const answeredArr = Array.isArray(answered) ? answered : answered ? [answered] : [];
          const hasAns = answeredArr.length > 0;

          return (
            <div
              key={q.id}
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                border: `1px solid ${hasAns ? "var(--accent)" : "var(--line)"}`,
                padding: 20,
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: hasAns ? "var(--good-soft)" : "var(--surface-2)",
                    color: hasAns ? "var(--good)" : "var(--ink-2)",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={hasAns ? "check" : q.icon} size={18} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>
                    {pick(q.q, locale)}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>{pick(q.help, locale)}</div>
                </div>
              </div>

              {/* Options */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: 8,
                }}
              >
                {q.options.map((opt) => {
                  const sel = isSelected(answers, q.id, opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => onAnswer(q.id, opt.id, !!q.multi, q.max)}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${sel ? "var(--accent)" : "var(--line)"}`,
                        background: sel ? "var(--accent-soft)" : "var(--surface-2)",
                        fontSize: 13.5,
                        fontWeight: sel ? 600 : 400,
                        color: sel ? "var(--accent)" : "var(--ink-2)",
                        cursor: "pointer",
                        transition: "all .15s",
                        textAlign: "left",
                      }}
                    >
                      {pick(opt.label, locale)}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky footer */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(235,229,217,.92)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid var(--line)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 20,
        }}
      >
        <div style={{ fontSize: 14, color: "var(--ink-2)" }}>
          <span className="mono" style={{ fontWeight: 600, color: "var(--accent)" }}>
            {answeredCount}/{QUESTIONS.length}
          </span>{" "}
          {t("answered")}
        </div>
        <Button
          variant="primary"
          size="md"
          iconRight="arrowR"
          onClick={onComplete}
          disabled={answeredCount === 0}
        >
          {t("see")}
        </Button>
      </div>
    </div>
  );
}
