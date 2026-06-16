// Paleta neutral de Tailwind (zinc)
// zinc-50 #fafafa | zinc-100 #f4f4f5 | zinc-200 #e4e4e7
// zinc-700 #3f3f46 | zinc-800 #27272a | zinc-900 #18181b | zinc-950 #09090b

export interface PrintStyles {
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
  colorText: string;
  colorBg: string;
  colorHeading: string;
  colorMuted: string;
  colorBorder: string;
  colorCode: string;
  colorCodeBg: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;
}

export type PresetKey = "clasico" | "moderno" | "relajado";

export const PRESETS: Record<PresetKey, { label: string; description: string; styles: PrintStyles }> = {
  clasico: {
    label: "Clásico",
    description: "Serif editorial, blanco limpio, tipografía compacta",
    styles: {
      fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
      fontSize: "15px",
      lineHeight: "1.65",
      colorText: "#18110a",
      colorBg: "#ffffff",
      colorHeading: "#0a0600",
      colorMuted: "#6b5f56",
      colorBorder: "#e8e4e0",
      colorCode: "#7c3a15",
      colorCodeBg: "#f5f5f5",
      marginTop: "18mm",
      marginRight: "18mm",
      marginBottom: "18mm",
      marginLeft: "18mm",
    },
  },
  moderno: {
    label: "Moderno",
    description: "Blanco puro, sans-serif preciso, código terminal",
    styles: {
      fontFamily: '"Inter", system-ui, -apple-system, "Helvetica Neue", sans-serif',
      fontSize: "14px",
      lineHeight: "1.55",
      colorText: "#0f172a",
      colorBg: "#ffffff",
      colorHeading: "#000000",
      colorMuted: "#475569",
      colorBorder: "#e2e8f0",
      colorCode: "#10b981",
      colorCodeBg: "#0f172a",
      marginTop: "15mm",
      marginRight: "15mm",
      marginBottom: "15mm",
      marginLeft: "15mm",
    },
  },
  relajado: {
    label: "Relajado",
    description: "Serif literario, blanco, espaciado cómodo",
    styles: {
      fontFamily: '"Lora", "Source Serif 4", Georgia, "Times New Roman", serif',
      fontSize: "15px",
      lineHeight: "1.7",
      colorText: "#1a1a1a",
      colorBg: "#ffffff",
      colorHeading: "#000000",
      colorMuted: "#5a5a5a",
      colorBorder: "#e5e5e5",
      colorCode: "#5c3d00",
      colorCodeBg: "#f5f5f5",
      marginTop: "18mm",
      marginRight: "22mm",
      marginBottom: "18mm",
      marginLeft: "22mm",
    },
  },
};

export const DEFAULT_PRESET: PresetKey = "moderno";

const STORAGE_KEY = "md-pdf-styles-v2";

export function loadStyles(): { preset: PresetKey; styles: PrintStyles } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const preset: PresetKey = parsed.preset ?? DEFAULT_PRESET;
      return {
        preset,
        styles: { ...PRESETS[preset].styles, ...parsed.overrides },
      };
    }
  } catch {}
  return { preset: DEFAULT_PRESET, styles: PRESETS[DEFAULT_PRESET].styles };
}

export function saveStyles(preset: PresetKey, overrides: Partial<PrintStyles>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ preset, overrides }));
}

