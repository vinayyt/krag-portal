"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { pick } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { Tag } from "@/components/ui/tag";
import {
  RENO_PM, RENO_BUYER, RENO_PROJECT, RENO_AVVIK, RENO_NOTIFICATIONS,
  DASHBOARD_PROJECT,
} from "@/lib/data";

// ─── Tab types ────────────────────────────────────────────────────────────────
export type RenoTab =
  | "oversikt" | "fremdrift" | "rom" | "avvik" | "materialer"
  | "okonomi" | "dokumenter" | "meldinger" | "bildelogg" | "moter" | "innstillinger";

const RENO_NAV: { id: RenoTab; icon: string; label: { no: string; en: string } }[] = [
  { id: "oversikt",     icon: "grid",     label: { no: "Oversikt",       en: "Overview" } },
  { id: "fremdrift",    icon: "activity", label: { no: "Fremdrift",      en: "Progress" } },
  { id: "rom",          icon: "layers",   label: { no: "Rom & omfang",   en: "Rooms & scope" } },
  { id: "avvik",        icon: "alert",    label: { no: "Avvik & endringer", en: "Changes" } },
  { id: "materialer",   icon: "swatch",   label: { no: "Materialer",     en: "Materials" } },
  { id: "okonomi",      icon: "wallet",   label: { no: "Økonomi",        en: "Budget" } },
  { id: "dokumenter",   icon: "doc",      label: { no: "Dokumenter",     en: "Documents" } },
  { id: "meldinger",    icon: "chat",     label: { no: "Meldinger",      en: "Messages" } },
  { id: "bildelogg",    icon: "photo",    label: { no: "Bildelogg",      en: "Photos" } },
  { id: "moter",        icon: "calendar", label: { no: "Møter",          en: "Meetings" } },
  { id: "innstillinger",icon: "settings", label: { no: "Innstillinger",  en: "Settings" } },
];
const RENO_MOBILE_NAV: RenoTab[] = ["oversikt", "fremdrift", "avvik", "meldinger"];

