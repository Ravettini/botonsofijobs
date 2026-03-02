"use client";

import { useCallback, useState } from "react";
import type { PdfItem } from "@/lib/types";

interface PersonCvCardProps {
  item: PdfItem;
}

function formatTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function PersonCvCard({ item }: PersonCvCardProps) {
  const [copied, setCopied] = useState(false);
  const hasLink = Boolean(item.downloadUrl && item.downloadUrl.trim());
  const openUrl = item.viewUrl ?? item.downloadUrl;

  const copyLink = useCallback(() => {
    if (!item.downloadUrl) return;
    navigator.clipboard.writeText(item.downloadUrl).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }, [item.downloadUrl]);

  return (
    <div className="rounded-xl border border-pink-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{item.label}</h3>
          <span
            className={`mt-1 inline-block rounded-full px-3 py-0.5 text-sm font-medium ${
              hasLink ? "bg-pink-100 text-gray-700" : "bg-error-soft text-error-soft-text"
            }`}
          >
            {hasLink ? "Listo para revisar" : "Error"}
          </span>
          {item.createdAt && formatTime(item.createdAt) && (
            <p className="mt-1 text-xs text-gray-500">
              Generado a las {formatTime(item.createdAt)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {hasLink && (
            <>
              {openUrl && (
                <a
                  href={openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-pink-200 px-4 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300"
                >
                  Abrir
                </a>
              )}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
