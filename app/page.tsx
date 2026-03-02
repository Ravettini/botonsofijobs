"use client";

import { useCallback, useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import type { N8nResponse } from "@/lib/types";

type RunStatus = "idle" | "running" | "success" | "error";

const DRIVE_FOLDER_CVS =
  "https://drive.google.com/drive/folders/1Loj266jNNb2rp0zCGu2vBx6VCEZqvEAw?usp=sharing";
const DRIVE_FOLDER_BORRADORES =
  "https://drive.google.com/drive/folders/1pvEeSNXBhFrmTVFEHXyA4sjRX-b6ujPS?usp=sharing";

export default function Home() {
  const [status, setStatus] = useState<RunStatus>("idle");

  const runFlow = useCallback(async () => {
    const token = process.env.NEXT_PUBLIC_RUN_TOKEN;
    if (!token) {
      setStatus("error");
      return;
    }

    setStatus("running");

    try {
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
        return;
      }

      setStatus(ok ? "success" : "error");
    } catch {
      setStatus("error");
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
          No olvides de revisar la carpeta compartida.
        </p>
      </header>

      <section className="mb-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-4 rounded-xl border-2 border-red-400 bg-red-50 p-4 text-red-800">
          <p className="font-semibold">Importante:</p>
          <p className="mt-1 text-sm">
            El sistema no incorpora las modificaciones que el cliente realice en el formulario después de generado el primer borrador.
            Tampoco considera la información adjunta en archivos externos (por ejemplo, documentos Word).
            Únicamente procesa los datos completados directamente en los campos del formulario.
          </p>
        </div>
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

      <section className="rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          ¿Qué es esto?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-700">
          Al hacer clic en &quot;Generar CVs&quot;, el sistema activa un proceso automático que revisa la planilla y detecta todos los registros que aún no fueron procesados.
          Para cada registro, toma la información cargada (datos personales, experiencia, estudios, habilidades y foto), la organiza según la plantilla definida y genera dos currículums en formato PDF e imagen.
          Una vez creado, el archivo se guarda automáticamente en Google Drive y el registro queda marcado como procesado, evitando duplicaciones.
          El proceso se ejecuta de forma continua hasta completar todos los CVs pendientes.
        </p>
      </section>
    </main>
  );
}
