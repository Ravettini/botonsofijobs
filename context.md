# Contexto del proyecto: Generador de CVs

Documentación del funcionamiento y de todos los estilos CSS del proyecto.

---

## 1. Funcionamiento general

### Qué hace la aplicación

- **Página principal:** Muestra un título "Generador de CVs", un botón **"GENERAR CVs"** y un recordatorio de que los CVs se guardan en una carpeta de Google Drive.
- **Flujo al hacer clic en "GENERAR CVs":**
  1. El frontend envía un `POST` a `/api/run` con el header `x-run-token` (valor de `NEXT_PUBLIC_RUN_TOKEN`).
  2. La API route (`app/api/run/route.ts`) valida el token contra `RUN_TOKEN_SERVER` y, si coincide, hace un `POST` al webhook de n8n (`N8N_WEBHOOK_URL`).
  3. n8n ejecuta el flujo (generación de CVs, subida a Drive, etc.). La respuesta de n8n se devuelve tal cual al cliente (JSON).
  4. El cliente interpreta `res.ok` y `data?.ok` para marcar el estado como **success** o **error**. Si hay error, muestra el botón "Reintentar".
- **Durante la ejecución:** El botón principal se deshabilita y aparece el botón **"Detener ejecución"**, que aborta la petición con `AbortController`.
- **Carpeta de Drive:** Si está configurada `NEXT_PUBLIC_DRIVE_FOLDER_URL`, se muestra el enlace "Abrir carpeta"; el nombre mostrado es `NEXT_PUBLIC_DRIVE_FOLDER_NAME` (por defecto "Carpeta de CVs").

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `N8N_WEBHOOK_URL` | URL del webhook n8n (servidor). |
| `RUN_TOKEN_SERVER` | Token que la API espera en `x-run-token`. |
| `NEXT_PUBLIC_RUN_TOKEN` | Token que el front envía; debe coincidir con `RUN_TOKEN_SERVER`. |
| `NEXT_PUBLIC_DRIVE_FOLDER_URL` | URL de la carpeta de Drive (opcional). |
| `NEXT_PUBLIC_DRIVE_FOLDER_NAME` | Nombre de la carpeta para mostrar en la UI (default: "Carpeta de CVs"). |

### Estados de la ejecución

- **idle:** Listo; se puede pulsar "GENERAR CVs".
- **running:** Ejecutando; botón deshabilitado, spinner en el badge, botón "Detener ejecución" visible.
- **success:** Terminó bien; mensaje "Listo. Los CVs ya están en Drive."
- **error:** Falló; badge de error y botón "Reintentar".

### Componentes usados en la página principal

- **`StatusBadge`:** Muestra el estado actual (idle / running / success / error) con estilos distintos para cada uno.
- **`TechnicalDetails`** y **`JsonViewer`** están en el código pero no se usan en la página actual; sirven para un panel de detalles técnicos (JSON y mensaje de error) en vistas que lo necesiten.

### API `/api/run`

- **Método:** POST.
- **Headers:** `x-run-token` (requerido), `Content-Type: application/json` (opcional).
- **Respuesta:** JSON devuelto por n8n; si n8n falla (status no ok), la API responde 500 con `ok: false` y datos de error.
- **Seguridad:** Sin token correcto responde 401.

---

## 2. Estilos CSS

El proyecto usa **Tailwind CSS** y un archivo **`app/globals.css`** con variables y algún estilo base. No hay archivo `style.css` aparte; los estilos están en Tailwind (clases en componentes) y en `globals.css`.

---

### 2.1 `app/globals.css`

**Variables CSS (`:root`):**

| Variable | Valor | Uso |
|----------|--------|-----|
| `--bg` | `#ffffff` | Fondo blanco. |
| `--bg-soft` | `#fff1f7` | Fondo suave (rosa claro). |
| `--pink-50` | `#fff1f7` | Rosa 50. |
| `--pink-100` | `#ffe4f1` | Rosa 100. |
| `--pink-200` | `#ffcfe6` | Rosa 200. |
| `--pink-400` | `#ff7ab6` | Rosa 400. |
| `--foreground` | `#1f2937` | Texto principal. |
| `--foreground-muted` | `#6b7280` | Texto secundario. |

**Reglas:**

- **`body`:**  
  `color: var(--foreground);`  
  `background: var(--bg-soft);`

- **`pre.json-view`** (bloque de JSON en panel técnico):  
  `font-family: ui-monospace, monospace;`  
  `font-size: 0.8125rem;`  
  `line-height: 1.5;`  
  `overflow-x: auto;`

---

### 2.2 `tailwind.config.ts` — colores extendidos

**Escala `pink`:**

