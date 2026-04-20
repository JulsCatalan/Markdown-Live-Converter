# Markdown Live Converter

Editor de Markdown con vista previa en tiempo real y exportación a PDF, 100% en el navegador sin servidor.

🔗 **[markdown-live-converter.onrender.com](https://markdown-live-converter.onrender.com)**

---

## ¿Qué hace?

- **Editor + Preview en vivo** — escribe Markdown a la izquierda, ve el resultado renderizado a la derecha en tiempo real
- **Exporta a PDF** — descarga tu documento como PDF directamente desde el navegador, sin servidores ni límites
- **Presets de estilo** — elige entre Clásico, Moderno y Relajado, y personaliza tipografía, colores y márgenes
- **Sube archivos .md** — carga cualquier archivo Markdown desde tu disco y edítalo al instante
- **Split pane resizable** — arrastra el divisor para ajustar el espacio entre editor y preview
- **100% privado** — todo ocurre en tu navegador, tus documentos nunca salen de tu dispositivo

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Marked](https://marked.js.org) — parseo de Markdown
- [Lucide React](https://lucide.dev) — iconos

## Estructura del proyecto

```
src/
├── App.tsx
├── pages/
│   ├── EditorPage.tsx      # Página principal — editor + preview
│   ├── SettingsPage.tsx    # Personalización de estilos
│   └── LegalPage.tsx       # Privacidad & Términos
├── components/
│   ├── MarkdownEditor.tsx  # Textarea del editor
│   ├── MarkdownPreview.tsx # Preview renderizado
│   └── Toolbar.tsx         # Barra de herramientas (subir .md, exportar PDF)
└── lib/
    └── styles.ts           # Presets, tipos y generación de CSS para PDF
```

## Desarrollo local

```bash
# Clonar el repo
git clone https://github.com/JulsCatalan/Markdown-Live-Converter.git
cd Markdown-Live-Converter

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Build

```bash
npm run build
```

El output queda en `dist/`. Es un sitio estático, puedes desplegarlo en cualquier hosting.

## Deploy en Render

El proyecto incluye un `render.yaml` configurado para deploy automático como sitio estático:

1. Sube el repo a GitHub
2. En [Render](https://render.com) → **New** → **Static Site**
3. Conecta el repositorio
4. Render detecta el `render.yaml` y configura todo automáticamente

## Licencia

MIT 

---

Made by [Juls](https://github.com/JulsCatalan)