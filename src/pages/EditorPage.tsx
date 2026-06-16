import { useState, useRef, useCallback } from "react";
import { FileText, Settings, PenLine, Eye, Code, Plus, X, Sun, Moon } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import MarkdownEditor from "../components/MarkdownEditor";
import MarkdownPreview from "../components/MarkdownPreview";
import Toolbar from "../components/Toolbar";
import { useTheme } from "../lib/theme";

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

interface Tab {
  id: string;
  content: string;
}

let nextId = 1;
function newTab(content = ""): Tab {
  return { id: String(nextId++), content };
}

function getTabTitle(content: string): string {
  const firstLine = content.split("\n").find((l) => l.trim().length > 0) ?? "";
  return firstLine.replace(/^#+\s*/, "").trim() || "Sin título";
}

export default function EditorPage() {
  const { theme, toggle } = useTheme();
  const [showFR, setShowFR] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([newTab(DEFAULT_MD)]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  // dragId lives in both state (for visual) and ref (stable value for onDrop)
  const [dragId, setDragId]       = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragIdRef = useRef<string | null>(null);

  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];
  const markdown = activeTab.content;

  function setMarkdown(val: string) {
    setTabs((prev) => prev.map((t) => (t.id === activeId ? { ...t, content: val } : t)));
  }

  function addTab(content = "") {
    const tab = newTab(content);
    setTabs((prev) => [...prev, tab]);
    setActiveId(tab.id);
  }

  function closeTab(id: string) {
    setTabs((prev) => {
      if (prev.length === 1) return prev;
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (id === activeId) setActiveId(next[Math.min(idx, next.length - 1)].id);
      return next;
    });
  }

  // ── Drag & drop reorder ──
  function onDragStart(e: React.DragEvent, id: string) {
    dragIdRef.current = id;
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragIdRef.current) setDragOverId(id);
  }

  function onDragLeave(e: React.DragEvent) {
    // Ignore if cursor moved to a child element inside the same tab
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragOverId(null);
  }

  function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    const fromId = dragIdRef.current; // read ref — never stale
    clearDrag();
    if (!fromId || fromId === targetId) return;
    setTabs((prev) => {
      const from = prev.findIndex((t) => t.id === fromId);
      const to   = prev.findIndex((t) => t.id === targetId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function clearDrag() {
    dragIdRef.current = null;
    setDragId(null);
    setDragOverId(null);
  }

  const previewRef   = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPct, setSplitPct]   = useState(50);
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
    setSplitPct(Math.min(Math.max(((e.clientX - left) / width) * 100, 20), 80));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  return (
    <div
      className="flex flex-col h-screen bg-ui text-ui"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
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

      <Toolbar
        markdown={markdown}
        setMarkdown={setMarkdown}
        onUpload={(content) => addTab(content)}
        previewRef={previewRef}
        showFR={showFR}
        onToggleFR={() => setShowFR((v) => !v)}
      />

      {/* File tabs */}
      <div className="flex items-center border-b border-ui bg-ui shrink-0 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive   = tab.id === activeId;
          const isDragging = tab.id === dragId;
          const isOver     = tab.id === dragOverId;
          return (
            <div
              key={tab.id}
              draggable
              onDragStart={(e) => onDragStart(e, tab.id)}
              onDragOver={(e)  => onDragOver(e, tab.id)}
              onDragLeave={onDragLeave}
              onDrop={(e)      => onDrop(e, tab.id)}
              onDragEnd={clearDrag}
              onClick={() => setActiveId(tab.id)}
              className={[
                "group relative flex items-center gap-1.5 px-3 py-2 text-xs cursor-pointer shrink-0 select-none border-r border-ui transition-colors",
                isActive
                  ? "bg-ui-surface text-ui border-t-2 border-t-blue-500"
                  : "bg-ui text-ui-4 hover:text-ui-2 hover:bg-ui-surface border-t-2 border-t-transparent",
                isDragging ? "opacity-40" : "",
                isOver ? "shadow-[-2px_0_0_0_#3b82f6]" : "",
              ].join(" ")}
            >
              <span className="max-w-[120px] truncate">{getTabTitle(tab.content)}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                  className="opacity-0 group-hover:opacity-100 hover:text-ui transition-opacity ml-0.5"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={() => addTab()}
          className="flex items-center justify-center w-8 h-full text-ui-5 hover:text-ui-2 hover:bg-ui-surface transition-colors shrink-0"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Mobile tab switcher */}
      <div className="flex md:hidden border-b border-ui shrink-0">
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
            mobileTab === "editor" ? "text-ui border-b-2 border-blue-500" : "text-ui-4 hover:text-ui-2"
          }`}
        >
          <Code size={12} />
          Editor
        </button>
        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs transition-colors ${
            mobileTab === "preview" ? "text-ui border-b-2 border-blue-500" : "text-ui-4 hover:text-ui-2"
          }`}
        >
          <Eye size={12} />
          Preview
        </button>
      </div>

      {/* Mobile: single pane */}
      <div key={activeId} className="flex md:hidden flex-1 overflow-hidden animate-tab-in">
        {mobileTab === "editor" ? (
          <MarkdownEditor value={markdown} onChange={setMarkdown} showFR={showFR} onToggleFR={() => setShowFR((v) => !v)} onCloseFR={() => setShowFR(false)} />
        ) : (
          <MarkdownPreview markdown={markdown} previewRef={previewRef} />
        )}
      </div>

      {/* Desktop: resizable split pane */}
      <div ref={containerRef} className="hidden md:flex flex-1 overflow-hidden">
        <div style={{ width: `${splitPct}%` }} className="flex flex-col overflow-hidden">
          <MarkdownEditor value={markdown} onChange={setMarkdown} showFR={showFR} onToggleFR={() => setShowFR((v) => !v)} onCloseFR={() => setShowFR(false)} />
        </div>

        <div
          onMouseDown={onMouseDown}
          className="group relative flex items-center justify-center w-1 shrink-0 bg-ui-raised hover:bg-ui-sub cursor-col-resize transition-colors z-10"
        >
          <div className="absolute flex flex-col gap-0.5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-0.5 h-0.5 rounded-full bg-ui-3" />
            ))}
          </div>
        </div>

        <div key={activeId} style={{ width: `${100 - splitPct}%` }} className="flex flex-col overflow-hidden animate-tab-in">
          <MarkdownPreview markdown={markdown} previewRef={previewRef} />
        </div>
      </div>

      {/* Footer */}
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
