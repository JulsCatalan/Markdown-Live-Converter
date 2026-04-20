interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-4 py-2 text-xs text-stone-500 border-b border-stone-700 bg-stone-900 tracking-wide">
        Markdown
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="flex-1 resize-none bg-stone-900 text-stone-200 caret-stone-400 font-mono text-sm p-5 focus:outline-none leading-relaxed placeholder:text-stone-600"
        placeholder="Escribe tu markdown aquí..."
      />
    </div>
  );
}