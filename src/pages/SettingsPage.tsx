import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { FileText, PenLine, Settings, Type, Palette, Columns, RotateCcw, CheckCircle2, Sun, Moon } from "lucide-react";
import {
  PRESETS,
  DEFAULT_PRESET,
  loadStyles,
  saveStyles,
  type PresetKey,
  type PrintStyles,
} from "../lib/styles";
import { useTheme } from "../lib/theme";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const initial = loadStyles();
  const [preset, setPreset] = useState<PresetKey>(initial.preset);
  const [overrides, setOverrides] = useState<Partial<PrintStyles>>({});

  const activeStyles = { ...PRESETS[preset].styles, ...overrides };

  useEffect(() => {
    saveStyles(preset, overrides);
  }, [preset, overrides]);

  function selectPreset(key: PresetKey) {
    setPreset(key);
    setOverrides({});
  }

  function override(key: keyof PrintStyles, val: string) {
    setOverrides((o) => ({ ...o, [key]: val }));
  }

  const field = (label: string, key: keyof PrintStyles, type = "text") => (
    <label key={key} className="flex flex-col gap-1.5">
      <span className="text-xs text-ui-3">{label}</span>
      <input
        type={type}
        value={activeStyles[key]}
        onChange={(e) => override(key, e.target.value)}
        className="bg-ui border border-ui-sub rounded-md px-3 py-2 text-sm text-ui focus:outline-none focus:border-ui-3 transition-colors"
      />
    </label>
  );

  return (
    <div className="flex flex-col h-screen bg-ui text-ui">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-ui shrink-0">
        <span className="flex items-center gap-2 font-semibold tracking-tight text-ui text-sm md:text-base">
          <FileText size={16} className="text-blue-400 shrink-0" />
          <span className="hidden sm:inline">Markdown Live Converter</span>
          <span className="sm:hidden">MLC</span>
        </span>
        <div className="flex gap-1 md:gap-2">
          <NavLink
            to="/editor"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm transition-colors ${
                isActive ? "bg-ui-raised text-ui" : "text-ui-3 hover:text-ui"
              }`
            }
          >
            <PenLine size={13} />
            <span className="hidden sm:inline">Editor</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm transition-colors ${
                isActive ? "bg-ui-raised text-ui" : "text-ui-3 hover:text-ui"
              }`
            }
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Estilos</span>
          </NavLink>
          <button
            onClick={toggle}
            className="flex items-center justify-center w-8 h-8 rounded-md text-ui-3 hover:text-ui hover:bg-ui-raised transition-colors"
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </nav>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-8 md:space-y-10">

          {/* Presets */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-medium text-ui-4 uppercase tracking-widest">
              <Columns size={12} />
              Preset
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(Object.keys(PRESETS) as PresetKey[]).map((key) => {
                const p = PRESETS[key];
                const isActive = preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => selectPreset(key)}
                    className={`relative text-left rounded-xl p-4 border transition-all ${
                      isActive
                        ? "border-blue-500 bg-ui-raised ring-1 ring-blue-500/30"
                        : "border-ui bg-ui-surface hover:border-ui-sub hover:bg-ui-raised"
                    }`}
                  >
                    {isActive && (
                      <CheckCircle2 size={14} className="absolute top-3 right-3 text-blue-400" />
                    )}
                    <div className="text-sm font-medium mb-1 text-ui" style={{ fontFamily: p.styles.fontFamily }}>
                      {p.label}
                    </div>
                    <div className="text-xs text-ui-4 leading-snug mb-3">{p.description}</div>
                    <div
                      className="rounded-lg p-3 text-xs leading-relaxed"
                      style={{
                        fontFamily: p.styles.fontFamily,
                        color: p.styles.colorText,
                        background: p.styles.colorBg,
                        fontSize: "11px",
                        lineHeight: p.styles.lineHeight,
                      }}
                    >
                      <div style={{ color: p.styles.colorHeading, fontWeight: 600, marginBottom: "4px" }}>
                        Título de ejemplo
                      </div>
                      <div style={{ color: p.styles.colorText }}>
                        Texto con{" "}
                        <code style={{ background: p.styles.colorCodeBg, color: p.styles.colorCode, padding: "1px 4px", borderRadius: 3, fontFamily: "monospace" }}>
                          código
                        </code>{" "}
                        inline.
                      </div>
                      <div style={{ borderLeft: `2px solid ${p.styles.colorBorder}`, paddingLeft: "6px", marginTop: "6px", color: p.styles.colorMuted }}>
                        Una cita.
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Tipografía */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-medium text-ui-4 uppercase tracking-widest">
              <Type size={12} />
              Tipografía
            </h2>
            <div className="rounded-xl border border-ui bg-ui-surface p-4 md:p-5 space-y-4">
              {field("Font family", "fontFamily")}
              <div className="grid grid-cols-2 gap-4">
                {field("Font size", "fontSize")}
                {field("Line height", "lineHeight")}
              </div>
            </div>
          </section>

          {/* Colores */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-medium text-ui-4 uppercase tracking-widest">
              <Palette size={12} />
              Colores
            </h2>
            <div className="rounded-xl border border-ui bg-ui-surface p-4 md:p-5">
              <div className="grid grid-cols-2 gap-4">
                {field("Texto", "colorText", "color")}
                {field("Fondo", "colorBg", "color")}
                {field("Headings", "colorHeading", "color")}
                {field("Muted", "colorMuted", "color")}
                {field("Código texto", "colorCode", "color")}
                {field("Código fondo", "colorCodeBg", "color")}
              </div>
            </div>
          </section>

          {/* Márgenes */}
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xs font-medium text-ui-4 uppercase tracking-widest">
              <Columns size={12} className="rotate-90" />
              Márgenes PDF
            </h2>
            <div className="rounded-xl border border-ui bg-ui-surface p-4 md:p-5">
              <div className="grid grid-cols-2 gap-4">
                {field("Top", "marginTop")}
                {field("Right", "marginRight")}
                {field("Bottom", "marginBottom")}
                {field("Left", "marginLeft")}
              </div>
            </div>
          </section>

          <button
            onClick={() => { setPreset(DEFAULT_PRESET); setOverrides({}); }}
            className="flex items-center gap-1.5 text-sm text-ui-4 hover:text-ui-2 transition-colors pb-8"
          >
            <RotateCcw size={13} />
            Restaurar valores por defecto
          </button>
        </div>
      </div>

      <footer className="hidden md:flex items-center justify-between px-6 py-1.5 border-t border-ui bg-ui shrink-0">
        <a
          href="https://github.com/JulsCatalan/Markdown-Live-Converter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-ui-5 hover:text-ui-3 transition-colors"
        >
          Made by Juls
        </a>
        <Link to="/legal" className="text-xs text-ui-5 hover:text-ui-3 transition-colors">
          Privacidad & Términos
        </Link>
      </footer>
    </div>
  );
}
