"use client";

import type { HistoryItem } from "@/lib/types";
import { CvCards } from "@/components/CvCards";

interface HistoryListProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

export function HistoryList({ items, onSelectItem }: HistoryListProps) {
  if (items.length === 0) {
    return (
      <p className="text-base text-gray-600">Aún no hay ejecuciones en el historial.</p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => {
        const pdfs = Array.isArray(item.pdfs) ? item.pdfs : [];
        const countLabel = pdfs.length === 1 ? "1 CV" : `${pdfs.length} CVs`;
        return (
          <li
            key={`${item.triggered_at}-${index}`}
            className="rounded-xl border border-pink-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">
                {new Date(item.triggered_at).toLocaleString("es")}
              </span>
              <span
                className={`rounded-full px-3 py-0.5 text-sm font-medium ${
                  item.ok ? "bg-pink-100 text-gray-800" : "bg-error-soft text-error-soft-text"
                }`}
              >
                {item.ok ? "OK" : "Error"}
              </span>
              {pdfs.length > 0 && (
                <span className="text-sm text-gray-600">{countLabel}</span>
              )}
              <button
                type="button"
                onClick={() => onSelectItem(item)}
                className="ml-auto rounded-lg bg-pink-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-pink-300"
              >
                Ver CVs
              </button>
            </div>
            {pdfs.length > 0 && (
              <div className="mt-3">
                <CvCards pdfs={pdfs} compact />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
