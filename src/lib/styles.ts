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
    description: "Serif refinado, amplio espacio, tipografía editorial",
    styles: {
      fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
      fontSize: "16px",
      lineHeight: "1.8",
      colorText: "#18181b",       // zinc-900
      colorBg: "#fafafa",         // zinc-50
      colorHeading: "#09090b",    // zinc-950
      colorMuted: "#3f3f46",      // zinc-700
      colorBorder: "#e4e4e7",     // zinc-200
      colorCode: "#3f3f46",       // zinc-700
      colorCodeBg: "#f4f4f5",     // zinc-100
      marginTop: "25mm",
      marginRight: "25mm",
      marginBottom: "25mm",
      marginLeft: "25mm",
    },
  },
  moderno: {
    label: "Moderno",
    description: "Sans-serif limpio, ultra minimalista, márgenes ajustados",
    styles: {
      fontFamily: '"Inter", "DM Sans", system-ui, -apple-system, sans-serif',
      fontSize: "15px",
      lineHeight: "1.65",
      colorText: "#27272a",       // zinc-800
      colorBg: "#ffffff",
      colorHeading: "#09090b",    // zinc-950
      colorMuted: "#3f3f46",      // zinc-700
      colorBorder: "#e4e4e7",     // zinc-200
      colorCode: "#18181b",       // zinc-900
      colorCodeBg: "#f4f4f5",     // zinc-100
      marginTop: "18mm",
      marginRight: "18mm",
      marginBottom: "18mm",
      marginLeft: "18mm",
    },
  },
  relajado: {
    label: "Relajado",
    description: "Monospace suave, fondo cálido, lectura cómoda",
    styles: {
      fontFamily: '"Lora", "Source Serif 4", Georgia, serif',
      fontSize: "17px",
      lineHeight: "1.9",
      colorText: "#3f3f46",       // zinc-700
      colorBg: "#fafafa",         // zinc-50
      colorHeading: "#18181b",    // zinc-900
      colorMuted: "#71717a",      // zinc-500
      colorBorder: "#e4e4e7",     // zinc-200
      colorCode: "#27272a",       // zinc-800
      colorCodeBg: "#f4f4f5",     // zinc-100
      marginTop: "22mm",
      marginRight: "28mm",
      marginBottom: "22mm",
      marginLeft: "28mm",
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