import { NextRequest, NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

function getEnv(name: string): string | undefined {
  return process.env[name];
}

export async function POST(request: NextRequest) {
  const webhookUrl = getEnv("N8N_WEBHOOK_URL");
  const runTokenServer = getEnv("RUN_TOKEN_SERVER");

  if (!webhookUrl) {
    return NextResponse.json(
      { ok: false, message: "N8N_WEBHOOK_URL no configurada", drive: null, raw: null, error: {} },
      { status: 500 }
    );
  }

  const token = request.headers.get("x-run-token");
  if (!runTokenServer || token !== runTokenServer) {
    return NextResponse.json(
      { ok: false, message: "No autorizado", drive: null, raw: null, error: {} },
      { status: 401 }
    );
  }

  const triggeredAt = new Date().toISOString();
  const runId = `run-${Date.now()}`;

  let body: unknown = undefined;
  try {
    const contentType = request.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      body = await request.json();
    }
  } catch {
    // body opcional, ignorar si no es JSON
  }

  try {
    const response = await fetchWithTimeout(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // n8n devolvió no-JSON
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: `n8n respondió ${response.status}`,
          run_id: runId,
          triggered_at: triggeredAt,
          drive: null,
          raw: json,
          error: { status: response.status, body: text.slice(0, 500) },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(json ?? { ok: true, raw: text }, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error desconocido al llamar a n8n";

    return NextResponse.json(
      {
        ok: false,
        message,
        run_id: runId,
        triggered_at: triggeredAt,
        drive: null,
        raw: null,
        error: {},
      },
      { status: 500 }
    );
  }
}
