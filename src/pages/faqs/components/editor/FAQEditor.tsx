import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FAQ, FAQFormData } from '../../../../types/faq';
import { createFAQ, updateFAQ } from '../../../../lib/firebase/faq';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import TargetSelector from './TargetSelector';

interface FAQEditorProps {
  faq?: FAQ;
  onClose: () => void;
  onSave: () => void;
}

const INITIAL_DATA: FAQFormData = {
  title: '',
  content: '',
  targets: []
};

const FAQEditor: React.FC<FAQEditorProps> = ({ faq, onClose, onSave }) => {
  const [formData, setFormData] = useState<FAQFormData>(faq || INITIAL_DATA);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!formData.title.trim()) {
        throw new Error('Bitte geben Sie einen Titel ein');
      }

      if (!formData.content.trim()) {
        throw new Error('Bitte geben Sie einen Inhalt ein');
      }

      if (formData.targets.length === 0) {
        throw new Error('Bitte wählen Sie mindestens eine Zielgruppe aus');
      }

      if (faq) {
        await updateFAQ(faq.id, formData, image || undefined);
      } else {
        await createFAQ(formData, image || undefined);
      }

      onSave();
      onClose();
    } catch (err) {
      console.error('Error saving FAQ:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {faq ? 'FAQ bearbeiten' : 'Neue FAQ erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titel <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <ImageUpload
            currentImage={formData.imageUrl}
            onImageSelect={setImage}
          />

          <TargetSelector
            selected={formData.targets}
            onChange={(targets) => setFormData({ ...formData, targets })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Inhalt <span className="text-red-500">*</span>
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQEditor;