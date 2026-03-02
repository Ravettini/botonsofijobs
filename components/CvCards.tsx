"use client";

import type { PdfItem } from "@/lib/types";
import { CvCard } from "./CvCard";

interface CvCardsProps {
  pdfs: PdfItem[];
  /** Si true, cards compactas (historial) */
  compact?: boolean;
}

export function CvCards({ pdfs, compact = false }: CvCardsProps) {
  if (pdfs.length === 0) {
    return (
      <p className="rounded-xl border border-pink-200 bg-white p-5 text-base text-gray-600">
        No se generaron CVs en esta ejecución.
      </p>
    );
  }

  return (
    <div>
      <h3 className="mb-3 text-lg font-semibold text-gray-800">CVs generados</h3>
      <ul className="flex flex-col gap-4">
        {pdfs.map((item, index) => (
          <li key={`${item.downloadUrl}-${index}`}>
            <CvCard item={item} compact={compact} />
          </li>
        ))}
      </ul>
    </div>
  );
}
