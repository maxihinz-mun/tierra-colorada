# Tierra Colorada

Diario digital de la provincia de Corrientes. Política, economía y sociedad con mirada local.

**Sitio en vivo:** https://tierra-colorada.pages.dev
**Repositorio:** https://github.com/maxihinz-mun/tierra-colorada

Este repositorio contiene tres componentes:

1. **Identidad visual** (`brand/`) — paleta, tipografía y variantes del logo.
2. **Equipo editorial** (`agents/`) — prompts de los agentes redactores y del editor jefe.
3. **Sitio web** (`web/`) — proyecto Astro estático listo para hostear en Cloudflare Pages.

---

## Equipo editorial

El diario se redacta a partir de cuatro agentes especializados, cada uno definido en un archivo Markdown que contiene su system prompt, beat, fuentes obligatorias, voz y criterios de calidad.

| Agente | Archivo | Rol |
|---|---|---|
| Editor jefe | `agents/editor-jefe.md` | Asigna coberturas, edita, titula, garantiza pluralidad y estilo. |
| Redactor de Política | `agents/redactor-politica.md` | Gobernación, Legislatura, intendencias, partidos, política nacional con impacto provincial. |
| Redactor de Economía | `agents/redactor-economia.md` | Producción regional, finanzas provinciales, empleo, comercio, turismo. |
| Redactor de Sociedad | `agents/redactor-sociedad.md` | Salud, educación, cultura, ambiente, deporte, vida cotidiana. |

### Cómo usar los agentes

Cada archivo Markdown es un system prompt completo. Para producir una nota:

1. **Asignación.** Pegá el contenido de `agents/editor-jefe.md` como system prompt y pedile al editor que asigne y supervise una cobertura concreta.
2. **Redacción.** Abrí una conversación nueva con el redactor que corresponda (`redactor-politica.md`, `-economia.md`, `-sociedad.md`) como system prompt. Indicale el tema, las fuentes que tenés a disposición y el tipo de nota (cobertura / análisis / explicador / perfil).
3. **Edición.** Pasale el borrador resultante al editor jefe (otra conversación con `editor-jefe.md` de system) para que devuelva observaciones o lo apruebe.
4. **Publicación.** Una vez aprobada, copiá la nota al sitio (ver más abajo).

> **Importante:** los redactores tienen instrucciones explícitas de verificar fuentes primarias. Confirmá siempre nombres de funcionarios, cifras y datos de actualidad antes de publicar — los modelos pueden tener información desactualizada.

---

## Sitio web (`web/`)

Sitio estático construido con [Astro](https://astro.build). Las notas viven como archivos Markdown en `web/src/content/articulos/` y el build genera HTML estático que se sube a Cloudflare Pages.

### Estructura del sitio

```
web/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── public/                  # archivos estáticos (logos, favicon)
└── src/
    ├── content/
    │   ├── config.ts        # esquema de los artículos
    │   └── articulos/       # notas en Markdown — UN ARCHIVO POR NOTA
    ├── components/          # Header, Footer, ArticuloCard
    ├── layouts/             # BaseLayout (HTML + meta + nav + footer)
    ├── pages/
    │   ├── index.astro      # portada
    │   ├── politica.astro   # listado de la sección
    │   ├── economia.astro
    │   ├── sociedad.astro
    │   ├── articulo/[slug].astro   # ruta de cada nota
    │   └── rss.xml.js       # feed RSS
    └── styles/global.css
```

### Cómo agregar una nota

1. Creá un archivo nuevo en `web/src/content/articulos/`. El nombre del archivo (sin la extensión `.md`) será el slug en la URL. Usá kebab-case y sin acentos, por ejemplo: `presupuesto-provincial-2026.md`.
2. Empezá con el frontmatter obligatorio:

```markdown
---
titulo: "Título informativo de la nota (máx. 90-100 caracteres)"
bajada: "Bajada que aporta información nueva, no que repite el título."
seccion: politica          # politica | economia | sociedad
autor: "Nombre del redactor"
fecha: 2026-04-30          # YYYY-MM-DD
tags: [presupuesto, legislatura]    # opcional
destacada: false           # marcala como true si querés que ocupe la portada
---

[Cuerpo de la nota en Markdown]
```

3. Escribí el cuerpo en Markdown estándar. Podés usar `## subtítulos`, `> citas en bloque`, listas, **negritas** y enlaces.
4. Corré el sitio local (ver siguiente sección) para verificar antes de publicar.

### Correr el sitio en local

Requiere [Node.js 20+](https://nodejs.org). Desde la carpeta `web/`:

```bash
cd web
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:4321/`.

Para hacer un build de producción:

```bash
npm run build      # genera dist/
npm run preview    # sirve el build para verificar
```

---

## Deploy a Cloudflare Pages

Cloudflare Pages es gratuito, rápido y sin límites prácticos de ancho de banda. La integración con GitHub permite que cada vez que hagas un commit a `main`, se despliegue una nueva versión del sitio automáticamente.

### Pasos

1. **Subir el repositorio a GitHub.**
   - Creá un repo nuevo en GitHub (privado o público).
   - Desde la carpeta raíz de este proyecto:
     ```bash
     git init
     git add .
     git commit -m "Tierra Colorada — primera versión"
     git branch -M main
     git remote add origin git@github.com:TU-USUARIO/tierra-colorada.git
     git push -u origin main
     ```

2. **Conectar Cloudflare Pages.**
   - Entrá a [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create application** → pestaña **Pages** → **Connect to Git**.
   - Autorizá tu cuenta de GitHub y seleccioná el repositorio.

3. **Configurar el build.** En la pantalla de configuración, completá:
   - **Production branch:** `main`
   - **Framework preset:** Astro
   - **Build command:** `cd web && npm install && npm run build`
   - **Build output directory:** `web/dist`
   - **Root directory:** *(dejar vacío, raíz del repo)*
   - **Environment variables:** `NODE_VERSION` = `20`

4. **Deploy.** Cloudflare ejecuta el build y publica el sitio en `https://tierra-colorada.pages.dev` (el subdominio se basa en el nombre del proyecto).

5. **Dominio propio (opcional).** Cuando quieras un `tierracolorada.com.ar`:
   - Comprá el dominio (NIC.ar para `.com.ar`, o un registrar internacional para `.com`).
   - En Cloudflare Pages → tu proyecto → **Custom domains** → agregá el dominio y seguí las instrucciones de DNS.

### Después del primer deploy

Cada vez que pushees a `main`, Cloudflare hace un deploy nuevo automáticamente. Para nuevas notas el flujo queda así:

```bash
# escribir la nota en web/src/content/articulos/...
git add web/src/content/articulos/mi-nueva-nota.md
git commit -m "Nota: ..."
git push
# en 1-2 minutos, está publicada
```

---

## Próximos pasos sugeridos

- Conectar Google Analytics 4 o Plausible para medir audiencia.
- Sumar imágenes destacadas por nota (poner los archivos en `web/public/img/` y referenciarlos en el frontmatter `imagen:`).
- Agregar buscador (Pagefind se integra muy bien con Astro estático).
- Si crece el equipo y quieren editar sin tocar código: migrar a un CMS headless (Sanity, Decap CMS) manteniendo Astro.
- Newsletter semanal a partir del feed RSS (Buttondown, MailerLite tienen tier gratuito).

---

## Notas de muestra

El sitio incluye tres notas de ejemplo (una por sección) marcadas como **muestra** al inicio del cuerpo. Reemplazalas o eliminalas antes de salir al aire.
