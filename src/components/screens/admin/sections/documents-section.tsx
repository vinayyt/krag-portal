"use client";

import React, { useState } from "react";
import type { AdminDocument } from "@/lib/admin-data";

interface DocumentsSectionProps {
  buyerId: string;
  documents: AdminDocument[];
  onBack: () => void;
  onSaved: () => void;
}

const CATS = [
  { value: "contract", labelNo: "Kontrakt" },
  { value: "drawing",  labelNo: "Tegning"  },
  { value: "spec",     labelNo: "Spesifikasjon" },
];

const SIGNED_OPTIONS = [
  { value: "null",  labelNo: "Ikke relevant" },
  { value: "false", labelNo: "Trenger signering" },
  { value: "true",  labelNo: "Signert" },
];

const EMPTY_FORM = { nameNo: "", nameEn: "", cat: "contract", signed: "null" };

export function DocumentsSection({ buyerId, documents: initial, onBack, onSaved }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<AdminDocument[]>(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function addDocument() {
    if (!form.nameNo) return;
    setAdding(true);
    const signed =
      form.signed === "true" ? true : form.signed === "false" ? false : null;
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, nameNo: form.nameNo, nameEn: form.nameEn || form.nameNo, cat: form.cat, signed }),
    });
    setAdding(false);
    if (res.ok) {
      const doc: AdminDocument = await res.json();
      setDocuments((prev) => [...prev, doc]);
      setForm(EMPTY_FORM);
      setShowForm(false);
      onSaved();
    }
  }

  const catLabel = (cat: string) => CATS.find((c) => c.value === cat)?.labelNo ?? cat;
  const signedLabel = (s: boolean | null) =>
    s === true ? "Signert" : s === false ? "Trenger signering" : "—";
  const signedColor = (s: boolean | null) =>
    s === true ? "var(--good)" : s === false ? "var(--warn)" : "var(--ink-3)";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={backBtn}>← Tilbake</button>
        <h2 style={sectionTitle}>Dokumenter</h2>
        <button onClick={() => setShowForm((v) => !v)} style={{ marginLeft: "auto", ...primaryBtn }}>
          + Legg til dokument
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ ...card, marginBottom: 24, background: "var(--accent-soft)", border: "1px solid var(--accent)" }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: "var(--ink)" }}>Nytt dokument</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={fieldWrap}>
              <label style={label}>Navn (norsk)</label>
              <input value={form.nameNo} onChange={(e) => setForm({ ...form, nameNo: e.target.value })}
                placeholder="f.eks. Kontraktstillegg #1" style={inputStyle} />
            </div>
            <div style={fieldWrap}>
              <label style={label}>Name (English)</label>
              <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                placeholder="e.g. Contract addendum #1" style={inputStyle} />
            </div>
            <div style={fieldWrap}>
              <label style={label}>Kategori</label>
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} style={inputStyle}>
                {CATS.map((c) => <option key={c.value} value={c.value}>{c.labelNo}</option>)}
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={label}>Signeringsstatus</label>
              <select value={form.signed} onChange={(e) => setForm({ ...form, signed: e.target.value })} style={inputStyle}>
                {SIGNED_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.labelNo}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addDocument} disabled={adding || !form.nameNo} style={primaryBtn}>
              {adding ? "Legger til…" : "Legg til"}
            </button>
            <button onClick={() => setShowForm(false)} style={ghostBtn}>Avbryt</button>
          </div>
        </div>
      )}

      {/* Document list */}
      <div style={{ borderRadius: 12, border: "1px solid var(--line)", overflow: "hidden" }}>
        {documents.length === 0 ? (
          <div style={{ padding: "20px", color: "var(--ink-3)", fontSize: 14 }}>Ingen dokumenter ennå.</div>
        ) : (
          documents.map((doc, i) => (
            <div
              key={doc.id}
              style={{
                display: "flex", alignItems: "center", gap: 14, padding: "13px 18px",
                background: "var(--surface)",
                borderBottom: i < documents.length - 1 ? "1px solid var(--line-2)" : "none",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{doc.nameNo}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {catLabel(doc.cat)} · {doc.dateNo}
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: signedColor(doc.signed), flexShrink: 0 }}>
                {signedLabel(doc.signed)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const backBtn: React.CSSProperties = { fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" };
const sectionTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 };
const card: React.CSSProperties = { padding: "18px 20px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)" };
const primaryBtn: React.CSSProperties = { padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 13, cursor: "pointer" };
const fieldWrap: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 5 };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "var(--ink-3)" };
const inputStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", fontSize: 14, color: "var(--ink)", outline: "none" };
