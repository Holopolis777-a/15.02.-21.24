import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NewsPost } from '../../../types/news';
import { createDocument, updateDocument } from '../../../lib/firebase/db';
import { useAuthStore } from '../../../store/authStore';
import RichTextEditor from './editor/RichTextEditor';
import ImageUpload from './editor/ImageUpload';
import TargetGroupSelector from './editor/TargetGroupSelector';

interface NewsEditModalProps {
  news?: NewsPost;
  onClose: () => void;
}

const INITIAL_FORM_DATA = {
  title: '',
  content: '',
  imageUrl: '',
  targetGroups: [],
  isActive: false
};

const NewsEditModal: React.FC<NewsEditModalProps> = ({ news, onClose }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState(news || INITIAL_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) throw new Error('Bitte geben Sie einen Titel ein');
    if (!formData.content.trim()) throw new Error('Bitte geben Sie einen Inhalt ein');
    if (formData.targetGroups.length === 0) throw new Error('Bitte wählen Sie mindestens eine Zielgruppe aus');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setError(null);
    setIsLoading(true);

    try {
      validateForm();

      const timestamp = new Date().toISOString();
      const data = {
        ...formData,
        publishedAt: timestamp,
        updatedAt: timestamp,
        ...(news ? {} : {
          createdAt: timestamp,
          createdBy: user.id,
          views: 0,
          interactions: 0
        })
      };

      if (news) {
        await updateDocument('news_posts', news.id, data);
      } else {
        await createDocument('news_posts', data);
      }

      onClose();
    } catch (err) {
      console.error('Error saving news:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {news ? 'News bearbeiten' : 'Neue News erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
          <form id="newsForm" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <ImageUpload
                currentImage={formData.imageUrl}
                onUpload={handleImageUpload}
              />

              <TargetGroupSelector
                selectedGroups={formData.targetGroups}
                onChange={(groups) => setFormData(prev => ({ ...prev, targetGroups: groups }))}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inhalt <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  News aktiv (sofort veröffentlichen)
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - Fixed */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t flex justify-end space-x-4">
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
            form="newsForm"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsEditModal;