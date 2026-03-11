"use client";

import { useCallback, useEffect, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { N8nResponse } from "@/lib/types";

type RunStatus = "idle" | "running" | "success" | "error";
type RenderStatus = "checking" | "awake" | "asleep";

const DRIVE_FOLDER_CVS =
  "https://drive.google.com/drive/folders/17G1rd3MBRIxgtzpSO1Z7yR3eW9UCEQ3R?usp=sharing";
const DRIVE_FOLDER_BORRADORES =
  "https://drive.google.com/drive/folders/1D-1nDl6rDxGc-80DeIyKCo1xqrfoP3O1?usp=sharing";

export default function Home() {
  const [status, setStatus] = useState<RunStatus>("idle");
  const [phase, setPhase] = useState<"waking" | "generating">("generating");
  const [wakeError, setWakeError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("checking");

  const checkRenderStatus = useCallback(() => {
    setRenderStatus("checking");
    fetch("/api/render-status", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.status === "awake" || data?.status === "asleep") {
          setRenderStatus(data.status);
        }
      })
      .catch(() => setRenderStatus("asleep"));
  }, []);

  useEffect(() => {
    checkRenderStatus();
  }, [checkRenderStatus]);

  const runFlow = useCallback(async () => {
    const token = process.env.NEXT_PUBLIC_RUN_TOKEN;
    if (!token) {
      setStatus("error");
      setWakeError(false);
      return;
    }

    setStatus("running");
    setWakeError(false);
    setPhase("waking");

    try {
      const wakeRes = await fetch("/api/wake-render", { method: "GET" });
      if (!wakeRes.ok) {
        setStatus("error");
        setWakeError(true);
        return;
      }

      setRenderStatus("awake");
      setPhase("generating");

      const res = await fetch("/api/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-run-token": token,
        },
        body: JSON.stringify({}),
      });

      const data = (await res.json()) as N8nResponse;
      const ok = res.ok && data?.ok !== false;

      if (!res.ok) {
        setStatus("error");
        setWakeError(false);
        return;
      }

      setStatus(ok ? "success" : "error");
      setWakeError(false);
    } catch {
      setStatus("error");
      setWakeError(false);
    }
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
          Generador de CVs
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          ¡Hola! Que tengas un lindo día de trabajo.
          <br />
          Hacé click y generá los Cvs del día de hoy.
          <br />
          No olvides revisar la carpeta compartida.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
          {renderStatus === "checking" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-gray-500" />
              Comprobando…
            </span>
          )}
          {renderStatus === "awake" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Despierto
            </span>
          )}
          {renderStatus === "asleep" && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Dormido
            </span>
          )}
          <button
            type="button"
            onClick={checkRenderStatus}
            disabled={renderStatus === "checking"}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            title="Actualizar estado del sistema"
            aria-label="Actualizar estado del sistema"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <div className="mb-4 rounded-xl border-2 border-gray-700 bg-gray-100 p-4 text-gray-800">
          <p className="font-semibold">⚠️ Importante:</p>
          <p className="mt-1 text-sm">
            El sistema no incorpora las modificaciones que el cliente realice en el formulario después de generado el primer borrador.
            Tampoco considera la información adjunta en archivos externos (por ejemplo, documentos Word).
            Únicamente procesa los datos completados directamente en los campos del formulario.
          </p>
        </div>

        <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          El despertar del sistema está integrado en el botón &quot;Generar CVs&quot;: al hacer clic, primero se despierta el sistema y luego se generan los CVs.
        </p>

        <div className="mb-4">
          <button
            type="button"
            onClick={runFlow}
            disabled={status === "running"}
            className="w-full rounded-xl bg-pink-200 py-4 text-xl font-semibold text-gray-800 hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-60 sm:py-5"
          >
            GENERAR CVs
          </button>
          <p className="mt-3 text-center text-sm font-medium text-gray-600">
            Una vez iniciado, el sistema no finaliza hasta procesar el último CV que se haya cargado en el forms.
          </p>
          <p className="mt-3 rounded-xl border-2 border-red-400 bg-red-50 px-4 py-2 text-center text-sm font-medium text-red-800">
            Por favor chequeá que no se estén generando más CVs antes de volver a apretar el botón. Esperá 10 minutos para volver a generar CVs nuevos.
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StatusBadge status={status} phase={status === "running" ? phase : undefined} />
        </div>

        {status === "error" && wakeError && (
          <p className="mb-4 rounded-xl bg-red-100 py-2 text-center text-sm font-medium text-red-800">
            No se pudo despertar el sistema. Reintentá en un momento.
          </p>
        )}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 w-full rounded-xl border border-pink-200 py-2.5 text-base font-medium text-pink-700 hover:bg-pink-50"
        >
          ¿Qué es esto?
        </button>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="max-h-[85vh] max-w-lg overflow-y-auto rounded-2xl border border-pink-200 bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="modal-title" className="text-xl font-bold text-gray-800 sm:text-2xl">
                ¿Qué es esto?
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="mt-4 text-base leading-relaxed text-gray-700">
              Al hacer clic en &quot;Generar CVs&quot;, el sistema activa un proceso automático que revisa la planilla y detecta todos los registros que aún no fueron procesados.
              Para cada registro, toma la información cargada (datos personales, experiencia, estudios, habilidades y foto), la organiza según la plantilla definida y genera dos currículums en formato PDF e imagen.
              Una vez creado, el archivo se guarda automáticamente en Google Drive y el registro queda marcado como procesado, evitando duplicaciones.
              El proceso se ejecuta de forma continua hasta completar todos los CVs pendientes.
            </p>
          </div>
        </div>
      )}

      <section className="mb-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-base text-gray-700">
          📁 Los CVs se guardan automáticamente en Google Drive.
          <br />
          <span className="mt-2 block">Carpeta de Cvs: corresponde al documento final</span>
          <span className="block">Carpeta de borradores: corresponde al mismo documento pero con marca de agua.</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={DRIVE_FOLDER_CVS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-pink-200 px-5 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Carpeta de CVs
          </a>
          <a
            href={DRIVE_FOLDER_BORRADORES}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-pink-200 px-5 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Carpeta de borradores
          </a>
        </div>
      </section>
    </main>
  );
}
