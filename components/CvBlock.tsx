"use client";

import { useCallback, useState } from "react";

interface CvBlockProps {
  cvUrl: string;
  /** Si true, layout más compacto (p. ej. dentro del historial) */
  compact?: boolean;
}

export function CvBlock({ cvUrl, compact = false }: CvBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(cvUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }, [cvUrl]);

  if (compact) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2">
        <span className="text-xs font-medium text-slate-600">CV Generado</span>
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-500"
        >
          Abrir CV
        </a>
        <span className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 font-mono text-xs text-slate-600">
          {cvUrl}
        </span>
        <button
          type="button"
          onClick={copyLink}
          className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
        >
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">CV Generado</h3>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-500"
        >
          Abrir CV
        </a>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          type="text"
          readOnly
          value={cvUrl}
          className="min-w-0 flex-1 rounded border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-700"
        />
        <button
          type="button"
          onClick={copyLink}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          {copied ? "Copiado" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
