import { useState, useRef, useCallback } from "react";
import { FileText, Settings, PenLine, Eye, Code } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import Toolbar from "../components/Toolbar";

const DEFAULT_MD = `# Hola Mundo

Este es un **ejemplo** de markdown con:

- Listas
- _Cursivas_
- \`código inline\`

## Subtítulo

> Una cita de ejemplo

\`\`\`ts
const saludo = (nombre: string) => \`Hola, \${nombre}\`;
\`\`\`
`;

// Mobile: toggle between editor and preview tabs
// Desktop: resizable split pane
export default function EditorPage() {
  const [markdown, setMarkdown] = useState(DEFAULT_MD);
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPct, setSplitPct] = useState(50);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
  const dragging = useRef(false);

  const onMouseDown = useCallback(() => {
    dragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const { left, width } = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - left) / width) * 100;
    setSplitPct(Math.min(Math.max(pct, 20), 80));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-stone-950 text-stone-100"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-stone-800 shrink-0">
        <span className="flex items-center gap-2 font-semibold tracking-tight text-stone-100 text-sm md:text-base">
          <FileText size={16} className="text-blue-400 shrink-0" />
          <span className="hidden sm:inline">Markdown Live Converter</span>
          <span className="sm:hidden">MLC</span>
        </span>
        <div className="flex gap-1 md:gap-2">
          <NavLink
            to="/editor"
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-md text-xs md:text-sm transition-colors ${
                isActive ? "bg-stone-800 text-stone-100" : "text-stone-400 hover:text-stone-100"
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
                isActive ? "bg-stone-800 text-stone-100" : "text-stone-400 hover:text-stone-100"
              }`
            }
          >
            <Settings size={13} />
            <span className="hidden sm:inline">Estilos</span>
          </NavLink>
        </div>
      </nav>

      <Toolbar markdown={markdown} setMarkdown={setMarkdown} previewRef={previewRef} />

      {/* Mobile tab switcher */}
      <div className="flex md:hidden border-b border-stone-800 shrink-0">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
            mobileTab === "editor"
              ? "text-stone-100 border-b-2 border-blue-500"
              : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <Code size={12} />
          Editor
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
            mobileTab === "preview"
              ? "text-stone-100 border-b-2 border-blue-500"
              : "text-stone-500 hover:text-stone-300"
          }`}
        >
          <Eye size={12} />
          Preview
        </button>
      </div>

      {/* Mobile: single pane */}
      <div className="flex md:hidden flex-1 overflow-hidden">
        {mobileTab === "editor" ? (
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        ) : (
          <MarkdownPreview markdown={markdown} previewRef={previewRef} />
        )}
      </div>

      {/* Desktop: resizable split pane */}
      <div ref={containerRef} className="hidden md:flex flex-1 overflow-hidden">
        <div style={{ width: `${splitPct}%` }} className="flex flex-col overflow-hidden">
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        <div
          onMouseDown={onMouseDown}
          className="group relative flex items-center justify-center w-1 shrink-0 bg-stone-800 hover:bg-stone-600 cursor-col-resize transition-colors z-10"
        >
          <div className="absolute flex flex-col gap-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 rounded-full bg-stone-400" />
            ))}
          </div>
        </div>

        <div style={{ width: `${100 - splitPct}%` }} className="flex flex-col overflow-hidden">
          <MarkdownPreview markdown={markdown} previewRef={previewRef} />
        </div>
      </div>

      {/* Footer */}
      <footer className="hidden md:flex items-center justify-between px-6 py-1.5 border-t border-stone-800 bg-stone-950 shrink-0">
        <a
          href="https://github.com/JulsCatalan/Markdown-Live-Converter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
        >
          Made by Juls
        </a>
        <Link to="/legal" className="text-xs text-stone-600 hover:text-stone-400 transition-colors">
          Privacidad & Términos
        </Link>
      </footer>
    </div>
  );
}