import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Code, Quote } from 'lucide-react';

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
    // Save current selection
    const selection = window.getSelection();
    const range = selection?.getRangeAt(0);

    // Focus editor before executing command
    if (editorRef.current) {
      editorRef.current.focus();
      
      // Restore selection if it exists
      if (range) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      // Execute command
      document.execCommand(command, false, value);
      
      // Update content
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
    
    // Handle tab
    if (e.key === 'Tab') {
      e.preventDefault();
      execCommand('insertHTML', '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
  };

  const handleLink = () => {
    const url = prompt('URL eingeben:', 'https://');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    execCommand('insertText', text);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b px-3 py-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Fett (Strg+B)"
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Kursiv (Strg+I)"
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Unterstrichen (Strg+U)"
        >
          <Underline className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Aufzählung"
        >
          <List className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Nummerierte Liste"
        >
          <ListOrdered className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button
          type="button"
          onClick={handleLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Link einfügen"
        >
          <Link className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<pre>')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Code-Block"
        >
          <Code className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Zitat"
        >
          <Quote className="w-5 h-5" />
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none"
      />
    </div>
  );
};

export default RichTextEditor;