"use client";

import { useState } from "react";
import { JsonViewer } from "./JsonViewer";

interface TechnicalDetailsProps {
  json: unknown;
  rawErrorMessage?: string | null;
}

export function TechnicalDetails({ json, rawErrorMessage }: TechnicalDetailsProps) {
  const [open, setOpen] = useState(false);

  const hasContent = json != null || (rawErrorMessage && rawErrorMessage.trim() !== "");

  if (!hasContent) return null;

  return (
    <div className="mt-6 rounded-xl border border-pink-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-xl border-0 bg-pink-50/50 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-pink-50"
      >
        <span>Detalles técnicos (solo soporte)</span>
        <span className="text-gray-400">{open ? "▼" : "▶"}</span>
      </button>
      {open && (
        <div className="border-t border-pink-200 p-4">
          {rawErrorMessage && rawErrorMessage.trim() !== "" && (
            <div className="mb-4">
              <p className="mb-1 text-xs font-medium text-gray-500">Mensaje de error</p>
              <pre className="max-h-32 overflow-auto rounded border border-pink-200 bg-gray-50 p-3 text-xs text-gray-700">
                {rawErrorMessage}
              </pre>
            </div>
          )}
          {json != null && (
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">JSON del último resultado</p>
              <JsonViewer data={json} className="bg-gray-50 text-gray-800" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