// ─── Project switcher ─────────────────────────────────────────────────────────
function ProjSwitcher({ tab, locale }: { tab: RenoTab; locale: string }) {
  const [open, setOpen] = useState(false);
  const items = [
    {
      id: "build",
      name: DASHBOARD_PROJECT.name,
      sub: locale === "en" ? "New build · Home B7" : "Nybygg · Bolig B7",
      href: `/${locale}/dashboard`,
      icon: "home",
    },
    {
      id: "reno",
      name: RENO_PROJECT.addressShort,
      sub: locale === "en" ? "Full renovation" : "Totalrenovering",
      href: `/${locale}/reno`,
      icon: "tools",
    },
  ];
  const cur = items[1]; // always reno here

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 14px",
          borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <span style={{ width: 30, height: 30, borderRadius: 8, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center" }}>
          <Icon name="tools" size={16} />
        </span>
        <span style={{ lineHeight: 1.2, textAlign: "left", minWidth: 0 }}>
          <span style={{ display: "block", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap" }}>{cur.name}</span>
          <span style={{ display: "block", fontSize: 11.5, color: "var(--ink-3)", whiteSpace: "nowrap" }}>{cur.sub}</span>
        </span>
        <Icon name="chevD" size={16} style={{ color: "var(--ink-3)" }} />
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
          <div
            className="fade-up"
            style={{
              position: "absolute", top: 52, left: 0, width: 280,
              background: "var(--surface)", borderRadius: 14,
              boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)",
              zIndex: 50, overflow: "hidden", padding: 6,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".05em", padding: "8px 10px 4px" }}>
              {locale === "en" ? "Your projects" : "Dine prosjekter"}
            </div>
            {items.map((it) => {
              const active = it.id === "reno";
              return (
                <Link
                  key={it.id}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex", alignItems: "center", gap: 11, width: "100%",
                      textAlign: "left", padding: 10, borderRadius: 10,
                      background: active ? "var(--surface-2)" : "transparent",
                    }}
                  >
                    <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--accent-soft)", color: "var(--accent)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <Icon name={it.icon} size={17} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{it.name}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--ink-3)" }}>{it.sub}</span>
                    </span>
                    {active && <Icon name="check" size={17} style={{ color: "var(--accent)" }} />}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Notification panel ────────────────────────────────────────────────────────
function NotifPanel({ onClose, onNav }: { onClose: () => void; onNav: (tab: RenoTab) => void }) {
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
      <div
        className="fade-up"
        style={{
          position: "absolute", top: 52, right: 0, width: 340,
          background: "var(--surface)", borderRadius: 16,
          boxShadow: "var(--shadow-lg)", border: "1px solid var(--line)",
          zIndex: 50, overflow: "hidden",
        }}
      >
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Varsler</span>
          <button onClick={onClose} style={{ color: "var(--ink-3)" }}><Icon name="x" size={18} /></button>
        </div>
        {RENO_NOTIFICATIONS.map((n, i) => {
          const tab: RenoTab = n.icon === "alert" ? "avvik" : n.icon === "camera" ? "bildelogg" : "meldinger";
          return (
            <button
              key={i}
              onClick={() => { onClose(); onNav(tab); }}
              style={{
                display: "flex", gap: 12, padding: "14px 18px", width: "100%", textAlign: "left",
                borderBottom: i < RENO_NOTIFICATIONS.length - 1 ? "1px solid var(--line-2)" : "none",
                background: n.unread ? "var(--accent-soft)" : "transparent",
              }}
            >
              <span style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, display: "grid", placeItems: "center", background: "var(--surface)", color: n.icon === "alert" ? "var(--warn)" : "var(--ink-2)", boxShadow: "inset 0 0 0 1px var(--line)" }}>
                <Icon name={n.icon} size={17} />
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, lineHeight: 1.4 }}>{pick(n.text, "nb")}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>{pick(n.time, "nb")}</div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Main shell ────────────────────────────────────────────────────────────────
interface RenoDashboardShellProps {
  tab: RenoTab;
  onTabChange: (tab: RenoTab) => void;
  children: React.ReactNode;
}

export function RenoDashboardShell({ tab, onTabChange, children }: RenoDashboardShellProps) {
  const locale = useLocale();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = RENO_NOTIFICATIONS.filter((n) => n.unread).length;
  const pendingAvvik = RENO_AVVIK.filter((a) => a.status === "pending").length;

  const NavItem = ({ n }: { n: (typeof RENO_NAV)[number] }) => {
    const active = tab === n.id;
    return (
      <button
        onClick={() => { onTabChange(n.id); setMobileMenu(false); }}
        style={{
          display: "flex", alignItems: "center", gap: 12, padding: "11px 12px",
          borderRadius: 11, fontSize: 14.5, fontWeight: 500, textAlign: "left", width: "100%",
          background: active ? "var(--sidebar-active)" : "transparent",
          color: active ? "#fff" : "var(--sidebar-ink)",
          transition: "all .15s", position: "relative",
        }}
      >
        {active && (
          <span style={{ position: "absolute", left: -14, top: "50%", transform: "translateY(-50%)", width: 3, height: 22, borderRadius: 99, background: "var(--accent)" }} />
        )}
        <Icon name={n.icon} size={19} style={{ color: active ? "var(--accent)" : "var(--sidebar-muted)" }} />
        {pick(n.label, locale)}
        {n.id === "avvik" && pendingAvvik > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, background: "var(--warn)", color: "#fff", borderRadius: 99, padding: "1px 7px" }}>
            {pendingAvvik}
          </span>
        )}
        {n.id === "dokumenter" && (
          <span style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: 99, background: "var(--warn)" }} />
        )}
        {n.id === "meldinger" && (
          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, background: "var(--accent)", color: "#fff", borderRadius: 99, padding: "1px 7px" }}>1</span>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <>
      <div style={{ padding: "6px 10px 18px" }}>
        <Logo size="sm" dark />
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
        {RENO_NAV.map((n) => <NavItem key={n.id} n={n} />)}
      </nav>
      <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 14, marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
          <Avatar initials={RENO_PM.initials} size={42} tone="accent" />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11.5, color: "var(--sidebar-muted)" }}>
              {locale === "en" ? "Your project manager" : "Din prosjektleder"}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {RENO_PM.name}
            </div>
          </div>
        </div>
        <button
          onClick={() => onTabChange("meldinger")}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: 10, borderRadius: 10, background: "var(--accent)", color: "#fff", fontSize: 13.5, fontWeight: 600 }}
        >
          <Icon name="chat" size={16} />
          {locale === "en" ? "Send message" : "Send melding"}
        </button>
        <Link
          href={`/${locale}`}
          style={{ display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "10px 12px", marginTop: 6, borderRadius: 10, color: "var(--sidebar-muted)", fontSize: 13.5, fontWeight: 500, textDecoration: "none" }}
        >
          <Icon name="logout" size={16} />
          {locale === "en" ? "Log out" : "Logg ut"}
        </Link>
      </div>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <aside
        className="ksidebar"
        style={{
          width: 256, flexShrink: 0,
          background: "var(--sidebar-bg)", backgroundImage: "var(--sidebar)",
          color: "var(--sidebar-ink)", position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column", padding: "20px 14px",
        }}
      >
        {sidebarContent}
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{
          position: "sticky", top: 0, zIndex: 30,
          background: "color-mix(in srgb, var(--bg) 82%, transparent)",
          backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)",
          padding: "13px 26px", display: "flex", alignItems: "center", gap: 14,
        }}>
          <button
            className="kmenu-btn"
            onClick={() => setMobileMenu(true)}
            style={{ display: "none", width: 40, height: 40, borderRadius: 10, placeItems: "center", color: "var(--ink)" }}
          >
            <Icon name="menu" size={22} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 8 }}>
              {locale === "en" ? "Hi" : "Hei"}, {RENO_BUYER.name} 👋
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-3)" }} className="topbar-sub">
              {locale === "en" ? "Your renovation, all in one place" : "Renoveringen din, samlet på ett sted"}
            </div>
          </div>
          <ProjSwitcher tab={tab} locale={locale} />
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                position: "relative", width: 44, height: 44, borderRadius: 12,
                background: "var(--surface)", border: "1px solid var(--line)",
                display: "grid", placeItems: "center", color: "var(--ink-2)", boxShadow: "var(--shadow-sm)",
              }}
            >
              <Icon name="bell" size={20} />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: 8, right: 9, width: 16, height: 16,
                  borderRadius: 99, background: "var(--accent)", color: "#fff",
                  fontSize: 10, fontWeight: 700, display: "grid", placeItems: "center",
                  border: "2px solid var(--bg)",
                }}>
                  {unread}
                </span>
              )}
            </button>
            {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} onNav={onTabChange} />}
          </div>
          <div className="topbar-lang">
            <div style={{ display: "flex", gap: 4 }}>
              {(["nb", "en"] as const).map((l) => (
                <Link
                  key={l}
                  href={`/${l}/reno`}
                  style={{
                    display: "inline-flex", alignItems: "center", padding: "5px 10px",
                    borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none",
                    background: locale === l ? "var(--surface-3)" : "transparent",
                    color: locale === l ? "var(--ink)" : "var(--ink-3)",
                  }}
                >
                  {l === "nb" ? "NO" : "EN"}
                </Link>
              ))}
            </div>
          </div>
        </header>

        {/* Tab content */}
        <main style={{ flex: 1, padding: "26px", maxWidth: 1280, width: "100%", margin: "0 auto", paddingBottom: 90 }} className="dash-main">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="kbottomnav" style={{ display: "none" }}>
        {RENO_MOBILE_NAV.map((id) => {
          const n = RENO_NAV.find((x) => x.id === id)!;
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0", color: active ? "var(--accent)" : "var(--ink-3)", position: "relative" }}
            >
              <Icon name={n.icon} size={21} />
              {id === "avvik" && pendingAvvik > 0 && (
                <span style={{ position: "absolute", top: 4, right: "28%", width: 7, height: 7, borderRadius: 99, background: "var(--warn)" }} />
              )}
              <span style={{ fontSize: 10.5, fontWeight: 600 }}>{pick(n.label, locale)}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMobileMenu(true)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 0", color: "var(--ink-3)" }}
        >
          <Icon name="menu" size={21} />
          <span style={{ fontSize: 10.5, fontWeight: 600 }}>{locale === "en" ? "Menu" : "Meny"}</span>
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(20,18,14,.4)", backdropFilter: "blur(2px)" }}
          className="fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: 280,
              background: "var(--sidebar-bg)", backgroundImage: "var(--sidebar)",
              color: "var(--sidebar-ink)", padding: "20px 14px",
              display: "flex", flexDirection: "column", animation: "fadeIn .2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px 16px" }}>
              <Logo size="sm" dark />
              <button onClick={() => setMobileMenu(false)} style={{ color: "var(--sidebar-muted)" }}>
                <Icon name="x" size={22} />
              </button>
            </div>
            <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, overflowY: "auto" }}>
              {RENO_NAV.map((n) => <NavItem key={n.id} n={n} />)}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
