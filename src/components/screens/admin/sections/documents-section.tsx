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
const SIGNED_OPTS = [
  { value: "null",  label: "Ikke relevant" },
  { value: "false", label: "Trenger signering" },
  { value: "true",  label: "Signert" },
];

function isImage(url: string) {
  return /\.(jpe?g|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}
function isPdf(url: string) {
  return /\.pdf(\?.*)?$/i.test(url);
}
function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function catLabel(cat: string) {
  return CATS.find((c) => c.value === cat)?.labelNo ?? cat;
}
function signedToStr(s: boolean | null): string {
  return s === true ? "true" : s === false ? "false" : "null";
}
function strToSigned(s: string): boolean | null {
  return s === "true" ? true : s === "false" ? false : null;
}

// ── Upload helper ────────────────────────────────────────────────────────────
async function uploadFile(file: File): Promise<{ url: string; size: string } | null> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) return null;
  const data: { url: string } = await res.json();
  return { url: data.url, size: formatBytes(file.size) };
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FileChip({ url, onClick }: { url: string; onClick?: () => void }) {
  if (isImage(url)) {
    return (
      <img
        src={url} alt=""
        onClick={onClick}
        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, border: "1px solid var(--line)", cursor: onClick ? "zoom-in" : "default", flexShrink: 0 }}
      />
    );
  }
  if (isPdf(url)) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ width: 48, height: 48, borderRadius: 6, background: "#fee2e2", display: "grid", placeItems: "center", flexShrink: 0, textDecoration: "none", fontSize: 10, fontWeight: 700, color: "#dc2626" }}
      >
        PDF
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ width: 48, height: 48, borderRadius: 6, background: "var(--surface-2)", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 20, textDecoration: "none" }}
    >
      📄
    </a>
  );
}

function NoFileChip() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 6, border: "2px dashed var(--line)", display: "grid", placeItems: "center", flexShrink: 0, color: "var(--ink-3)", fontSize: 20 }}>
      +
    </div>
  );
}

function SignedBadge({ signed }: { signed: boolean | null }) {
  if (signed === true)  return <span style={badge("var(--good-soft)", "var(--good)")}>✓ Signert</span>;
  if (signed === false) return <span style={badge("#fef9c3", "#ca8a04")}>⚠ Signering</span>;
  return null;
}

