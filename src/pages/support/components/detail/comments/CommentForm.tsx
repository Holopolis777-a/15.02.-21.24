import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';

interface CommentFormProps {
  onSubmit: (content: string, isInternal: boolean, attachments: File[]) => Promise<void>;
  isSubmitting: boolean;
  showInternalOption?: boolean;
}

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const CommentForm: React.FC<CommentFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  showInternalOption = false
}) => {
  const [content, setContent] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError('Ungültiges Dateiformat. Erlaubt sind PDF, DOC, DOCX, JPG und PNG.');
        continue;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setError('Datei ist zu groß. Maximale Größe ist 10MB.');
        continue;
      }
      
      validFiles.push(file);
    }
    
    return validFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await onSubmit(content.trim(), isInternal, attachments);
    setContent('');
    setAttachments([]);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Schreiben Sie einen Kommentar..."
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="relative cursor-pointer">
            <input
              type="file"
              multiple
              className="sr-only"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={(e) => {
                if (e.target.files) {
                  const validFiles = validateFiles(e.target.files);
                  setAttachments(validFiles);
                }
              }}
              disabled={isSubmitting}
            />
            <div className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
              <Upload className="w-5 h-5" />
              <span>Dateien anhängen</span>
            </div>
          </label>

          {showInternalOption && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700">Interner Kommentar</span>
            </label>
          )}
        </div>

        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Wird gesendet...' : 'Senden'}
        </button>
      </div>

      {attachments.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Ausgewählte Dateien:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {attachments.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default CommentForm;