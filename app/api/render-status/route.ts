import { NextResponse } from "next/server";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

const RENDER_URL = "https://sofijobsauto.onrender.com";
/** Timeout para comprobar si responde (si tarda más, mostramos dormido) */
const CHECK_TIMEOUT_MS = 15_000;

export async function GET() {
  try {
    const response = await fetchWithTimeout(
      RENDER_URL,
      { method: "GET" },
      CHECK_TIMEOUT_MS
    );
    // Cualquier respuesta (200, 404, 502, etc.) indica que el proceso está despierto
    return NextResponse.json(
      { status: "awake" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "asleep" },
      { status: 200 }
    );
  }
}
