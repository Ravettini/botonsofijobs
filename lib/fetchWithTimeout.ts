/**
 * Fetch opcionalmente con timeout vía AbortController.
 * Si timeoutMs es 0 o no se pasa, espera sin límite hasta que responda.
 * @param url - URL del webhook
 * @param options - Opciones de fetch (method, body, headers)
 * @param timeoutMs - Timeout en ms; 0 o omitir = sin timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 0
): Promise<Response> {
  if (timeoutMs > 0) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  return fetch(url, options);
}
