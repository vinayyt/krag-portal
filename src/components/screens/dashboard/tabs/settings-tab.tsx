"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { BUYER } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

interface SettingRowProps {
  icon: string;
  title: string;
  sub?: string;
  action?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ icon, title, sub, action, danger }: SettingRowProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid var(--line-2)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: danger ? "rgba(180,71,31,0.08)" : "var(--surface-2)",
          color: danger ? "var(--warn-text, #b4471f)" : "var(--ink-3)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={icon} size={17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 500, color: danger ? "var(--warn-text, #b4471f)" : "var(--ink)" }}>
          {title}
        </div>
        {sub && <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>{sub}</div>}
      </div>
      {action ?? (
        <Icon name="chevR" size={16} style={{ color: "var(--ink-3)", flexShrink: 0 }} />
      )}
    </div>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        background: checked ? "var(--good)" : "var(--line)",
        border: "none",
        cursor: "pointer",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        transition: "background .2s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          transition: "transform .2s",
        }}
      />
    </button>
  );
}

export function SettingsTab() {
  const locale = useLocale();
  const t = useTranslations("settings");
  const [notifBuilding, setNotifBuilding] = useState(true);
  const [notifDocs, setNotifDocs] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifPayments, setNotifPayments] = useState(false);

  return (
    <div style={{ maxWidth: 700 }}>
      {/* Profile */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <Avatar initials={BUYER.initials} size={56} />
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: "var(--ink)" }}>{BUYER.name}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginTop: 2 }}>{BUYER.email}</div>
            <div style={{ fontSize: 13.5, color: "var(--ink-3)" }}>{BUYER.phone}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Button variant="soft" size="sm" icon="settings">
              {t("edit_profile")}
            </Button>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 14 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              marginBottom: 10,
            }}
          >
            {t("account")}
          </div>
          <SettingRow icon="mail" title={t("email")} sub={BUYER.email} />
          <SettingRow icon="phone" title={t("phone")} sub={BUYER.phone} />
          <SettingRow icon="people" title={t("co_buyers")} sub={t("co_buyers_sub")} />
        </div>
      </Card>

      {/* Notifications */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 10,
          }}
        >
          {t("notifications")}
        </div>
        <SettingRow
          icon="hammer"
          title={t("notif_building")}
          sub={t("notif_building_sub")}
          action={<Toggle checked={notifBuilding} onChange={setNotifBuilding} label={t("notif_building")} />}
        />
        <SettingRow
          icon="doc"
          title={t("notif_docs")}
          sub={t("notif_docs_sub")}
          action={<Toggle checked={notifDocs} onChange={setNotifDocs} label={t("notif_docs")} />}
        />
        <SettingRow
          icon="chat"
          title={t("notif_messages")}
          sub={t("notif_messages_sub")}
          action={<Toggle checked={notifMessages} onChange={setNotifMessages} label={t("notif_messages")} />}
        />
        <SettingRow
          icon="wallet"
          title={t("notif_payments")}
          sub={t("notif_payments_sub")}
          action={<Toggle checked={notifPayments} onChange={setNotifPayments} label={t("notif_payments")} />}
        />
      </Card>

      {/* Security */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 10,
          }}
        >
          {t("security")}
        </div>
        <SettingRow icon="lock" title={t("change_password")} />
        <SettingRow
          icon="shield"
          title={t("two_factor")}
          sub={t("two_factor_sub")}
          action={<Tag tone="good" size="sm">{t("enabled")}</Tag>}
        />
        <SettingRow icon="briefcase" title={t("bankid")} sub={t("bankid_sub")} />
      </Card>

      {/* Privacy + Legal */}
      <Card style={{ marginBottom: 20 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "var(--ink-3)",
            marginBottom: 10,
          }}
        >
          {t("privacy")}
        </div>
        <SettingRow icon="doc" title={t("privacy_policy")} />
        <SettingRow icon="doc" title={t("terms")} />
        <SettingRow icon="eye" title={t("data_export")} />
        <div style={{ borderBottom: "none" }}>
          <SettingRow icon="logout" title={t("delete_account")} danger />
        </div>
      </Card>

      {/* App version */}
      <div style={{ textAlign: "center", paddingTop: 8, paddingBottom: 32 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-3)" }}>
          Krag Portal v1.0.0
        </span>
      </div>
    </div>
  );
}
