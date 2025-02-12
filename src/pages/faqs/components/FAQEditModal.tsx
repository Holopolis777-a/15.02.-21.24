import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FAQ, FAQFormData, FAQTarget } from '../../../types/faq';
import { createDocument, updateDocument } from '../../../lib/firebase/db';
import { useAuthStore } from '../../../store/authStore';
import RichTextEditor from './RichTextEditor';

interface FAQEditModalProps {
  faq?: FAQ;
  onClose: () => void;
}

const INITIAL_FORM_DATA: FAQFormData = {
  title: '',
  content: '',
  targets: [],
  priority: 5,
  isActive: false
};

const TARGET_OPTIONS: { value: FAQTarget; label: string }[] = [
  { value: 'employer', label: 'Arbeitgeber' },
  { value: 'broker', label: 'Vermittler' },
  { value: 'employee_normal', label: 'Mitarbeiter (Standard)' },
  { value: 'employee_salary', label: 'Mitarbeiter (Gehaltsumwandlung)' },
  { value: 'customer', label: 'Kunde' }
];

const FAQEditModal: React.FC<FAQEditModalProps> = ({ faq, onClose }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<FAQFormData>(faq || INITIAL_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else if (name === 'priority') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTargetToggle = (target: FAQTarget) => {
    setFormData(prev => ({
      ...prev,
      targets: prev.targets.includes(target)
        ? prev.targets.filter(t => t !== target)
        : [...prev.targets, target]
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const validateForm = () => {
    if (formData.title.length < 5) throw new Error('Der Titel muss mindestens 5 Zeichen lang sein');
    if (formData.title.length > 200) throw new Error('Der Titel darf maximal 200 Zeichen lang sein');
    if (!formData.content) throw new Error('Bitte geben Sie einen Inhalt ein');
    if (formData.content.length > 10000) throw new Error('Der Inhalt darf maximal 10000 Zeichen lang sein');
    if (formData.targets.length === 0) throw new Error('Bitte wählen Sie mindestens eine Zielgruppe aus');
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
        updatedAt: timestamp,
        ...(faq ? {} : {
          createdAt: timestamp,
          createdBy: user.id
        })
      };

      if (faq) {
        await updateDocument('faqs', faq.id, data);
      } else {
        await createDocument('faqs', data);
      }

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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {faq ? 'FAQ bearbeiten' : 'Neue FAQ erstellen'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
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
                minLength={5}
                maxLength={200}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.title.length}/200 Zeichen
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zielgruppen <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {TARGET_OPTIONS.map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.targets.includes(value)}
                      onChange={() => handleTargetToggle(value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Priorität <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inhalt <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.content.length}/10000 Zeichen
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                FAQ aktiv
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
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

export default FAQEditModal;