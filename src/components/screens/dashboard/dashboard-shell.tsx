"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ADVISOR, BUYER, DASHBOARD_PROJECT, NOTIFICATIONS } from "@/lib/data";
import { pick } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { Logo } from "@/components/ui/logo";
import { OverviewTab } from "./tabs/overview-tab";
import { ProgressTab } from "./tabs/progress-tab";
import { BudgetTab } from "./tabs/budget-tab";
import { DocumentsTab } from "./tabs/documents-tab";
import { PhotosTab } from "./tabs/photos-tab";
import { MessagesTab } from "./tabs/messages-tab";
import { ChoicesTab } from "./tabs/choices-tab";
import { MeetingsTab } from "./tabs/meetings-tab";
import { Model3DTab } from "./tabs/model3d-tab";
import { SettingsTab } from "./tabs/settings-tab";

export type DashboardTab =
  | "overview"
  | "progress"
  | "model3d"
  | "choices"
  | "budget"
  | "documents"
  | "messages"
  | "photos"
  | "meetings"
  | "settings";

interface NavItem {
  id: DashboardTab;
  icon: string;
  labelKey: string;
  badge?: number | boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", icon: "grid", labelKey: "nav.overview" },
  { id: "progress", icon: "activity", labelKey: "nav.progress" },
  { id: "model3d", icon: "cube", labelKey: "nav.model3d" },
  { id: "choices", icon: "swatch", labelKey: "nav.choices" },
  { id: "budget", icon: "wallet", labelKey: "nav.budget" },
  { id: "documents", icon: "doc", labelKey: "nav.docs", badge: true },
  { id: "messages", icon: "chat", labelKey: "nav.messages", badge: 1 },
  { id: "photos", icon: "photo", labelKey: "nav.photos" },
  { id: "meetings", icon: "calendar", labelKey: "nav.meetings" },
  { id: "settings", icon: "settings", labelKey: "nav.settings" },
];

// Bottom tabs for mobile (most important 4)
const BOTTOM_TABS: NavItem[] = [
  { id: "overview", icon: "grid", labelKey: "nav.overview" },
  { id: "progress", icon: "activity", labelKey: "nav.progress" },
  { id: "model3d", icon: "cube", labelKey: "nav.model3d" },
  { id: "messages", icon: "chat", labelKey: "nav.messages", badge: 1 },
];

function TabContent({ tab, setTab }: { tab: DashboardTab; setTab: (t: DashboardTab) => void }) {
  switch (tab) {
    case "overview":  return <OverviewTab setTab={setTab} />;
    case "progress":  return <ProgressTab />;
    case "model3d":   return <Model3DTab />;
    case "choices":   return <ChoicesTab />;
    case "budget":    return <BudgetTab />;
    case "documents": return <DocumentsTab />;
    case "messages":  return <MessagesTab />;
    case "photos":    return <PhotosTab />;
    case "meetings":  return <MeetingsTab />;
    case "settings":  return <SettingsTab />;
    default:          return <OverviewTab setTab={setTab} />;
  }
}