function UploadZone({ onFile, preview, fileName, onClear }: {
  onFile: (f: File) => void;
  preview: string | null;
  fileName: string | null;
  onClear: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        style={{
          border: "2px dashed var(--line)", borderRadius: 10, padding: fileName ? "10px 14px" : "18px 14px",
          cursor: "pointer", background: "var(--surface)", textAlign: "center", transition: "border-color .15s",
        }}
      >
        {fileName ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {preview
              ? <img src={preview} alt="" style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
              : <span style={{ fontSize: 28, flexShrink: 0 }}>📄</span>
            }
            <div style={{ textAlign: "left", flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{fileName}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Klar til opplasting</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onClear(); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", fontSize: 18 }}>×</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 24, marginBottom: 4 }}>📎</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-2)" }}>Klikk eller dra fil hit</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>PDF, JPG, PNG — maks 20 MB</div>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.docx"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        style={{ display: "none" }} />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const EMPTY_NEW = { nameNo: "", nameEn: "", cat: "contract", signed: "null" };

export function DocumentsSection({ buyerId, documents: initial, onBack: _onBack, onSaved }: DocumentsSectionProps) {
  const [docs, setDocs]           = useState<AdminDocument[]>(initial);
  const [showAdd, setShowAdd]     = useState(false);
  const [newForm, setNewForm]     = useState(EMPTY_NEW);
  const [newFile, setNewFile]     = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);
  const [adding, setAdding]       = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lightbox, setLightbox]   = useState<string | null>(null);

  // Per-row edit state
  const [editId, setEditId]       = useState<number | null>(null);
  const [editForm, setEditForm]   = useState<{ nameNo: string; nameEn: string; cat: string; signed: string }>({ nameNo: "", nameEn: "", cat: "contract", signed: "null" });
  const [editFile, setEditFile]   = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState<number | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  function pickFile(f: File, setFile: (f: File) => void, setPreview: (s: string | null) => void) {
    setFile(f);
    if (isImage(f.name)) {
      const r = new FileReader();
      r.onload = (ev) => setPreview(ev.target?.result as string);
      r.readAsDataURL(f);
    } else setPreview(null);
  }

  function startEdit(doc: AdminDocument) {
    setEditId(doc.id);
    setEditForm({ nameNo: doc.nameNo, nameEn: doc.nameEn, cat: doc.cat, signed: signedToStr(doc.signed) });
    setEditFile(null);
    setEditPreview(null);
  }

  // ── Add new document ───────────────────────────────────────────────────────
  async function addDoc() {
    if (!newForm.nameNo) return;
    setAdding(true);
    setUploadError(null);
    let fileUrl: string | undefined, size = "—";
    if (newFile) {
      const up = await uploadFile(newFile);
      if (!up) {
        setUploadError("Filen ble ikke lastet opp. Sjekk at Vercel Blob er aktivert i prosjektinnstillingene dine, eller fjern filen og lagre uten.");
        setAdding(false);
        return;
      }
      fileUrl = up.url; size = up.size;
    }
    const res = await fetch("/api/admin/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId, ...newForm, nameEn: newForm.nameEn || newForm.nameNo, signed: strToSigned(newForm.signed), fileUrl, size }),
    });
    setAdding(false);
    if (res.ok) {
      const d: AdminDocument = await res.json();
      setDocs((prev) => [...prev, d]);
      setNewForm(EMPTY_NEW); setNewFile(null); setNewPreview(null); setShowAdd(false);
      onSaved();
    }
  }

  // ── Save edits ─────────────────────────────────────────────────────────────
  async function saveEdit(doc: AdminDocument) {
    setSaving(true);
    setUploadError(null);
    let fileUrl = doc.fileUrl;
    let size = doc.size;
    if (editFile) {
      const up = await uploadFile(editFile);
      if (!up) {
        setUploadError("Filen ble ikke lastet opp. Sjekk Vercel Blob-konfigurasjonen.");
        setSaving(false);
        return;
      }
      fileUrl = up.url; size = up.size;
    }
    const res = await fetch(`/api/admin/documents/${doc.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameNo: editForm.nameNo, nameEn: editForm.nameEn || editForm.nameNo, cat: editForm.cat, signed: strToSigned(editForm.signed), fileUrl, size }),
    });
    setSaving(false);
    if (res.ok) {
      const updated: AdminDocument = await res.json();
      setDocs((prev) => prev.map((d) => d.id === updated.id ? updated : d));
      setEditId(null); setEditFile(null); setEditPreview(null);
      onSaved();
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteDoc(id: number) {
    if (!confirm("Slett dette dokumentet?")) return;
    setDeleting(id);
    await fetch(`/api/admin/documents/${id}`, { method: "DELETE" });
    setDocs((prev) => prev.filter((d) => d.id !== id));
    setDeleting(null);
    onSaved();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.88)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 10, boxShadow: "0 32px 80px rgba(0,0,0,.6)" }} onClick={(e) => e.stopPropagation()} />
          <button onClick={() => setLightbox(null)} style={{ position: "fixed", top: 20, right: 24, background: "rgba(255,255,255,.15)", border: "none", color: "#fff", fontSize: 20, width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "grid", placeItems: "center" }}>×</button>
          <a href={lightbox} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", padding: "8px 20px", borderRadius: 20, background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.25)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
            Åpne i ny fane ↗
          </a>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <h2 style={{ ...sectionTitle, margin: 0 }}>Dokumenter</h2>
        <span style={{ fontSize: 13, color: "var(--ink-3)" }}>({docs.length})</span>
        <button onClick={() => { setShowAdd((v) => !v); setEditId(null); setUploadError(null); }} style={{ marginLeft: "auto", ...primaryBtn }}>
          {showAdd ? "Avbryt" : "+ Last opp dokument"}
        </button>
      </div>

      {/* Upload error banner */}
      {uploadError && (
        <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 9, background: "#fef2f2", border: "1px solid #fca5a5", fontSize: 13, color: "#dc2626", display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ flexShrink: 0 }}>⚠</span>
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16 }}>×</button>
        </div>
      )}

      {/* ── ADD FORM ── */}
      {showAdd && (
        <div style={{ ...card, marginBottom: 20, border: "1px solid var(--accent)", background: "var(--accent-soft)" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: "var(--ink)" }}>Nytt dokument</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={fw}>
              <label style={lbl}>Navn (norsk)</label>
              <input value={newForm.nameNo} onChange={(e) => setNewForm({ ...newForm, nameNo: e.target.value })} placeholder="f.eks. Plantegning B7" style={inp} />
            </div>
            <div style={fw}>
              <label style={lbl}>Name (English)</label>
              <input value={newForm.nameEn} onChange={(e) => setNewForm({ ...newForm, nameEn: e.target.value })} placeholder="e.g. Floor plan B7" style={inp} />
            </div>
            <div style={fw}>
              <label style={lbl}>Kategori</label>
              <select value={newForm.cat} onChange={(e) => setNewForm({ ...newForm, cat: e.target.value })} style={inp}>
                {CATS.map((c) => <option key={c.value} value={c.value}>{c.labelNo}</option>)}
              </select>
            </div>
            <div style={fw}>
              <label style={lbl}>Signeringsstatus</label>
              <select value={newForm.signed} onChange={(e) => setNewForm({ ...newForm, signed: e.target.value })} style={inp}>
                {SIGNED_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>
          <div style={fw}>
            <label style={lbl}>Fil (valgfritt)</label>
            <UploadZone
              preview={newPreview}
              fileName={newFile?.name ?? null}
              onFile={(f) => { pickFile(f, setNewFile, setNewPreview); if (!newForm.nameNo) setNewForm((p) => ({ ...p, nameNo: f.name.replace(/\.[^.]+$/, "") })); }}
              onClear={() => { setNewFile(null); setNewPreview(null); }}
            />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addDoc} disabled={adding || !newForm.nameNo} style={primaryBtn}>
              {adding ? "Laster opp…" : "Legg til dokument"}
            </button>
            <button onClick={() => { setShowAdd(false); setNewFile(null); setNewPreview(null); setNewForm(EMPTY_NEW); }} style={ghostBtn}>Avbryt</button>
          </div>
        </div>
      )}

      {/* ── DOCUMENT LIST ── */}
      {docs.length === 0 ? (
        <div style={{ ...card, color: "var(--ink-3)", fontSize: 14, textAlign: "center", padding: "32px 20px" }}>
          Ingen dokumenter ennå. Klikk &ldquo;Last opp dokument&rdquo; for å starte.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
          {docs.map((doc, i) => {
            const isEditing = editId === doc.id;
            return (
              <div key={doc.id}>
                {/* ── Normal row ── */}
                {!isEditing && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 18px",
                    background: "var(--surface)",
                    borderBottom: i < docs.length - 1 ? "1px solid var(--line-2)" : "none",
                    opacity: doc.soon ? 0.55 : 1,
                  }}>
                    {/* File chip */}
                    {doc.fileUrl
                      ? <FileChip url={doc.fileUrl} onClick={isImage(doc.fileUrl) ? () => setLightbox(doc.fileUrl!) : undefined} />
                      : <NoFileChip />
                    }

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.nameNo}</div>
                      <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, display: "flex", gap: 8, alignItems: "center" }}>
                        <span>{catLabel(doc.cat)}</span>
                        <span>·</span>
                        <span>{doc.dateNo}</span>
                        {doc.size !== "—" && <><span>·</span><span>{doc.size}</span></>}
                        {doc.fileUrl
                          ? <span style={{ color: "var(--good)", fontWeight: 600 }}>✓ Fil lastet opp</span>
                          : <span style={{ color: "var(--ink-3)" }}>Ingen fil</span>
                        }
                      </div>
                    </div>

                    {/* Signed badge */}
                    <SignedBadge signed={doc.signed} />

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      {doc.fileUrl && (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, padding: "5px 10px", borderRadius: 6, border: "1px solid var(--line)", background: "var(--surface-2)", color: "var(--ink-2)", textDecoration: "none", fontWeight: 500 }}>
                          {isImage(doc.fileUrl) ? "Forstørr" : "Åpne"}
                        </a>
                      )}
                      <button onClick={() => startEdit(doc)} style={iconBtn} title="Rediger">✏️</button>
                      <button onClick={() => deleteDoc(doc.id)} disabled={deleting === doc.id}
                        style={{ ...iconBtn, color: "var(--err, #dc2626)" }} title="Slett">
                        {deleting === doc.id ? "…" : "🗑"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Inline edit row ── */}
                {isEditing && (
                  <div style={{ padding: "16px 18px", background: "var(--surface)", borderBottom: i < docs.length - 1 ? "1px solid var(--line-2)" : "none", borderLeft: "3px solid var(--accent)" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "var(--accent)", marginBottom: 12 }}>Redigerer: {doc.nameNo}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                      <div style={fw}>
                        <label style={lbl}>Navn (norsk)</label>
                        <input value={editForm.nameNo} onChange={(e) => setEditForm({ ...editForm, nameNo: e.target.value })} style={inp} />
                      </div>
                      <div style={fw}>
                        <label style={lbl}>Name (English)</label>
                        <input value={editForm.nameEn} onChange={(e) => setEditForm({ ...editForm, nameEn: e.target.value })} style={inp} />
                      </div>
                      <div style={fw}>
                        <label style={lbl}>Kategori</label>
                        <select value={editForm.cat} onChange={(e) => setEditForm({ ...editForm, cat: e.target.value })} style={inp}>
                          {CATS.map((c) => <option key={c.value} value={c.value}>{c.labelNo}</option>)}
                        </select>
                      </div>
                      <div style={fw}>
                        <label style={lbl}>Signeringsstatus</label>
                        <select value={editForm.signed} onChange={(e) => setEditForm({ ...editForm, signed: e.target.value })} style={inp}>
                          {SIGNED_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Current file + replace */}
                    <div style={{ marginBottom: 14 }}>
                      <label style={lbl}>Fil</label>
                      {doc.fileUrl && !editFile && (
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, padding: "8px 12px", borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--line)" }}>
                          {isImage(doc.fileUrl) && <img src={doc.fileUrl} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4 }} />}
                          {isPdf(doc.fileUrl) && <span style={{ fontSize: 22 }}>📄</span>}
                          <div style={{ flex: 1, fontSize: 12, color: "var(--ink-2)" }}>Nåværende fil lastet opp{doc.size !== "—" ? ` · ${doc.size}` : ""}</div>
                          <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>Åpne ↗</a>
                        </div>
                      )}
                      <UploadZone
                        preview={editPreview}
                        fileName={editFile?.name ?? null}
                        onFile={(f) => pickFile(f, setEditFile, setEditPreview)}
                        onClear={() => { setEditFile(null); setEditPreview(null); }}
                      />
                      {!doc.fileUrl && !editFile && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>Dra en fil hit for å laste opp</div>}
                    </div>

                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => saveEdit(doc)} disabled={saving} style={primaryBtn}>{saving ? "Lagrer…" : "Lagre endringer"}</button>
                      <button onClick={() => { setEditId(null); setEditFile(null); setEditPreview(null); }} style={ghostBtn}>Avbryt</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
function badge(bg: string, color: string): React.CSSProperties {
  return { padding: "3px 8px", borderRadius: 6, background: bg, color, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" };
}
const backBtn:    React.CSSProperties = { fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" };
const sectionTitle: React.CSSProperties = { fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0 };
const card:       React.CSSProperties = { padding: "18px 20px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)" };
const primaryBtn: React.CSSProperties = { padding: "8px 18px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const ghostBtn:   React.CSSProperties = { padding: "6px 14px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface-2)", color: "var(--ink-2)", fontSize: 13, cursor: "pointer" };
const iconBtn:    React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "4px 6px", borderRadius: 6 };
const fw:         React.CSSProperties = { display: "flex", flexDirection: "column", gap: 4 };
const lbl:        React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".04em" };
const inp:        React.CSSProperties = { padding: "7px 10px", borderRadius: 7, border: "1px solid var(--line)", background: "var(--surface)", fontSize: 13.5, color: "var(--ink)", outline: "none" };
