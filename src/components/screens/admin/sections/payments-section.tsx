"use client";

import React, { useState } from "react";
import type { AdminPayment } from "@/lib/admin-data";

interface PaymentsSectionProps {
  payments: AdminPayment[];
  onBack: () => void;
  onSaved: () => void;
}

function fmtNOK(n: number) {
  return new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(n);
}

export function PaymentsSection({ payments: initial, onBack, onSaved }: PaymentsSectionProps) {
  const [payments, setPayments] = useState<AdminPayment[]>(initial);
  const [toggling, setToggling] = useState<number | null>(null);

  async function toggle(payment: AdminPayment) {
    setToggling(payment.id);
    const newStatus = payment.status === "paid" ? "upcoming" : "paid";
    const res = await fetch(`/api/admin/payments/${payment.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setToggling(null);
    if (res.ok) {
      setPayments((prev) => prev.map((p) => p.id === payment.id ? { ...p, status: newStatus } : p));
      onSaved();
    }
  }

  const paid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button onClick={onBack} style={backBtn}>← Tilbake</button>
        <h2 style={sectionTitle}>Betalinger</h2>
      </div>

      {/* Summary bar */}
      <div style={{ display: "flex", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Totalt</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--ink)" }}>{fmtNOK(total)}</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Betalt</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--good)" }}>{fmtNOK(paid)}</div>
        </div>
        <div style={statCard}>
          <div style={{ fontSize: 12, color: "var(--ink-3)", marginBottom: 4 }}>Gjenstår</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--warn)" }}>{fmtNOK(total - paid)}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {payments.map((payment) => {
          const isPaid = payment.status === "paid";
          return (
            <div key={payment.id} style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}>
              {/* Status dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                background: isPaid ? "var(--good)" : "var(--warn)",
              }} />

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)" }}>{payment.labelNo}</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  {payment.pct} · Forfall: {payment.dateNo}
                </div>
              </div>

              {/* Amount */}
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", flexShrink: 0 }}>
                {fmtNOK(payment.amount)}
              </div>

              {/* Toggle button */}
              <button
                onClick={() => toggle(payment)}
                disabled={toggling === payment.id}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", flexShrink: 0, transition: "background .15s",
                  background: isPaid ? "var(--surface-2)" : "var(--good)",
                  color: isPaid ? "var(--ink-3)" : "#fff",
                }}
              >
                {toggling === payment.id ? "…" : isPaid ? "Angre betalt" : "Merk som betalt"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const backBtn: React.CSSProperties = {
  fontSize: 13, color: "var(--ink-3)", background: "none", border: "none", cursor: "pointer", padding: "4px 0",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, color: "var(--ink)", margin: 0,
};
const card: React.CSSProperties = {
  padding: "14px 18px", borderRadius: 12, background: "var(--surface)", border: "1px solid var(--line)",
};
const statCard: React.CSSProperties = {
  padding: "14px 18px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)", minWidth: 120,
};