export function DashboardShell() {
  const locale = useLocale();
  const t = useTranslations();
  const [tab, setTab] = useState<DashboardTab>("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadNotifs = NOTIFICATIONS.filter((n) => n.unread).length;
  const project = DASHBOARD_PROJECT;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Sidebar (desktop) ─────────────────────────────────── */}
      <aside
        className="sidebar-desktop"
        style={{
          width: 256,
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          background: "var(--sidebar-bg)",
          backgroundImage: "var(--sidebar)",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px" }}>
          <Logo size="md" dark />
        </div>

        {/* Project selector */}
        <div
          style={{
            margin: "0 12px 16px",
            padding: "10px 12px",
            borderRadius: "var(--radius-sm)",
            background: "rgba(255,255,255,.06)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Icon name="home" size={16} style={{ color: "var(--sidebar-ink)", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {project.name}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--sidebar-muted)" }}>
              {project.unit} · {pick(project.type, locale).split("·")[0].trim()}
            </div>
          </div>
          <Icon name="chevD" size={14} style={{ color: "var(--sidebar-muted)", flexShrink: 0 }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "0 12px" }} aria-label="Dashboard navigation">
          {NAV_ITEMS.map(({ id, icon, labelKey, badge }) => {
            const active = tab === id;
            const labelParts = labelKey.split(".");
            const label = t(labelKey as any);
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-current={active ? "page" : undefined}
                className={`sidebar-nav-item ${active ? "active" : ""}`}
                style={{ width: "100%", border: "none", cursor: "pointer", marginBottom: 2 }}
              >
                <Icon name={icon} size={19} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                {badge === true && (
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#f59e0b",
                      flexShrink: 0,
                    }}
                  />
                )}
                {typeof badge === "number" && (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      borderRadius: 999,
                      padding: "1px 7px",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Advisor + Logout */}
        <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,.08)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255,255,255,.05)",
              marginBottom: 10,
            }}
          >
            <Avatar initials={ADVISOR.initials} size={34} tone="primary" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--sidebar-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {ADVISOR.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--sidebar-muted)" }}>
                {locale === "nb" ? "Rådgiver" : "Advisor"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setTab("messages")}
            style={{
              width: "100%",
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginBottom: 8,
            }}
          >
            <Icon name="chat" size={16} />
            {t("nav.send_message")}
          </button>
          <Link
            href={`/${locale}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 12px",
              borderRadius: "var(--radius-sm)",
              color: "var(--sidebar-muted)",
              textDecoration: "none",
              fontSize: 13.5,
              transition: "color .15s",
            }}
          >
            <Icon name="logout" size={16} />
            {t("nav.logout")}
          </Link>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <main
        className="dashboard-main"
        style={{
          marginLeft: 256,
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Topbar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 30,
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--line)",
            background: "rgba(235,229,217,.88)",
            padding: "0 26px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="mobile-menu-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{
              display: "none",
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid var(--line)",
              background: "var(--surface)",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Icon name="menu" size={20} />
          </button>

          {/* Greeting */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>
              {t("overview.greeting")}, {BUYER.name} 👋
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
              {project.name} · {project.unit}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Lang toggle */}
            <div
              style={{
                display: "inline-flex",
                background: "var(--surface-2)",
                borderRadius: 999,
                padding: 3,
                gap: 2,
                border: "1px solid var(--line)",
              }}
            >
              {(["nb", "en"] as const).map((l) => {
                const active = locale === l;
                return (
                  <Link
                    key={l}
                    href={`/${l}/dashboard`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "4px 10px",
                      borderRadius: 999,
                      fontSize: 12.5,
                      fontWeight: 600,
                      background: active ? "var(--surface)" : "transparent",
                      color: active ? "var(--ink)" : "var(--ink-3)",
                      boxShadow: active ? "var(--shadow-sm)" : "none",
                      textDecoration: "none",
                      transition: "all .15s",
                    }}
                  >
                    {l === "nb" ? "NO" : "EN"}
                  </Link>
                );
              })}
            </div>

            {/* Notification bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setNotifOpen((o) => !o)}
                aria-label={`${unreadNotifs} unread notifications`}
                aria-expanded={notifOpen}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <Icon name="bell" size={18} />
                {unreadNotifs > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: 7,
                      right: 7,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "var(--accent)",
                      border: "2px solid var(--surface)",
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>

              {notifOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: 320,
                    background: "var(--surface)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--line)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                  role="menu"
                >
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--line)", fontSize: 13.5, fontWeight: 600 }}>
                    Varsler
                  </div>
                  {NOTIFICATIONS.map((n, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        padding: "12px 16px",
                        background: n.unread ? "var(--accent-soft)" : "transparent",
                        borderBottom: i < NOTIFICATIONS.length - 1 ? "1px solid var(--line-2)" : "none",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          background: "var(--surface-2)",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon name={n.icon} size={15} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: 1.4 }}>
                          {pick(n.text, locale)}
                        </div>
                        <div className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3 }}>
                          {pick(n.time, locale)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Tab content */}
        <div style={{ flex: 1, padding: "26px", paddingBottom: 80 }}>
          <TabContent tab={tab} setTab={setTab} />
        </div>
      </main>

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.4)",
              zIndex: 59,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: 280,
              background: "var(--sidebar-bg)",
              backgroundImage: "var(--sidebar)",
              zIndex: 60,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 18px" }}>
              <Logo size="md" dark />
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                style={{ background: "rgba(255,255,255,.1)", border: "none", borderRadius: 8, width: 36, height: 36, display: "grid", placeItems: "center", cursor: "pointer" }}
              >
                <Icon name="x" size={18} style={{ color: "#fff" }} />
              </button>
            </div>
            <nav style={{ padding: "0 12px", flex: 1 }}>
              {NAV_ITEMS.map(({ id, icon, labelKey, badge }) => {
                const active = tab === id;
                const label = t(labelKey as any);
                return (
                  <button
                    key={id}
                    onClick={() => { setTab(id); setDrawerOpen(false); }}
                    className={`sidebar-nav-item ${active ? "active" : ""}`}
                    style={{ width: "100%", border: "none", marginBottom: 2 }}
                  >
                    <Icon name={icon} size={19} />
                    <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                    {typeof badge === "number" && (
                      <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* ── Mobile bottom nav ──────────────────────────────────── */}
      <nav
        className="bottom-nav"
        aria-label="Main navigation"
        style={{
          display: "none",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "calc(56px + env(safe-area-inset-bottom, 0px))",
          background: "var(--surface)",
          borderTop: "1px solid var(--line)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 40,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        {BOTTOM_TABS.map(({ id, icon, labelKey, badge }) => {
          const active = tab === id;
          const label = t(labelKey as any);
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              aria-current={active ? "page" : undefined}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                color: active ? "var(--accent)" : "var(--ink-3)",
                cursor: "pointer",
                position: "relative",
                minWidth: 0,
              }}
            >
              <Icon name={icon} size={22} />
              <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 400, whiteSpace: "nowrap" }}>
                {label}
              </span>
              {typeof badge === "number" && (
                <span
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 8,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
        {/* More button */}
        <button
          onClick={() => setDrawerOpen(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            padding: "8px 16px",
            border: "none",
            background: "transparent",
            color: "var(--ink-3)",
            cursor: "pointer",
          }}
        >
          <Icon name="menu" size={22} />
          <span style={{ fontSize: 10.5 }}>Mer</span>
        </button>
      </nav>

      {/* ── Responsive CSS ─────────────────────────────────────── */}
      <style>{`
        @media (max-width: 920px) {
          .sidebar-desktop { display: none !important; }
          .dashboard-main { margin-left: 0 !important; padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px)) !important; }
          .bottom-nav { display: flex !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 921px) {
          .bottom-nav { display: none !important; }
        }
      `}</style>
    </div>
  );
}
