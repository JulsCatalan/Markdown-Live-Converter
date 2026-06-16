import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { ChevronUp, ChevronDown, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  showFR: boolean;
  onToggleFR: () => void;
  onCloseFR: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeHTML(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function findMatches(text: string, query: string): number[] {
  if (!query) return [];
  const out: number[] = [];
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const pos = lower.indexOf(q, i);
    if (pos === -1) break;
    out.push(pos);
    i = pos + 1;
  }
  return out;
}

function buildHighlightHTML(text: string, query: string, currentIdx: number, positions: number[]): string {
  if (!positions.length) return escapeHTML(text);
  let html = "";
  let last = 0;
  positions.forEach((pos, i) => {
    html += escapeHTML(text.slice(last, pos));
    const bg = i === currentIdx
      ? "rgba(251,191,36,0.65)"   // current match — amber bright
      : "rgba(251,191,36,0.22)";  // other matches — amber dim
    html += `<span style="background:${bg};border-radius:2px;">${escapeHTML(text.slice(pos, pos + query.length))}</span>`;
    last = pos + query.length;
  });
  html += escapeHTML(text.slice(last));
  return html;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MarkdownEditor({ value, onChange, showFR, onToggleFR, onCloseFR }: Props) {
  const [find, setFind]             = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchIdx, setMatchIdx]     = useState(0);

  const taRef       = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const findRef     = useRef<HTMLInputElement>(null);

  const matches  = useMemo(() => findMatches(value, find), [value, find]);
  const safeIdx  = matches.length > 0 ? matchIdx % matches.length : 0;

  // Reset index when query changes
  useEffect(() => { setMatchIdx(0); }, [find]);

  // Focus find input when panel opens
  useEffect(() => {
    if (showFR) setTimeout(() => findRef.current?.focus(), 30);
  }, [showFR]);

  // Select current match in textarea
  useEffect(() => {
    if (!showFR || !find || !matches.length) return;
    const ta = taRef.current;
    if (!ta) return;
    const start = matches[safeIdx];
    ta.setSelectionRange(start, start + find.length);
    // Scroll textarea to show the match
    const lineHeight = parseFloat(getComputedStyle(ta).lineHeight);
    const lines = value.slice(0, start).split("\n").length - 1;
    ta.scrollTop = Math.max(0, lines * lineHeight - ta.clientHeight / 2);
  }, [safeIdx, matches, find, showFR, value]);

  // Sync highlight backdrop scroll with textarea
  function syncScroll() {
    const ta = taRef.current;
    const bd = backdropRef.current;
    if (!ta || !bd) return;
    bd.scrollTop  = ta.scrollTop;
    bd.scrollLeft = ta.scrollLeft;
  }

  const goNext = useCallback(() => {
    if (!matches.length) return;
    setMatchIdx((i) => (i + 1) % matches.length);
  }, [matches.length]);

  const goPrev = useCallback(() => {
    if (!matches.length) return;
    setMatchIdx((i) => (i - 1 + matches.length) % matches.length);
  }, [matches.length]);

  function doReplace() {
    if (!find || !matches.length) return;
    const pos    = matches[safeIdx];
    const newVal = value.slice(0, pos) + replaceText + value.slice(pos + find.length);
    onChange(newVal);
  }

  function doReplaceAll() {
    if (!find) return;
    const re = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    onChange(value.replace(re, replaceText));
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key === "h") { e.preventDefault(); onToggleFR(); }
    if (e.key === "Escape" && showFR) onCloseFR();
  }

  // Build highlight HTML only when panel is open
  const highlightHTML = useMemo(
    () => (showFR && find && matches.length ? buildHighlightHTML(value, find, safeIdx, matches) : ""),
    [showFR, find, value, safeIdx, matches]
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" onKeyDown={onKeyDown}>

      {/* Header */}
      <div className="px-4 py-2 text-xs text-ui-4 border-b border-ui-sub bg-ui-surface tracking-wide shrink-0">
        Markdown
      </div>

      {/* Find & Replace panel */}
      {showFR && (
        <div className="border-b border-ui-sub bg-ui-surface px-3 py-2.5 flex flex-col gap-2 shrink-0 animate-tab-in">
          {/* Find row */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ui-4 w-14 shrink-0">Buscar</span>
            <input
              ref={findRef}
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goNext()}
              placeholder="Texto a buscar…"
              className="flex-1 bg-ui border border-ui-sub rounded px-2 py-1 text-xs text-ui focus:outline-none focus:border-ui-3 placeholder:text-ui-4"
            />
            <span className="text-xs text-ui-4 w-10 text-center shrink-0">
              {matches.length ? `${safeIdx + 1}/${matches.length}` : "–"}
            </span>
            <button onClick={goPrev}   className="text-ui-3 hover:text-ui transition-colors"><ChevronUp   size={13} /></button>
            <button onClick={goNext}   className="text-ui-3 hover:text-ui transition-colors"><ChevronDown size={13} /></button>
            <button onClick={onCloseFR} className="text-ui-4 hover:text-ui transition-colors ml-0.5"><X size={13} /></button>
          </div>
          {/* Replace row */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-ui-4 w-14 shrink-0">Reemplazar</span>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doReplace()}
              placeholder="Reemplazar con…"
              className="flex-1 bg-ui border border-ui-sub rounded px-2 py-1 text-xs text-ui focus:outline-none focus:border-ui-3 placeholder:text-ui-4"
            />
            <button
              onClick={doReplace}
              disabled={!find || !matches.length}
              className="px-2 py-1 text-xs rounded border border-ui-sub bg-ui hover:bg-ui-raised text-ui-2 transition-colors disabled:opacity-40 shrink-0"
              title="Reemplazar este"
            >1×</button>
            <button
              onClick={doReplaceAll}
              disabled={!find || !matches.length}
              className="px-2 py-1 text-xs rounded border border-ui-sub bg-ui hover:bg-ui-raised text-ui-2 transition-colors disabled:opacity-40 shrink-0"
              title="Reemplazar todos"
            >All</button>
          </div>
        </div>
      )}

      {/* Editor area: backdrop highlight + textarea stacked */}
      <div className="relative flex-1 overflow-hidden bg-ui-surface">

        {/* Highlight backdrop — same font metrics as textarea, transparent text */}
        <div
          ref={backdropRef}
          aria-hidden="true"
          className="absolute inset-0 p-5 font-mono text-sm leading-relaxed overflow-auto scrollbar-none pointer-events-none"
          style={{
            color: "transparent",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: highlightHTML || escapeHTML(value) }}
        />

        {/* Actual textarea — transparent background so highlights show through */}
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          spellCheck={false}
          className="absolute inset-0 resize-none bg-transparent text-ui-edit caret-ui-3 font-mono text-sm p-5 focus:outline-none leading-relaxed placeholder-ui-5"
          placeholder="Escribe tu markdown aquí…"
        />
      </div>
    </div>
  );
}
