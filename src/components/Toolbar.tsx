import { useRef, useState } from "react";
import type { RefObject } from "react";
import { Upload, FileDown, Loader2, Save, Search } from "lucide-react";
import { loadStyles, buildPrintCSS } from "../lib/styles";

interface Props {
  markdown: string;
  setMarkdown: (val: string) => void;
  onUpload: (content: string) => void;
  previewRef: RefObject<HTMLDivElement | null>;
  showFR: boolean;
  onToggleFR: () => void;
}

function getTitleFromMarkdown(markdown: string): string {
  const firstLine = markdown.split("\n").find((l) => l.trim().length > 0) ?? "";
  return firstLine.replace(/^#+\s*/, "").trim() || "documento";
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "documento";
}

export default function Toolbar({ markdown, onUpload, previewRef, showFR, onToggleFR }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleSaveMD() {
    const title = getTitleFromMarkdown(markdown);
    const filename = `${toSlug(title)}.md`;
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleExportPDF() {
    const content = previewRef.current;
    if (!content || exporting) return;

    const { styles } = loadStyles();
    const title = getTitleFromMarkdown(markdown);

    setExporting(true);
    setProgress(20);

    const css = buildPrintCSS(styles, {
      marginTop: styles.marginTop,
      marginRight: styles.marginRight,
      marginBottom: styles.marginBottom,
      marginLeft: styles.marginLeft,
    });

    const iframe = document.createElement("iframe");
    iframe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;border:none;opacity:0;pointer-events:none;";
    document.body.appendChild(iframe);

    setProgress(50);

    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      ${css}
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    </style>
  </head>
  <body>${content.innerHTML}</body>
</html>`);
    doc.close();

    setProgress(80);

    iframe.onload = () => {
      setProgress(95);
      setTimeout(() => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        setProgress(100);
        setTimeout(() => {
          document.body.removeChild(iframe);
          setExporting(false);
          setProgress(0);
        }, 1000);
      }, 300);
    };
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 border-b border-ui bg-ui shrink-0">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        className="hidden"
        onChange={handleFileUpload}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-ui-sub bg-ui-surface hover:bg-ui-raised hover:border-ui-sub text-ui-2 transition-colors disabled:opacity-40"
      >
        <Upload size={12} />
        <span className="hidden sm:inline">Subir .md</span>
      </button>

      <button
        onClick={handleSaveMD}
        disabled={exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-ui-sub bg-ui-surface hover:bg-ui-raised hover:border-ui-sub text-ui-2 transition-colors disabled:opacity-40"
      >
        <Save size={12} />
        <span className="hidden sm:inline">Guardar .md</span>
      </button>

      <button
        onClick={handleExportPDF}
        disabled={exporting}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-blue-600 bg-blue-600 hover:bg-blue-500 hover:border-blue-500 text-white transition-colors font-medium disabled:opacity-60"
      >
        {exporting ? <Loader2 size={12} className="animate-spin" /> : <FileDown size={12} />}
        <span className="hidden sm:inline">{exporting ? "Exportando…" : "Exportar PDF"}</span>
      </button>

      {exporting && (
        <div className="w-16 md:w-24 h-1 rounded-full bg-ui-raised overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex-1" />

      <button
        onClick={onToggleFR}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors ${
          showFR
            ? "border-blue-500 bg-blue-500/10 text-blue-400"
            : "border-ui-sub bg-ui-surface hover:bg-ui-raised text-ui-3 hover:text-ui"
        }`}
        title="Buscar y reemplazar (Ctrl+H)"
      >
        <Search size={12} />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </div>
  );
}