- `50`: `#fff1f7`
- `100`: `#ffe4f1`
- `200`: `#ffcfe6`
- `300`: `#ffb3d9`
- `400`: `#ff7ab6`
- `500`: `#f43f9a`

**Colores de error:**

- `error-soft`: `#e8b4b8` (fondo del badge de error).
- `error-soft-text`: `#9b4d52` (texto del badge de error).

Con esto se usan clases como `bg-pink-200`, `text-error-soft-text`, etc.

---

### 2.3 Clases Tailwind por archivo

#### `app/layout.tsx` (body)

- `antialiased` — suavizado de fuentes.
- `min-h-screen` — altura mínima de pantalla.
- `bg-pink-50` — fondo rosa claro.
- `text-gray-800` — texto gris oscuro.

#### `app/page.tsx`

**Contenedor principal (`main`):**

- `mx-auto max-w-3xl px-4 py-8 sm:py-12` — centrado, ancho máximo, padding.

**Header:**

- `mb-8 text-center`
- Título: `text-3xl font-bold text-gray-800 sm:text-4xl`
- Subtítulo: `mt-2 text-lg text-gray-600`

**Sección del botón (card):**

- `mb-6 rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8`

**Contenedor de botones:**

- `mb-6 flex flex-col gap-3 sm:flex-row`

**Botón "GENERAR CVs":**

- `flex-1 rounded-xl bg-pink-200 py-4 text-xl font-semibold text-gray-800 hover:bg-pink-300 disabled:cursor-not-allowed disabled:opacity-60 sm:py-5`

**Botón "Detener ejecución":**

- `rounded-xl border-2 border-error-soft bg-white py-4 px-6 text-xl font-semibold text-error-soft-text hover:bg-error-soft sm:py-5`

**Contenedor del badge:**

- `mb-4 flex flex-wrap items-center gap-3`

**Botón "Reintentar":**

- `rounded-lg bg-pink-200 px-4 py-2 text-base font-medium text-gray-800 hover:bg-pink-300`

**Sección Drive (card):**

- `rounded-2xl border border-pink-200 bg-white p-6 shadow-sm sm:p-8`

**Texto y enlace:**

- Párrafos: `text-base text-gray-700`, `mt-1 text-base text-gray-700`
- Enlace "Abrir carpeta": `mt-4 inline-block rounded-xl bg-pink-200 px-5 py-2.5 text-base font-medium text-gray-800 hover:bg-pink-300`

#### `components/StatusBadge.tsx`

**Badge idle / success (rosa):**

- `inline-flex items-center rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800`

**Badge running (con spinner):**

- Contenedor: `inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-base font-medium text-gray-800`
- Spinner: `h-4 w-4 animate-spin rounded-full border-2 border-pink-400 border-t-transparent`

**Badge error:**

- `inline-flex items-center rounded-full bg-error-soft px-4 py-1.5 text-base font-medium text-error-soft-text`

#### `components/JsonViewer.tsx`

- `json-view` (clase que usa los estilos de `pre.json-view` en globals.css)
- `rounded-lg border border-pink-200 bg-gray-50 p-4 text-gray-800` + `className` prop para variantes (ej. `bg-gray-50 text-gray-800` en TechnicalDetails).

#### `components/TechnicalDetails.tsx`

**Contenedor:**

- `mt-6 rounded-xl border border-pink-200 bg-white`

**Botón acordeón:**

- `flex w-full items-center justify-between rounded-xl border-0 bg-pink-50/50 px-4 py-3 text-left text-sm font-medium text-gray-600 hover:bg-pink-50`
- Flecha: `text-gray-400`

**Contenido desplegado:**

- `border-t border-pink-200 p-4`
- Etiqueta: `mb-1 text-xs font-medium text-gray-500`
- Bloque de error: `max-h-32 overflow-auto rounded border border-pink-200 bg-gray-50 p-3 text-xs text-gray-700`

---

## 3. Resumen de paleta y patrones

- **Fondo general:** rosa muy claro (`pink-50` / `--bg-soft`).
- **Cards y bordes:** blanco, bordes `pink-200`, sombra suave.
- **Botones principales:** `bg-pink-200`, hover `bg-pink-300`, texto `gray-800`.
- **Estado de error:** fondo `error-soft`, texto `error-soft-text`.
- **Tipografía:** títulos en `gray-800`, cuerpo en `gray-600`/`gray-700`, detalles en `gray-500`.
- **Responsive:** `sm:` para padding y tamaño de título; botones en columna en móvil y fila en `sm`.

Con esto se describe el funcionamiento de la app y todos los estilos CSS (globals, Tailwind config y clases usadas en los componentes).
