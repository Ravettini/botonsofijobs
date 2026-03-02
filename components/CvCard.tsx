"use client";

import { useCallback, useState } from "react";
import type { PdfItem } from "@/lib/types";

interface CvCardProps {
  item: PdfItem;
  /** Si true, layout compacto (historial) */
  compact?: boolean;
}

function shortenUrl(url: string, maxLen = 50): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen - 3) + "...";
}

export function CvCard({ item, compact = false }: CvCardProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(item.downloadUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }, [item.downloadUrl]);

  const openUrl = item.viewUrl ?? item.downloadUrl;

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-pink-200 bg-white p-3">
        <span className="truncate text-sm font-medium text-gray-800">{item.label}</span>
        <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-gray-700">
          Listo para revisar
        </span>
        {item.row_number != null && (
          <span className="text-xs text-gray-500">Row: {String(item.row_number)}</span>
        )}
        <div className="ml-auto flex flex-wrap gap-1">
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-pink-200 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-pink-300"
          >
            Abrir
          </a>
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-pink-200 px-2 py-1 text-xs font-medium text-gray-800 hover:bg-pink-300"
          >
            Descargar
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="rounded-lg bg-pink-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-pink-200"
          >
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-pink-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{item.label}</h3>
          <span className="mt-1 inline-block rounded-full bg-pink-100 px-3 py-0.5 text-sm font-medium text-gray-700">
            Listo para revisar
          </span>
          {item.row_number != null && (
            <p className="mt-1 text-xs text-gray-500">Row: {String(item.row_number)}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={openUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-pink-200 px-4 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Abrir
          </a>
          <a
            href={item.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-lg bg-pink-200 px-4 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
          >
            Descargar
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex rounded-lg border border-pink-200 bg-white px-4 py-2.5 text-base font-medium text-gray-700 hover:bg-pink-50"
          >
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
        </div>
      </div>
      <p className="mt-3 truncate text-sm text-gray-500" title={item.downloadUrl}>
        {shortenUrl(item.downloadUrl, 70)}
      </p>
    </div>
  );
}
