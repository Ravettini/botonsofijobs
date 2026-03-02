import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

const RENDER_URL = "https://sofijobsauto.onrender.com";
/** Render free tier puede tardar ~1 minuto en despertar */
const TIMEOUT_MS = 120_000;

export async function GET() {
  try {
    const response = await fetchWithTimeout(
      RENDER_URL,
      { method: "GET" },
      TIMEOUT_MS
    );
    return NextResponse.json(
      { ok: response.ok, status: response.status },
      { status: 200 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al despertar Render";
    return NextResponse.json(
      { ok: false, message },
      { status: 502 }
    );
  }
}
