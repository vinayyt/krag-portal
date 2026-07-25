"use client";

import React, { useState } from "react";
import type { AdminMeeting } from "@/lib/admin-data";

interface MeetingsSectionProps {
  buyerId: string;
  meetings: AdminMeeting[];
  onBack: () => void;
  onSaved: () => void;
}

const EMPTY_FORM = {
  titleNo: "",
  titleEn: "",
  dateNo: "",
  time: "10:00",
  online: false,
};

export function MeetingsSection({ buyerId, meetings: initial, onBack, onSaved }: MeetingsSectionProps) {
  const [meetings, setMeetings] = useState<AdminMeeting[]>(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function addMeeting() {
    if (!form.titleNo || !form.dateNo || !form.time) return;
    setAdding(true);
    const res = await fetch("/api/admin/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerId,
        titleNo: form.titleNo,
        titleEn: form.titleEn || form.titleNo,
        dateNo: form.dateNo,
        dateEn: form.dateNo,
        time: form.time,
        online: form.online,
      }),
    });
    setAdding(false);
    if (res.ok) {
      const m: AdminMeeting = await res.json();
      setMeetings((prev) => [...prev, m]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      onSaved();
    }
  }

  async function deleteMeeting(id: number) {
    setDeleting(id);
    await fetch(`/api/admin/meetings/${id}`, { method: "DELETE" });
    setMeetings((prev) => prev.filter((m) => m.id !== id));
    setDeleting(null);
    onSaved();
  }

  async function toggleStatus(meeting: AdminMeeting) {
    const newStatus = meeting.status === "upcoming" ? "past" : "upcoming";
    const res = await fetch(`/api/admin/meetings/${meeting.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setMeetings((prev) => prev.map((m) => m.id === meeting.id ? { ...m, status: newStatus } : m));
      onSaved();
    }
  }

  const upcoming = meetings.filter((m) => m.status === "upcoming");
  const past = meetings.filter((m) => m.status === "past");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={backBtn}>← Tilbake</button>
        <h2 style={sectionTitle}>Møter</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{ marginLeft: "auto", ...primaryBtn }}
        >
          + Legg til møte
        </button>
      </div>

      {/* Add meeting form */}
      {showForm && (
        <div style={{ ...card, marginBottom: 24, background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>Nytt møte</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={fieldWrap}>
              <label style={label}>Tittel (norsk)</label>
              <input
                value={form.titleNo}
                onChange={(e) => setForm({ ...form, titleNo: e.target.value })}
                placeholder="f.eks. Byggemøte #3"
                style={inputStyle}
              />
            </div>
            <div style={fieldWrap}>
              <label style={label}>Title (English)</label>
              <input
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                placeholder="e.g. Site meeting #3"
                style={inputStyle}
              />
            </div>
            <div style={fieldWrap}>
              <label style={label}>Dato</label>
              <input
                type="date"
                value={form.dateNo}
                onChange={(e) => setForm({ ...form, dateNo: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={fieldWrap}>
              <label style={label}>Tidspunkt</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={form.online}
              onChange={(e) => setForm({ ...form, online: e.target.checked })}
            />
            Videomøte (online)
          </label>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addMeeting} disabled={adding || !form.titleNo || !form.dateNo} style={primaryBtn}>
              {adding ? "Legger til…" : "Legg til"}
            </button>
            <button onClick={() => setShowForm(false)} style={ghostBtn}>Avbryt</button>
          </div>
        </div>
      )}

      {/* Upcoming */}
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 10 }}>
        Kommende ({upcoming.length})
      </div>
      {upcoming.length === 0 ? (
        <div style={{ ...card, color: "var(--ink-3)", fontSize: 14, marginBottom: 20 }}>Ingen kommende møter</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {upcoming.map((m) => <MeetingRow key={m.id} meeting={m} onDelete={deleteMeeting} onToggle={toggleStatus} deleting={deleting} />)}
        </div>
      )}

      {/* Past */}
      <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--ink-3)", marginBottom: 10 }}>
        Tidligere ({past.length})
      </div>
      {past.length === 0 ? (
        <div style={{ ...card, color: "var(--ink-3)", fontSize: 14 }}>Ingen tidligere møter</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {past.map((m) => <MeetingRow key={m.id} meeting={m} onDelete={deleteMeeting} onToggle={toggleStatus} deleting={deleting} />)}
        </div>
      )}
    </div>
  );
}

function MeetingRow({ meeting, onDelete, onToggle, deleting }: {
  meeting: AdminMeeting;
  onDelete: (id: number) => void;
  onToggle: (m: AdminMeeting) => void;
  deleting: number | null;
}) {
  const isPast = meeting.status === "past";
  return (
    <div style={{ ...card, display: "flex", alignItems: "center", gap: 12, opacity: isPast ? 0.7 : 1 }}>
      <div style={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
        background: isPast ? "var(--ink-3)" : "var(--accent)",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{meeting.titleNo}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
          {meeting.dateNo} · {meeting.time} · {meeting.online ? "Videomøte" : "Fysisk"}
        </div>
      </div>
      <button
        onClick={() => onToggle(meeting)}
        style={{ ...ghostBtn, fontSize: 12, padding: "4px 10px" }}
      >
        {isPast ? "Merk kommende" : "Merk fullført"}
      </button>
      <button
        onClick={() => onDelete(meeting.id)}
        disabled={deleting === meeting.id}
        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--err)", fontSize: 18, lineHeight: 1, padding: "2px 4px" }}
        title="Slett"
      >
        {deleting === meeting.id ? "…" : "×"}
      </button>
    </div>
  );
}

const backBtn: React.CSSProperties = { fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" };
const sectionTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 };
const card: React.CSSProperties = { padding: "14px 18px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)" };
const primaryBtn: React.CSSProperties = { padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 13, cursor: "pointer" };
const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5 };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--ink-3)" };
const inputStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", fontSize: 14, color: "var(--ink)", outline: "none" };
