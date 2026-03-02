import type { PdfItem } from "./types";

function extractFileIdFromDriveUrl(url: string): string | undefined {
  try {
    const u = new URL(url);
    const idFromQuery = u.searchParams.get("id");
    if (idFromQuery) return idFromQuery;
    const match = u.pathname.match(/\/file\/d\/([^/]+)/);
    return match ? match[1] : undefined;
  } catch {
    return undefined;
  }
}

function getPdfUrl(item: Record<string, unknown>): string | null {
  const pdfUrl = item.PDF_URL ?? item.pdf_url;
  if (typeof pdfUrl === "string" && pdfUrl.trim()) return pdfUrl.trim();
  const drive = item.drive as Record<string, unknown> | undefined;
  if (drive && typeof drive === "object") {
    const d = drive.downloadUrl ?? drive.viewUrl;
    if (typeof d === "string" && d.trim()) return d.trim();
  }
  return null;
}

function itemToPdfItem(
  item: Record<string, unknown>,
  index: number,
  labelIndex: number
): PdfItem | null {
  const pdfUrl = getPdfUrl(item);
  if (!pdfUrl) return null;

  const fileId = extractFileIdFromDriveUrl(pdfUrl);
  const drive = item.drive as Record<string, unknown> | undefined;
  const viewFromDrive =
    drive && typeof drive.viewUrl === "string" && drive.viewUrl.trim()
      ? drive.viewUrl.trim()
      : undefined;
  const viewUrl =
    viewFromDrive ?? (fileId ? `https://drive.google.com/file/d/${fileId}/view` : undefined);

  const rawFileName = (item.fileName as string) ?? (drive?.fileName as string);
  const nameWithoutPdf =
    typeof rawFileName === "string" && rawFileName.trim()
      ? rawFileName.replace(/\.pdf$/i, "").trim()
      : null;
  const label =
    (item.candidateName as string) ??
    (item.person_name as string) ??
    (item.name as string) ??
    (item.label as string) ??
    (item.PDF_LABEL as string) ??
    nameWithoutPdf ??
    "Sin nombre";

  const row_number = item.row_number as number | string | undefined;

  return {
    label: String(label).trim() || "Sin nombre",
    fileId,
    viewUrl,
    downloadUrl: pdfUrl,
    row_number,
  };
}

/**
 * Normaliza la respuesta de /api/run (objeto único o array) en una lista `pdfs`.
 * Filtra items sin PDF_URL válido.
 */
export function normalizeRunResponse(data: unknown): { pdfs: PdfItem[]; raw: unknown } {
  const raw = data;
  const items: Record<string, unknown>[] = [];

  if (Array.isArray(data)) {
    for (const el of data) {
      if (el && typeof el === "object" && !Array.isArray(el)) {
        items.push(el as Record<string, unknown>);
      }
    }
  } else if (data && typeof data === "object" && !Array.isArray(data)) {
    items.push(data as Record<string, unknown>);
  }

  const pdfs: PdfItem[] = [];
  for (let i = 0; i < items.length; i++) {
    const pdf = itemToPdfItem(items[i], i, pdfs.length);
    if (pdf) pdfs.push(pdf);
  }

  return { pdfs, raw };
}
