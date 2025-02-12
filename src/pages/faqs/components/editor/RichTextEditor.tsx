import React, { useRef, useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, Link, Quote } from 'lucide-react';

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

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('URL eingeben:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Fett"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Kursiv"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Liste"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Nummerierte Liste"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <button
          type="button"
          onClick={handleLink}
          className="p-2 hover:bg-gray-200 rounded"
          title="Link"
        >
          <Link className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="p-2 hover:bg-gray-200 rounded"
          title="Zitat"
        >
          <Quote className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={() => {
          if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
};

export default RichTextEditor;