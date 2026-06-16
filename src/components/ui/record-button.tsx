"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "@/components/ui/icon";

// ─── Web Speech API types (not in TS stdlib) ──────────────────────────────────
interface SREvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [i: number]: { isFinal: boolean; [j: number]: { transcript: string } };
  };
}
interface SRInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((ev: SREvent) => void) | null;
  onerror: ((ev: Event) => void) | null;
  onend: (() => void) | null;
}
type SRConstructor = new () => SRInstance;

function getSR(): SRConstructor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as Record<string, unknown>;
  return (w["SpeechRecognition"] || w["webkitSpeechRecognition"]) as SRConstructor | null ?? null;
}

// ─── Types ────────────────────────────────────────────────────────────────────
type RecordState = "idle" | "recording" | "email-prompt" | "processing" | "done" | "error" | "unsupported";

export interface MeetingSummary {
  keyPoints: string[];
  decisions: string[];
  actionItems: Array<{ task: string; owner: string; due: string }>;
  nextSteps: string;
}

export interface RecordButtonProps {
  meetingTitle: string;
  meetingDate: string;
  projectName: string;
  pmName: string;
  pmEmail: string;
  buyerName: string;
  locale: string;
}

// ─── Live timer ───────────────────────────────────────────────────────────────
function useTimer(active: boolean) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!active) { setS(0); return; }
    const id = setInterval(() => setS((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export function RecordButton({
  meetingTitle, meetingDate, projectName,
  pmName, pmEmail, buyerName, locale,
}: RecordButtonProps) {
  const isNb = locale !== "en";
  const [state, setState] = useState<RecordState>("idle");
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const srRef = useRef<SRInstance | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef("");
  const timer = useTimer(state === "recording");

  useEffect(() => { if (!getSR()) setState("unsupported"); }, []);

  useEffect(() => {
    if (boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight;
  }, [finalText, interim]);

  const startRecording = useCallback(() => {
    const SR = getSR();
    if (!SR) return;
    setFinalText(""); setInterim(""); setSummary(null); setErrMsg(""); liveRef.current = "";

    const sr = new SR();
    sr.continuous = true;
    sr.interimResults = true;
    sr.lang = isNb ? "nb-NO" : "en-US";

    let accumulatedFinal = "";
    sr.onresult = (ev) => {
      let fin = "", int = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        ev.results[i].isFinal ? (fin += t + " ") : (int += t);
      }
      if (fin) {
        accumulatedFinal += fin;
        setFinalText(accumulatedFinal);
      }
      setInterim(int);
      liveRef.current = accumulatedFinal + int;
    };

    sr.onerror = () => {
      setState("error");
      setErrMsg(isNb ? "Mikrofontilgang nektet eller mistet." : "Microphone access denied or lost.");
    };

    sr.onend = () => {
      setState((cur) => {
        if (cur === "recording") {
          try { sr.start(); } catch { /* stopped by user */ }
        }
        return cur;
      });
    };

    srRef.current = sr;
    sr.start();
    setState("recording");
  }, [isNb]);

  // Stop recording → show email prompt
  const stopRecording = useCallback(() => {
    if (srRef.current) {
      srRef.current.onend = null;
      srRef.current.stop();
      srRef.current = null;
    }
    setInterim("");

    const transcript = liveRef.current.trim();
    if (transcript.length < 20) {
      setState("error");
      setErrMsg(isNb ? "For lite tale ble registrert — prøv igjen." : "Too little speech captured — please try again.");
      return;
    }

    setEmailInput(pmEmail); // pre-fill with PM's email
    setState("email-prompt");
  }, [isNb, pmEmail]);

  // Submit with chosen email
  const submitWithEmail = useCallback(async (toEmail: string) => {
    setState("processing");
    const transcript = liveRef.current.trim();
    try {
      const res = await fetch("/api/meeting/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, meetingTitle, meetingDate, projectName, pmName, pmEmail: toEmail, buyerName, locale }),
      });
      const data = await res.json().catch(() => ({})) as Record<string, string>;
      if (!res.ok) {
        const detail = data.detail || data.error || `HTTP ${res.status}`;
        throw new Error(detail);
      }
      setSummary((data as unknown as { summary: MeetingSummary }).summary);
      setState("done");
    } catch (e) {
      setState("error");
      const msg = e instanceof Error ? e.message : String(e);
      setErrMsg(msg.length < 140 ? msg : (isNb ? "Noe gikk galt — sjekk konsollen for detaljer." : "Something went wrong — check browser console."));
      console.error("[RecordButton]", e);
    }
  }, [meetingTitle, meetingDate, projectName, pmName, buyerName, locale, isNb]);

  const reset = () => {
    setState("idle");
    setFinalText(""); setInterim(""); setSummary(null); setErrMsg(""); setEmailInput(""); liveRef.current = "";
  };

  // ── Unsupported ──────────────────────────────────────────────────────────────
  if (state === "unsupported") {
    return (
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 9, background: "var(--surface-2)", border: "1px solid var(--line)", fontSize: 12.5, color: "var(--ink-3)", marginTop: 6 }}>
        <Icon name="camera" size={14} />
        {isNb ? "AI referat krever Chrome/Edge" : "AI summary requires Chrome/Edge"}
      </div>
    );
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (state === "done" && summary) {
    return (
      <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "var(--good-soft)", borderBottom: "1px solid var(--line)" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--good)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon name="check" size={13} style={{ color: "#fff" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--good)" }}>
              {isNb ? "Referat sendt til" : "Summary sent to"} {pmName}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{emailInput || pmEmail}</div>
          </div>
          <button onClick={reset} style={{ fontSize: 12, color: "var(--ink-3)", padding: "4px 10px", borderRadius: 7, border: "1px solid var(--line)", background: "var(--surface)", cursor: "pointer" }}>
            {isNb ? "Nytt" : "New"}
          </button>
        </div>
        <div style={{ padding: "12px 14px", background: "var(--surface)" }}>
          {summary.keyPoints.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--ink-3)", marginBottom: 5 }}>
                {isNb ? "Hovedpunkter" : "Key points"}
              </div>
              {summary.keyPoints.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 7, fontSize: 13, color: "var(--ink-2)", marginBottom: 3, lineHeight: 1.4 }}>
                  <span style={{ color: "var(--accent)", flexShrink: 0 }}>·</span>{p}
                </div>
              ))}
            </div>
          )}
          {summary.actionItems.length > 0 && (
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".07em", color: "var(--ink-3)", marginBottom: 5 }}>
                {isNb ? "Oppgaver" : "Action items"}
              </div>
              {summary.actionItems.map((ai, i) => (
                <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, padding: "5px 9px", background: "var(--surface-2)", borderRadius: 7, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 600, flex: 1, minWidth: 120 }}>{ai.task}</span>
                  <span style={{ color: "var(--ink-3)" }}>{ai.owner}</span>
                  {ai.due && <span style={{ color: "var(--ink-3)" }}>· {ai.due}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Email prompt ─────────────────────────────────────────────────────────────
  if (state === "email-prompt") {
    return (
      <div style={{ marginTop: 12, border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "13px 16px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)" }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)", marginBottom: 3 }}>
            {isNb ? "Send referat til" : "Send summary to"}
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
            {isNb ? "Endre e-post om nødvendig" : "Change email if needed"}
          </div>
        </div>
        <div style={{ padding: "14px 16px", background: "var(--surface)", display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            autoFocus
            placeholder="e.g. you@example.com"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "9px 12px", borderRadius: 8,
              border: "1.5px solid var(--line)", background: "var(--surface)",
              fontSize: 14, color: "var(--ink)", outline: "none",
              fontFamily: "inherit",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--line)"; }}
            onKeyDown={(e) => { if (e.key === "Enter" && emailInput.includes("@")) submitWithEmail(emailInput); }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => submitWithEmail(emailInput)}
              disabled={!emailInput.includes("@")}
              style={{
                flex: 1, padding: "8px 14px", borderRadius: 8, border: "none",
                background: emailInput.includes("@") ? "var(--accent)" : "var(--surface-2)",
                color: emailInput.includes("@") ? "#fff" : "var(--ink-3)",
                fontSize: 13.5, fontWeight: 700, cursor: emailInput.includes("@") ? "pointer" : "default",
                transition: "background .15s, color .15s",
              }}
            >
              {isNb ? "Send referat" : "Send summary"}
            </button>
            <button
              onClick={reset}
              style={{ padding: "8px 13px", borderRadius: 8, border: "1px solid var(--line)", background: "var(--surface)", fontSize: 13, color: "var(--ink-3)", cursor: "pointer" }}
            >
              {isNb ? "Avbryt" : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Recording ─────────────────────────────────────────────────────────────────
  if (state === "recording") {
    return (
      <div style={{ marginTop: 12, border: "1.5px solid #fca5a5", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#fef2f2", borderBottom: "1px solid #fca5a5" }}>
          <span style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444", animation: "krPulse 1.3s ease-out infinite" }} />
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#ef4444" }} />
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>
            {isNb ? "Spiller inn" : "Recording"}
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 13.5, fontWeight: 700, color: "#dc2626", marginLeft: "auto" }}>{timer}</span>
          <button
            onClick={stopRecording}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 8, background: "#ef4444", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}
          >
            <Icon name="x" size={13} />
            {isNb ? "Stopp & send" : "Stop & send"}
          </button>
        </div>
        <div
          ref={boxRef}
          style={{ maxHeight: 140, overflowY: "auto", padding: "10px 14px", background: "#fff", fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-2)" }}
        >
          {finalText || interim
            ? <>{finalText}<span style={{ color: "var(--ink-3)" }}>{interim}</span></>
            : <span style={{ color: "var(--ink-3)", fontStyle: "italic" }}>{isNb ? "Snakk nå — teksten vises her i sanntid…" : "Speak now — text appears here in real-time…"}</span>
          }
        </div>
        <style>{`
          @keyframes krPulse {
            0% { transform:scale(1); opacity:.9; }
            70% { transform:scale(2.6); opacity:0; }
            100% { opacity:0; }
          }
        `}</style>
      </div>
    );
  }

  // ── Processing ───────────────────────────────────────────────────────────────
  if (state === "processing") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 10, background: "var(--surface)", border: "1px solid var(--line)", marginTop: 10 }}>
        <span style={{ width: 16, height: 16, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%", animation: "krSpin .6s linear infinite", flexShrink: 0 }} />
        <span style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
          {isNb ? "Analyserer med Claude AI…" : "Analysing with Claude AI…"}
        </span>
        <style>{`@keyframes krSpin { to { transform:rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (state === "error") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fca5a5", marginTop: 10 }}>
        <Icon name="x" size={15} style={{ color: "#dc2626", flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: "#dc2626", flex: 1 }}>{errMsg}</span>
        <button onClick={reset} style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>
          {isNb ? "Prøv igjen" : "Retry"}
        </button>
      </div>
    );
  }

  // ── Idle ─────────────────────────────────────────────────────────────────────
  return (
    <button
      onClick={startRecording}
      title={isNb ? "Start AI-drevet møtereferat" : "Start AI-powered meeting summary"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 7,
        padding: "7px 13px", borderRadius: 9, fontSize: 13, fontWeight: 600,
        background: "var(--surface)", border: "1.5px solid var(--line)",
        color: "var(--ink-2)", cursor: "pointer", marginTop: 6,
        transition: "border-color .15s, color .15s",
      }}
      onMouseEnter={(e) => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = "var(--accent)";
        b.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        const b = e.currentTarget as HTMLButtonElement;
        b.style.borderColor = "var(--line)";
        b.style.color = "var(--ink-2)";
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
      {isNb ? "AI referat" : "AI summary"}
    </button>
  );
}
