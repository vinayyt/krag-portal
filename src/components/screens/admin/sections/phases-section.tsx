"use client";

import React, { useState } from "react";
import type { AdminPhase } from "@/lib/admin-data";

interface PhasesSectionProps {
  buyerId: string;
  phases: AdminPhase[];
  onBack: () => void;
  onSaved: () => void;
}

const STATUS_OPTIONS = ["upcoming", "active", "done"];

export function PhasesSection({ buyerId: _buyerId, phases: initial, onBack: _onBack, onSaved }: PhasesSectionProps) {
  const [phases, setPhases] = useState<AdminPhase[]>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function save(phase: AdminPhase) {
    setSaving(phase.id);
    const res = await fetch(`/api/admin/phases/${phase.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pct: phase.pct, status: phase.status }),
    });
    setSaving(null);
    if (res.ok) {
      setSaved(phase.id);
      setTimeout(() => setSaved(null), 2000);
      onSaved();
    }
  }

  function update(id: string, field: keyof AdminPhase, value: number | string) {
    setPhases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  }

  const statusColor: Record<string, string> = {
    done: "var(--good)",
    active: "var(--accent)",
    upcoming: "var(--ink-3)",
  };

  return (
    <div>
      <h2 style={sectionTitle}>Byggefremdrift</h2>
      <p style={{ fontSize: 14, color: "var(--ink-3)", marginBottom: 24 }}>
        Oppdater prosentandel og status for hver fase. Lagre endringer per rad.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {phases.map((phase) => (
          <div key={phase.id} style={card}>
            {/* Phase name + status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>{phase.nameNo}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{phase.dateNo}</div>
              </div>
              <select
                value={phase.status}
                onChange={(e) => update(phase.id, "status", e.target.value)}
                style={{ ...selectStyle, color: statusColor[phase.status] ?? "var(--ink)" }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s === "done" ? "Ferdig" : s === "active" ? "Aktiv" : "Kommende"}</option>
                ))}
              </select>
            </div>

            {/* Percent slider */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={phase.pct}
                onChange={(e) => update(phase.id, "pct", Number(e.target.value))}
                style={{ flex: 1, accentColor: "var(--accent)" }}
              />
              <input
                type="number"
                min={0}
                max={100}
                value={phase.pct}
                onChange={(e) => update(phase.id, "pct", Math.min(100, Math.max(0, Number(e.target.value))))}
                style={{ ...numInput }}
              />
              <span style={{ fontSize: 13, color: "var(--ink-3)", minWidth: 12 }}>%</span>
              <button
                onClick={() => save(phase)}
                disabled={saving === phase.id}
                style={{ ...saveBtn, background: saved === phase.id ? "var(--good)" : "var(--accent)" }}
              >
                {saving === phase.id ? "…" : saved === phase.id ? "Lagret ✓" : "Lagre"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const backBtn: React.CSSProperties = {
  fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0,
};
const card: React.CSSProperties = {
  padding: "18px 20px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)",
};
const selectStyle: React.CSSProperties = {
  padding: "5px 10px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface-2)",
  fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none",
};
const numInput: React.CSSProperties = {
  width: 56, padding: "5px 8px", borderRadius: 8, border: "1px solid var(--line)",
  background: "var(--surface-2)", fontSize: 14, fontWeight: 600, textAlign: "center",
  color: "var(--ink)", outline: "none",
};
const saveBtn: React.CSSProperties = {
  padding: "6px 16px", borderRadius: 8, border: "none", color: "#fff",
  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "background .2s", whiteSpace: "nowrap",
};
