# Mini web: activar flujo n8n y ver JSON (Drive)

Web minimalista para disparar un workflow de n8n vía Webhook y mostrar el JSON final (con links de Google Drive).  
Stack: **Next.js (App Router)** + **TypeScript**. Deploy: **Vercel**.

## Objetivo

- UI con botón **ACTIVAR FLUJO**.
- Al hacer click se llama al endpoint propio **POST /api/run** (proxy) para evitar CORS.
- `/api/run` llama al Webhook de n8n (URL en variable de entorno) y devuelve el JSON.
- La UI muestra:
  - Estado: idle / running / success / error
  - Botones **Abrir en Drive** (`viewUrl`) y **Descargar** (`downloadUrl`) cuando existan
  - Pretty-print del JSON completo
  - Historial de últimas 5 ejecuciones (en `localStorage`)

## Setup local

1. Instalar dependencias:
   ```bash
   npm i
   ```

2. Copiar el ejemplo de variables de entorno y configurarlas:
   ```bash
   cp .env.example .env.local
   ```
   Editar `.env.local` y setear:
   - `N8N_WEBHOOK_URL`: en local suele ser `http://localhost:5678/webhook-test/<path>`
   - `RUN_TOKEN_SERVER`: token secreto para validar en el servidor
   - `NEXT_PUBLIC_RUN_TOKEN`: mismo valor; el front lo envía en el header `x-run-token`

3. Arrancar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador: **http://localhost:3000**

## CORS

El navegador **no** llama a n8n directamente. Siempre llama a **/api/run** (tu dominio). El servidor Next.js es quien hace el `fetch` al Webhook de n8n, así que no hay CORS entre el navegador y n8n.

## Drive y permisos

- La web **no** hace OAuth de Google. Drive se gestiona íntegramente dentro de n8n.
- La web solo muestra lo que devuelve n8n (`viewUrl`, `downloadUrl`, etc.).
- Si el archivo en Drive es privado, el link puede no abrir para otros usuarios. Opciones:
  - Compartir la carpeta o archivo desde la cuenta de Drive que usa n8n.
  - Configurar en n8n los permisos adecuados (por ejemplo “cualquiera con el enlace puede ver”).

## Migración local → Hostinger / producción

1. Cambiar `N8N_WEBHOOK_URL` en el entorno de producción para que apunte a tu n8n en Hostinger (ej: `https://tu-dominio.com/webhook/<path>`).
2. Configurar en Vercel (o tu host) las mismas variables: `N8N_WEBHOOK_URL`, `RUN_TOKEN_SERVER`, `NEXT_PUBLIC_RUN_TOKEN`.
3. Redeploy.

## Variables de entorno

| Variable | Uso |
|---------|-----|
| `N8N_WEBHOOK_URL` | URL del Webhook de n8n (servidor). |
| `RUN_TOKEN_SERVER` | Token que valida `/api/run`; debe coincidir con lo que envía el front. |
| `NEXT_PUBLIC_RUN_TOKEN` | Valor que el front envía en el header `x-run-token`. Debe ser igual a `RUN_TOKEN_SERVER`. |

## Deploy en Vercel

- Conectar el repo a Vercel y configurar las variables de entorno anteriores.
- El build es `npm run build`; no hace falta configuración extra.

## Estructura relevante

- `app/page.tsx` — Página principal (botón, estado, JSON, historial).
- `app/api/run/route.ts` — Proxy POST que valida token y llama al Webhook con timeout 120s.
- `lib/fetchWithTimeout.ts` — Fetch con timeout (AbortController).
- `lib/types.ts` — Tipos para respuesta n8n e ítems de historial.
- `components/StatusBadge.tsx`, `JsonViewer.tsx`, `HistoryList.tsx` — UI reutilizable.
