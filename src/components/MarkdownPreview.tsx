import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { marked } from "marked";
import { loadStyles, buildPreviewCSS } from "../lib/styles";

interface Props {
  markdown: string;
  previewRef: RefObject<HTMLDivElement | null>;
}

export default function MarkdownPreview({ markdown, previewRef }: Props) {
  const [html, setHtml] = useState("");
  const [{ styles }, setStyles] = useState(loadStyles);

  useEffect(() => {
    function onStorage() { setStyles(loadStyles()); }
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
    };
  }, []);

  useEffect(() => {
    setHtml(marked.parse(markdown) as string);
  }, [markdown]);

  useEffect(() => {
    const id = "md-preview-styles";
    let tag = document.getElementById(id) as HTMLStyleElement | null;
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = buildPreviewCSS(styles);
  }, [styles]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-2 text-xs text-ui-4 border-b border-ui bg-ui tracking-wide">
        Preview
      </div>
      <div
        className="flex-1 overflow-y-auto p-10"
        style={{ background: styles.colorBg }}
      >
        <div
          ref={previewRef}
          id="md-preview"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
