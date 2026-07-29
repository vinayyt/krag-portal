"use client";

import React, { useState, useRef, useEffect } from "react";
import type { AdminMessage } from "@/lib/admin-data";

interface MessagesSectionProps {
  buyerId: string;
  buyerName: string;
  messages: AdminMessage[];
  onBack: () => void;
  onSaved: () => void;
}

export function MessagesSection({ buyerId, buyerName, messages: initial, onBack: _onBack, onSaved }: MessagesSectionProps) {
  const [messages, setMessages] = useState<AdminMessage[]>(initial);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    setSending(true);

    // Optimistic
    const now = new Date();
    const timeStr = now.toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
    const optimistic: AdminMessage = {
      id: `tmp-${Date.now()}`,
      from: "advisor",
      textNo: text,
      time: timeStr,
      dateNo: dateStr,
      createdAt: now,
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");

    const res = await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, text }),
    });
    setSending(false);
    if (res.ok) onSaved();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 200px)", minHeight: 500 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexShrink: 0 }}>
        <h2 style={sectionTitle}>Meldinger</h2>
        <span style={{ marginLeft: "auto", fontSize: 13, color: "var(--ink-3)" }}>
          Samtale med {buyerName}
        </span>
      </div>

      {/* Thread */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "12px 4px",
        display: "flex", flexDirection: "column", gap: 8,
        border: "1px solid var(--line)", borderRadius: 12,
        background: "var(--surface)", marginBottom: 12,
      }}>
        {messages.length === 0 && (
          <div style={{ padding: "20px", color: "var(--ink-3)", fontSize: 14, textAlign: "center" }}>
            Ingen meldinger ennå. Start samtalen nedenfor.
          </div>
        )}
        {messages.map((msg) => {
          const isAdvisor = msg.from === "advisor";
          return (
            <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdvisor ? "flex-end" : "flex-start", padding: "0 12px" }}>
              <div style={{
                maxWidth: "72%",
                padding: "10px 14px",
                borderRadius: isAdvisor ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: isAdvisor ? "var(--accent)" : "var(--surface-2)",
                color: isAdvisor ? "#fff" : "var(--ink)",
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                {msg.textNo}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 3 }}>
                {isAdvisor ? "Du" : buyerName} · {msg.time}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={2}
          placeholder="Skriv melding til kjøper…"
          style={{
            flex: 1, padding: "12px 14px", borderRadius: 10,
            border: "1.5px solid var(--line)", background: "var(--surface)",
            fontSize: 14, color: "var(--ink)", resize: "none", outline: "none",
            fontFamily: "inherit", lineHeight: 1.5,
          }}
        />
        <button
          onClick={send}
          disabled={!draft.trim() || sending}
          style={{
            width: 44, height: 44, borderRadius: "50%", border: "none",
            background: draft.trim() ? "var(--accent)" : "var(--surface-2)",
            color: draft.trim() ? "#fff" : "var(--ink-3)",
            display: "grid", placeItems: "center", cursor: draft.trim() ? "pointer" : "default",
            fontSize: 18, flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 };
