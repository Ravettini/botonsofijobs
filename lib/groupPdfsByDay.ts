import type { HistoryItem, DayGroup, PdfItem } from "./types";

/**
 * Formatea una fecha YYYY-MM-DD a label amigable (ej: "1 feb 2026").
 * Usa zona horaria local del navegador.
 */
function formatDayLabel(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Obtiene la clave de día YYYY-MM-DD en zona local a partir de un ISO string.
 */
function getDayKey(isoString: string): string {
  const d = new Date(isoString);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Agrupa el historial de ejecuciones por día (zona local).
 * Cada PDF recibe createdAt = triggered_at de su ejecución.
 */
export function groupPdfsByDay(history: HistoryItem[]): DayGroup[] {
  const byDay = new Map<string, PdfItem[]>();

  for (const run of history) {
    const triggeredAt = run.triggered_at ?? new Date().toISOString();
    const dayKey = getDayKey(triggeredAt);
    const pdfs = Array.isArray(run.pdfs) ? run.pdfs : [];

    for (const pdf of pdfs) {
      const item: PdfItem = {
        ...pdf,
        createdAt: pdf.createdAt ?? triggeredAt,
      };
      const list = byDay.get(dayKey) ?? [];
      list.push(item);
      byDay.set(dayKey, list);
    }
  }

  const groups: DayGroup[] = [];
  Array.from(byDay.entries()).forEach(([dayKey, items]) => {
    const totalCvs = items.filter((i) => i.downloadUrl && i.downloadUrl.trim()).length;
    const totalErrors = items.length - totalCvs;
    groups.push({
      dayKey,
      label: formatDayLabel(dayKey),
      totalCvs,
      totalErrors,
      items,
    });
  });

  groups.sort((a, b) => (b.dayKey > a.dayKey ? 1 : -1));
  return groups;
}
