"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MESSAGES, ADVISOR, BUYER } from "@/lib/data";
import { pick } from "@/lib/format";
import { Icon } from "@/components/ui/icon";
import { Avatar } from "@/components/ui/avatar";
import type { Message } from "@/types";

export function MessagesTab() {
  const locale = useLocale();
  const t = useTranslations("messages");
  const [messages, setMessages] = useState<Message[]>(MESSAGES);
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString(locale === "nb" ? "nb-NO" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newMsg: Message = {
      id: `m${Date.now()}`,
      from: "me",
      text: { no: text, en: text },
      time: timeStr,
      date: { no: "Nå", en: "Now" },
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft("");
  }

  return (
    <div
      style={{
        maxWidth: 680,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 160px)",
        minHeight: 480,
      }}
    >
      {/* Thread header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "16px 0 16px",
          borderBottom: "1px solid var(--line)",
          flexShrink: 0,
        }}
      >
        <Avatar initials={ADVISOR.initials} size={44} />
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>{ADVISOR.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)" }}>
            {pick(ADVISOR.role, locale)} · {ADVISOR.phone}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <a
            href={`tel:${ADVISOR.phone}`}
            style={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--surface-2)",
              color: "var(--ink-2)",
              border: "1px solid var(--line)",
            }}
            aria-label={t("call")}
          >
            <Icon name="phone" size={16} />
          </a>
          <a
            href={`mailto:${ADVISOR.email}`}
            style={{
              display: "grid",
              placeItems: "center",
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--surface-2)",
              color: "var(--ink-2)",
              border: "1px solid var(--line)",
            }}
            aria-label={t("email")}
          >
            <Icon name="mail" size={16} />
          </a>
        </div>
      </div>

      {/* Message list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 4px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.from === "me";
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
              }}
            >
              {!isMe && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Avatar initials={ADVISOR.initials} size={24} />
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{ADVISOR.name}</span>
                </div>
              )}
              <div
                className={isMe ? "bubble-me" : "bubble-advisor"}
                style={{ maxWidth: "75%" }}
              >
                {pick(msg.text, locale)}
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "var(--ink-3)",
                  marginTop: 3,
                  paddingLeft: isMe ? 0 : 30,
                  paddingRight: isMe ? 4 : 0,
                }}
              >
                {msg.time}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div
        style={{
          borderTop: "1px solid var(--line)",
          padding: "12px 0 0",
          display: "flex",
          gap: 10,
          alignItems: "flex-end",
          flexShrink: 0,
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder={t("placeholder")}
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1.5px solid var(--line)",
            background: "var(--surface)",
            fontSize: 14,
            color: "var(--ink)",
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
          }}
          aria-label={t("placeholder")}
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          aria-label={t("send")}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: draft.trim() ? "var(--primary)" : "var(--surface-2)",
            color: draft.trim() ? "var(--primary-ink)" : "var(--ink-3)",
            border: "none",
            display: "grid",
            placeItems: "center",
            cursor: draft.trim() ? "pointer" : "not-allowed",
            transition: "background .15s, color .15s",
            flexShrink: 0,
          }}
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  );
}
