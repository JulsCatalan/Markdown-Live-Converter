import { useRef, useState } from "react";
import type { RefObject } from "react";
import { Upload, FileDown, Loader2 } from "lucide-react";
import { loadStyles, buildPrintCSS } from "../lib/styles";

interface Props {
  markdown: string;
  setMarkdown: (val: string) => void;
  previewRef: RefObject<HTMLDivElement | null>;
}

function getTitleFromMarkdown(markdown: string): string {
  const firstLine = markdown.split("\n").find((l) => l.trim().length > 0) ?? "";
  return firstLine.replace(/^#+\s*/, "").trim() || "documento";
}

export default function Toolbar({ markdown, setMarkdown, previewRef }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMarkdown(reader.result as string);
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
    <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-800 bg-stone-950 shrink-0">
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
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border border-stone-700 bg-stone-900 hover:bg-stone-800 hover:border-stone-600 text-stone-300 transition-colors disabled:opacity-40"
      >
        <Upload size={12} />
        <span className="hidden sm:inline">Subir .md</span>
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
        <div className="w-16 md:w-24 h-1 rounded-full bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}