// CSS string para inyectar en la ventana de impresión
// Truco: @page margin 0 + padding en body = el browser no tiene espacio
// para header/footer y los omite automáticamente sin que el usuario haga nada.
export function buildPrintCSS(s: PrintStyles, margins: Pick<PrintStyles, "marginTop" | "marginRight" | "marginBottom" | "marginLeft">) {
  return `
    @page {
      margin: 0 !important;
    }
    body {
      font-family: ${s.fontFamily};
      font-size: ${s.fontSize};
      line-height: ${s.lineHeight};
      color: ${s.colorText};
      background: ${s.colorBg};
      max-width: 100%;
      padding: ${margins.marginTop} ${margins.marginRight} ${margins.marginBottom} ${margins.marginLeft};
      box-sizing: border-box;
    }
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }
    h4 { font-size: 1.1em; }
    h5 { font-size: 1em; }
    h6 { font-size: 0.9em; }
    h1, h2, h3, h4, h5, h6 {
      color: ${s.colorHeading};
      font-family: ${s.fontFamily};
      margin-top: 1.4em;
      margin-bottom: 0.4em;
    }
    p { margin: 0 0 1em; }
    a { color: ${s.colorText}; text-decoration: underline; }
    blockquote {
      border-left: 3px solid ${s.colorBorder};
      margin: 1.2em 0;
      padding: 0.2em 1em;
      color: ${s.colorMuted};
    }
    code {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 0.88em;
      background: ${s.colorCodeBg};
      color: ${s.colorCode};
      padding: 0.15em 0.35em;
      border-radius: 3px;
    }
    pre {
      background: ${s.colorCodeBg};
      padding: 1em 1.2em;
      border-radius: 6px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    pre code { background: none; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid ${s.colorBorder}; padding: 0.5em 0.75em; }
    th { background: ${s.colorCodeBg}; color: ${s.colorHeading}; }
    hr { border: none; border-top: 1px solid ${s.colorBorder}; margin: 2em 0; }
    img { max-width: 100%; height: auto; }
    body::after {
      content: '';
      display: block;
      height: ${margins.marginBottom};
    }
  `;
}

// CSS scoped para live preview — todos los selectores bajo #md-preview
// para no pelear con el reset de Tailwind
export function buildPreviewCSS(s: PrintStyles): string {
  return `
    #md-preview {
      font-family: ${s.fontFamily};
      font-size: ${s.fontSize};
      line-height: ${s.lineHeight};
      color: ${s.colorText} !important;
      background: ${s.colorBg};
    }
    #md-preview h1 { font-size: 2em; }
    #md-preview h2 { font-size: 1.5em; }
    #md-preview h3 { font-size: 1.25em; }
    #md-preview h4 { font-size: 1.1em; }
    #md-preview h5 { font-size: 1em; }
    #md-preview h6 { font-size: 0.9em; }
    #md-preview h1,
    #md-preview h2,
    #md-preview h3,
    #md-preview h4,
    #md-preview h5,
    #md-preview h6 {
      color: ${s.colorHeading} !important;
      font-family: ${s.fontFamily};
      font-weight: 600;
      margin-top: 1.4em;
      margin-bottom: 0.4em;
    }
    #md-preview p {
      margin: 0 0 1em;
      color: ${s.colorText} !important;
    }
    #md-preview a {
      color: ${s.colorText} !important;
      text-decoration: underline;
    }
    #md-preview strong { color: ${s.colorHeading} !important; }
    #md-preview em { color: ${s.colorMuted} !important; }
    #md-preview blockquote {
      border-left: 3px solid ${s.colorBorder};
      margin: 1.2em 0;
      padding: 0.2em 1em;
      color: ${s.colorMuted} !important;
    }
    #md-preview code {
      font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
      font-size: 0.88em;
      background: ${s.colorCodeBg} !important;
      color: ${s.colorCode} !important;
      padding: 0.15em 0.35em;
      border-radius: 3px;
    }
    #md-preview pre {
      background: ${s.colorCodeBg} !important;
      padding: 1em 1.2em;
      border-radius: 6px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }
    #md-preview pre code {
      background: none !important;
      padding: 0;
      color: ${s.colorCode} !important;
    }
    #md-preview ul, #md-preview ol {
      padding-left: 1.5em;
      margin: 0 0 1em;
      color: ${s.colorText} !important;
    }
    #md-preview li { margin-bottom: 0.25em; color: ${s.colorText} !important; }
    #md-preview table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    #md-preview th,
    #md-preview td {
      border: 1px solid ${s.colorBorder};
      padding: 0.5em 0.75em;
      color: ${s.colorText} !important;
    }
    #md-preview th {
      background: ${s.colorCodeBg} !important;
      color: ${s.colorHeading} !important;
    }
    #md-preview hr {
      border: none;
      border-top: 1px solid ${s.colorBorder};
      margin: 2em 0;
    }
    #md-preview img { max-width: 100%; height: auto; }
  `;
}