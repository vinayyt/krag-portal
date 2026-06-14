import { NextRequest, NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ActionItem {
  task: string;
  owner: string;
  due: string;
}

interface Summary {
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
  nextSteps: string;
}

interface RequestBody {
  transcript: string;
  meetingTitle: string;
  meetingDate: string;
  projectName: string;
  pmName: string;
  pmEmail: string;
  buyerName: string;
  locale: string;
}

// ─── Anthropic REST call (no SDK needed) ─────────────────────────────────────
async function callClaude(system: string, userMessage: string): Promise<string> {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Anthropic API error ${resp.status}: ${err}`);
  }

  const data = await resp.json() as {
    content: Array<{ type: string; text: string }>;
  };
  return data.content[0]?.type === "text" ? data.content[0].text : "";
}

// ─── Resend REST call (no SDK needed) ────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const resp = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Use onboarding@resend.dev in dev (no domain verification needed).
      // In production replace with a verified sender: noreply@kraggruppen.no
      from: "Krag Portal <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Resend API error ${resp.status}: ${err}`);
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { transcript, meetingTitle, meetingDate, projectName, pmName, pmEmail, buyerName, locale } = body;

    if (!transcript || transcript.trim().length < 20) {
      return NextResponse.json({ error: "Transcript too short" }, { status: 400 });
    }

    // ── Step 1: Claude summarization ──────────────────────────────────────────
    const isNb = locale !== "en";
    const lang = isNb ? "Norwegian Bokmål" : "English";

    const rawText = await callClaude(
      `You are a professional meeting secretary for a Norwegian construction company.
You produce concise, structured meeting summaries from transcripts.
Always respond in ${lang}. Return ONLY valid JSON — no markdown fences, no preamble.`,
      `Summarise this project meeting transcript.

Meeting: ${meetingTitle}
Date: ${meetingDate}
Project: ${projectName}
Participants: ${buyerName} (homeowner), ${pmName} (project manager)

Transcript:
${transcript}

Return JSON matching this exact shape:
{
  "keyPoints": ["string", "string", "string"],
  "decisions": ["string"],
  "actionItems": [{"task": "string", "owner": "string", "due": "string"}],
  "nextSteps": "string"
}`
    );

    let summary: Summary;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      summary = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(rawText);
    } catch {
      summary = { keyPoints: [rawText.substring(0, 300)], decisions: [], actionItems: [], nextSteps: "" };
    }

    // ── Step 2: Build email HTML ───────────────────────────────────────────────
    const subject = isNb
      ? `Møtereferat: ${meetingTitle} – ${meetingDate}`
      : `Meeting summary: ${meetingTitle} – ${meetingDate}`;

    const actionRowsHtml = summary.actionItems.length > 0
      ? summary.actionItems.map((ai) =>
          `<tr style="border-bottom:1px solid #f1f5f9">
            <td style="padding:10px 12px;font-size:14px;color:#1e293b">${ai.task}</td>
            <td style="padding:10px 12px;font-size:14px;color:#64748b">${ai.owner}</td>
            <td style="padding:10px 12px;font-size:14px;color:#64748b">${ai.due || "—"}</td>
          </tr>`
        ).join("")
      : `<tr><td colspan="3" style="padding:12px;font-size:13px;color:#94a3b8;text-align:center">${isNb ? "Ingen oppgaver" : "No action items"}</td></tr>`;

    const decisionsHtml = summary.decisions.length > 0
      ? `<div style="background:#fefce8;border:1px solid #fef08a;border-radius:10px;padding:14px 18px;margin-bottom:24px">
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#a16207;margin-bottom:8px">${isNb ? "Beslutninger" : "Decisions"}</div>
          ${summary.decisions.map((d) => `<div style="font-size:14px;color:#374151;margin-bottom:5px">✓ &nbsp;${d}</div>`).join("")}
        </div>`
      : "";

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
<div style="max-width:600px;margin:0 auto;padding:32px 16px">
  <div style="background:linear-gradient(135deg,#23271f 0%,#1e221b 100%);border-radius:16px 16px 0 0;padding:28px 32px">
    <div style="font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#8d877a;margin-bottom:6px">Krag Gruppen</div>
    <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.02em">${meetingTitle}</div>
    <div style="font-size:13px;color:#a09880;margin-top:6px">${meetingDate} &nbsp;·&nbsp; ${projectName} &nbsp;·&nbsp; ${pmName}</div>
  </div>
  <div style="background:#fff;border-radius:0 0 16px 16px;padding:28px 32px;border:1px solid #e2e8f0;border-top:none">
    <div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px">${isNb ? "Hovedpunkter" : "Key points"}</div>
      ${summary.keyPoints.map((p) => `<div style="display:flex;gap:10px;margin-bottom:8px"><span style="color:#b35c28;font-size:18px;line-height:1.3;flex-shrink:0">·</span><span style="font-size:14px;color:#374151;line-height:1.6">${p}</span></div>`).join("")}
    </div>
    ${decisionsHtml}
    <div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px">${isNb ? "Oppgaver" : "Action items"}</div>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden">
        <tr style="background:#f8fafc">
          <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid #e2e8f0">${isNb ? "Oppgave" : "Task"}</th>
          <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid #e2e8f0">${isNb ? "Ansvarlig" : "Owner"}</th>
          <th style="padding:9px 12px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;border-bottom:1px solid #e2e8f0">${isNb ? "Frist" : "Due"}</th>
        </tr>
        ${actionRowsHtml}
      </table>
    </div>
    ${summary.nextSteps ? `<div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 18px;margin-bottom:24px"><div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#166534;margin-bottom:6px">${isNb ? "Videre" : "Next steps"}</div><div style="font-size:14px;color:#374151;line-height:1.6">${summary.nextSteps}</div></div>` : ""}
    <div style="border-top:1px solid #f1f5f9;padding-top:20px">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#94a3b8;margin-bottom:10px">${isNb ? "Fullt referat" : "Full transcript"}</div>
      <div style="background:#f8fafc;border-radius:8px;padding:16px;font-size:13px;color:#475569;line-height:1.7;white-space:pre-wrap">${transcript.substring(0, 1500)}${transcript.length > 1500 ? "\n…" : ""}</div>
    </div>
  </div>
  <p style="text-align:center;font-size:12px;color:#94a3b8;margin-top:20px">${isNb ? "Automatisk generert av Krag Portal · AI møtereferat" : "Auto-generated by Krag Portal · AI meeting summary"}</p>
</div>
</body></html>`;

    // ── Step 3: Send email ─────────────────────────────────────────────────────
    await sendEmail(pmEmail, subject, html);

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("[meeting/process]", err);
    return NextResponse.json({ error: "Processing failed", detail: String(err) }, { status: 500 });
  }
}
