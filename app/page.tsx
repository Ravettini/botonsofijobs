"use client";

import { useCallback, useRef, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { N8nResponse } from "@/lib/types";

type RunStatus = "idle" | "running" | "success" | "error";

const DRIVE_FOLDER_NAME =
  (process.env.NEXT_PUBLIC_DRIVE_FOLDER_NAME ?? "").trim() || "Carpeta de CVs";
const DRIVE_FOLDER_URL =
  (process.env.NEXT_PUBLIC_DRIVE_FOLDER_URL ?? "").trim();

export default function Home() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const abortRef = useRef<AbortController | null>(null);

  const runFlow = useCallback(async () => {
    const token = process.env.NEXT_PUBLIC_RUN_TOKEN;
    if (!token) {
      setStatus("error");
      return;
    }

    abortRef.current = new AbortController();
    setStatus("running");

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-run-token": token,
        },
        body: JSON.stringify({}),
        signal: abortRef.current.signal,
      });

      const data = (await res.json()) as N8nResponse;
      const ok = res.ok && data?.ok !== false;

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus(ok ? "success" : "error");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const stopFlow = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
          Generador de CVs
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Generá los CVs y revisalos en la carpeta compartida.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={runFlow}
            disabled={status === "running"}
            className="flex-1 rounded-xl bg-pink-200 py-4 text-xl font-semibold text-gray-800 hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-60 sm:py-5"
          >
            GENERAR CVs
          </button>
          {status === "running" && (
            <button
              type="button"
              onClick={stopFlow}
              className="rounded-xl border-2 border-error-soft bg-white py-4 px-6 text-xl font-semibold text-error-soft-text hover:bg-error-soft sm:py-5"
            >
              Detener ejecución
            </button>
          )}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
        </div>

        {status === "error" && (
          <button
            type="button"
            onClick={runFlow}
            className="rounded-lg bg-pink-200 px-4 py-2 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Reintentar
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-base text-gray-700">
          📁 Los CVs se guardan automáticamente en Google Drive.
        </p>
        <p className="mt-1 text-base text-gray-700">
          Abrí la carpeta: <strong>{DRIVE_FOLDER_NAME}</strong>
        </p>
        {DRIVE_FOLDER_URL.trim() !== "" && (
          <a
            href={DRIVE_FOLDER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-xl bg-pink-200 px-5 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Abrir carpeta
          </a>
        )}
      </section>
    </main>
  );
}
