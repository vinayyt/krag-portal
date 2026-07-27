"use client";

import React, { useState, useRef } from "react";
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

function isImage(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentsSection({ buyerId, documents: initial, onBack, onSaved }: DocumentsSectionProps) {
  const [documents, setDocuments] = useState<AdminDocument[]>(initial);
  const [form, setForm] = useState(EMPTY_FORM);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f && isImage(f.name)) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
    // Auto-fill name from filename (strip extension)
    if (f && !form.nameNo) {
      setForm((prev) => ({ ...prev, nameNo: f.name.replace(/\.[^.]+$/, "") }));
    }
  }

  async function addDocument() {
    if (!form.nameNo) return;
    setAdding(true);

    let fileUrl: string | undefined;
    let size = "—";

    // Upload file first if selected
    if (file) {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const upRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      setUploading(false);
      if (upRes.ok) {
        const data: { url: string } = await upRes.json();
        fileUrl = data.url;
        size = formatBytes(file.size);
      }
    }

    const signed = form.signed === "true" ? true : form.signed === "false" ? false : null;
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyerId,
        nameNo: form.nameNo,
        nameEn: form.nameEn || form.nameNo,
        cat: form.cat,
        signed,
        fileUrl,
        size,
      }),
    });
    setAdding(false);

    if (res.ok) {
      const doc: AdminDocument = await res.json();
      setDocuments((prev) => [...prev, doc]);
      setForm(EMPTY_FORM);
      setFile(null);
      setFilePreview(null);
      if (fileRef.current) fileRef.current.value = "";
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
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            alt="Forstørret visning"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 24px 64px rgba(0,0,0,.5)" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,.15)", border: "none",
              color: "#fff", fontSize: 22, width: 40, height: 40, borderRadius: "50%", cursor: "pointer",
              display: "grid", placeItems: "center",
            }}
          >×</button>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={backBtn}>← Tilbake</button>
        <h2 style={sectionTitle}>Dokumenter</h2>
        <button onClick={() => setShowForm((v) => !v)} style={{ marginLeft: "auto", ...primaryBtn }}>
          + Legg til
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

          {/* File upload zone */}
          <div style={{ marginTop: 14 }}>
            <label style={label}>Fil (valgfritt — PDF, bilde)</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) {
                  setFile(f);
                  if (isImage(f.name)) {
                    const reader = new FileReader();
                    reader.onload = (ev) => setFilePreview(ev.target?.result as string);
                    reader.readAsDataURL(f);
                  } else setFilePreview(null);
                  if (!form.nameNo) setForm((prev) => ({ ...prev, nameNo: f.name.replace(/\.[^.]+$/, "") }));
                }
              }}
              style={{
                marginTop: 6, border: "2px dashed var(--line)", borderRadius: 10,
                padding: file ? "12px 16px" : "24px 16px",
                textAlign: "center", cursor: "pointer", background: "var(--surface)",
                transition: "border-color .15s",
              }}
            >
              {file ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {filePreview ? (
                    <img src={filePreview} alt="" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 48, height: 48, borderRadius: 6, background: "var(--surface-2)", display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>📄</div>
                  )}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{formatBytes(file.size)}</div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setFilePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                    style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 18 }}
                  >×</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📎</div>
                  <div style={{ fontSize: 13.5, color: "var(--ink-2)", fontWeight: 500 }}>Klikk eller dra fil hit</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>PDF, JPG, PNG, maks 20 MB</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx" onChange={handleFileChange} style={{ display: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addDocument} disabled={adding || uploading || !form.nameNo} style={primaryBtn}>
              {uploading ? "Laster opp fil…" : adding ? "Legger til…" : "Legg til"}
            </button>
            <button onClick={() => { setShowForm(false); setFile(null); setFilePreview(null); }} style={ghostBtn}>Avbryt</button>
          </div>
        </div>
      )}

      {/* Document list */}
      <div style={{ borderRadius: 12, border: "1px solid var(--line)", overflow: "hidden" }}>
        {documents.length === 0 ? (
          <div style={{ padding: "20px", color: "var(--ink-3)", fontSize: 14 }}>Ingen dokumenter ennå.</div>
        ) : (
          documents.map((doc, i) => {
            const hasImage = doc.fileUrl && isImage(doc.fileUrl);
            const hasFile = !!doc.fileUrl;
            return (
              <div
                key={doc.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 18px",
                  background: "var(--surface)",
                  borderBottom: i < documents.length - 1 ? "1px solid var(--line-2)" : "none",
                }}
              >
                {/* Thumbnail or icon */}
                {hasImage ? (
                  <img
                    src={doc.fileUrl!}
                    alt={doc.nameNo}
                    onClick={() => setLightbox(doc.fileUrl!)}
                    style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0, cursor: "zoom-in", border: "1px solid var(--line)" }}
                  />
                ) : (
                  <div style={{
                    width: 48, height: 48, borderRadius: 6, background: "var(--surface-2)",
                    display: "grid", placeItems: "center", flexShrink: 0, fontSize: 22,
                  }}>
                    {hasFile ? "📄" : "🗋"}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.nameNo}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                    {catLabel(doc.cat)} · {doc.dateNo}{doc.size !== "—" ? ` · ${doc.size}` : ""}
                  </div>
                </div>

                <span style={{ fontSize: 12, fontWeight: 600, color: signedColor(doc.signed), flexShrink: 0 }}>
                  {signedLabel(doc.signed)}
                </span>

                {hasFile && (
                  <a
                    href={doc.fileUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600, textDecoration: "none", flexShrink: 0 }}
                  >
                    {hasImage ? "Forstørr" : "Åpne"}
                  </a>
                )}
              </div>
            );
          })
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
