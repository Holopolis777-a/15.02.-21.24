import React, { useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Fett"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Kursiv"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Unterstrichen"
        >
          <u>U</u>
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Liste"
        >
          • Liste
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Nummerierte Liste"
        >
          1. Liste
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          type="button"
          onClick={() => {
            const url = prompt('URL eingeben:');
            if (url) execCommand('createLink', url);
          }}
          className="p-1 hover:bg-gray-200 rounded"
          title="Link"
        >
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
};

export default RichTextEditor;