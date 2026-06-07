"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

export function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
      <AuthPageContent />
    </Suspense>
  );
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("auth");
  const mode = (searchParams.get("mode") || "create") as "create" | "login";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isCreate = mode === "create";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Stub: simulate network delay then route
    await new Promise((r) => setTimeout(r, 600));
    router.push(isCreate ? `/${locale}/questionnaire` : `/${locale}/dashboard`);
  }

  function handleBankID() {
    // Phase 3: real BankID OIDC — for now simulate
    router.push(isCreate ? `/${locale}/questionnaire` : `/${locale}/dashboard`);
  }

  function handleVipps() {
    router.push(isCreate ? `/${locale}/questionnaire` : `/${locale}/dashboard`);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "var(--bg)",
      }}
      className="auth-layout"
    >
      {/* ── Left brand panel ──────────────────────────────────────── */}
      <div
        style={{
          background: "var(--sidebar-bg)",
          backgroundImage: "var(--sidebar)",
          padding: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
        className="auth-brand-panel"
      >
        {/* Radial glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "40%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,106,64,.18), transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 80 }}>
            <Logo size="md" dark />
            <LangToggle locale={locale} />
          </div>

          <h1
            className="serif"
            style={{
              fontSize: "clamp(28px, 3vw, 40px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {t("brand_h")}
          </h1>
          <p style={{ fontSize: 16, color: "var(--sidebar-ink)", lineHeight: 1.6 }}>
            {t("brand_sub")}
          </p>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {(["feat1", "feat2", "feat3"] as const).map((key, i) => {
            const icons = ["shield", "heart", "building"] as const;
            return (
              <div
                key={key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 0",
                  borderTop: i === 0 ? "1px solid rgba(255,255,255,.12)" : "1px solid rgba(255,255,255,.12)",
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    background: "rgba(255,255,255,.08)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--sidebar-ink)",
                    flexShrink: 0,
                  }}
                >
                  <Icon name={icons[i]} size={18} />
                </div>
                <span style={{ fontSize: 14, color: "var(--sidebar-ink)" }}>{t(key)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px",
          background: "var(--bg)",
          overflowY: "auto",
        }}
      >
        <div style={{ maxWidth: 400, width: "100%", margin: "0 auto" }}>
          {/* Back link */}
          <Link
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13.5,
              color: "var(--ink-3)",
              textDecoration: "none",
              marginBottom: 32,
            }}
          >
            <Icon name="chevL" size={15} />
            Forsiden
          </Link>

          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginBottom: 8,
              color: "var(--ink)",
            }}
          >
            {isCreate ? t("create") : t("login")}
          </h2>

          {/* BankID / Vipps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24, marginTop: 24 }}>
            <button
              onClick={handleBankID}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                height: 50,
                borderRadius: 12,
                border: "1.5px solid var(--line)",
                background: "var(--surface)",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
                color: "#333",
                transition: "border-color .15s",
              }}
              aria-label="Fortsett med BankID"
            >
              {/* BankID wordmark placeholder */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#1a4fa0",
                  fontWeight: 700,
                }}
              >
                <Icon name="shield" size={18} />
                BankID
              </span>
              <span style={{ color: "var(--ink-2)" }}>{t("bankid").replace("Fortsett med ", "").replace("Continue with ", "")}</span>
            </button>

            <button
              onClick={handleVipps}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                height: 50,
                borderRadius: 12,
                border: "none",
                background: "#ff5b24",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "-0.01em",
              }}
              aria-label="Fortsett med Vipps"
            >
              Vipps
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
              color: "var(--ink-3)",
              fontSize: 13,
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
            {t("or")}
            <div style={{ flex: 1, height: 1, background: "var(--line)" }} />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {isCreate && (
                <Field
                  label={t("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ingrid Haugen"
                  icon="people"
                  autoComplete="name"
                  required
                  id="name"
                />
              )}
              <Field
                label={t("email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ingrid@example.no"
                icon="mail"
                autoComplete="email"
                required
                id="email"
                inputMode="email"
              />
              {isCreate && (
                <Field
                  label={t("phone")}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="94 23 75 47"
                  icon="phone"
                  autoComplete="tel"
                  id="phone"
                  inputMode="tel"
                />
              )}
              <Field
                label={t("pass")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon="lock"
                autoComplete={isCreate ? "new-password" : "current-password"}
                required
                id="password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              full
              loading={loading}
            >
              {t("continue")}
            </Button>
          </form>

          {/* Terms */}
          <p style={{ fontSize: 12.5, color: "var(--ink-3)", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
            {t("terms")}
          </p>

          {/* Mode toggle */}
          <p style={{ fontSize: 14, color: "var(--ink-2)", textAlign: "center", marginTop: 24 }}>
            {isCreate ? t("have") : t("no")}{" "}
            <Link
              href={`/${locale}/auth?mode=${isCreate ? "login" : "create"}`}
              style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
            >
              {isCreate ? t("login") : t("create")}
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile: hide brand panel */}
      <style>{`
        @media (max-width: 720px) {
          .auth-layout { grid-template-columns: 1fr !important; }
          .auth-brand-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function LangToggle({ locale }: { locale: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgba(255,255,255,.08)",
        borderRadius: 999,
        padding: 3,
        gap: 2,
      }}
    >
      {(["nb", "en"] as const).map((l) => {
        const active = locale === l;
        return (
          <Link
            key={l}
            href={`/${l}/auth`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "5px 11px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              background: active ? "rgba(255,255,255,.15)" : "transparent",
              color: active ? "#fff" : "rgba(255,255,255,.5)",
              textDecoration: "none",
              transition: "all .15s",
            }}
          >
            {l === "nb" ? "NO" : "EN"}
          </Link>
        );
      })}
    </div>
  );
}
