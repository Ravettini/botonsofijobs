/** Respuesta esperada de n8n (o proxy) con links de Drive */
export interface DriveLinks {
  viewUrl?: string | null;
  downloadUrl?: string | null;
  fileName?: string | null;
}

export interface N8nResponse {
  ok?: boolean;
  run_id?: string | null;
  triggered_at?: string;
  drive?: DriveLinks | null;
  /** URL del PDF/CV generado (prioridad sobre drive.viewUrl / downloadUrl) */
  PDF_URL?: string | null;
  raw?: unknown;
  message?: string | null;
  error?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Obtiene la URL del CV: result.PDF_URL o fallback a drive.viewUrl / drive.downloadUrl.
 */
export function getCvUrl(data: N8nResponse | null): string | null {
  if (!data) return null;
  const pdf = data.PDF_URL ?? (data as Record<string, unknown>).pdf_url;
  if (pdf && typeof pdf === "string") return pdf;
  const drive = data.drive && typeof data.drive === "object" ? data.drive : null;
  if (drive?.viewUrl && typeof drive.viewUrl === "string") return drive.viewUrl;
  if (drive?.downloadUrl && typeof drive.downloadUrl === "string") return drive.downloadUrl;
  return null;
}

/** Item normalizado de un PDF/CV generado */
export interface PdfItem {
  /** Nombre para mostrar: persona, fileName sin .pdf, o "Sin nombre" */
  label: string;
  fileId?: string;
  viewUrl?: string;
  downloadUrl: string;
  row_number?: number | string;
  /** Timestamp de generación (para agrupar por día y mostrar hora) */
  createdAt?: string;
}

/** Agrupación por día para la vista "CVs por fecha" */
export interface DayGroup {
  dayKey: string;
  label: string;
  totalCvs: number;
  totalErrors: number;
  items: PdfItem[];
}

/** Item guardado en historial (localStorage) */
export interface HistoryItem {
  triggered_at: string;
  run_id: string | null;
  ok: boolean;
  message: string | null;
  drive: DriveLinks | null;
  fullJson: N8nResponse | null;
  /** Lista de PDFs normalizados de esta ejecución */
  pdfs: PdfItem[];
}
