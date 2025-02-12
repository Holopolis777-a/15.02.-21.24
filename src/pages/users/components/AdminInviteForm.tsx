import React, { useState } from 'react';
import { useAdminInvite } from '../../../hooks/useAdminInvite';

interface AdminInviteFormProps {
  onClose: () => void;
}

const AdminInviteForm: React.FC<AdminInviteFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    message: ''
  });
  const { sendInvite, isLoading, error } = useAdminInvite();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await sendInvite(formData);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          E-Mail-Adresse <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Vorname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nachname <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Persönliche Nachricht
        </label>
        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Optionale Nachricht an den neuen Administrator..."
        />
      </div>

      <div className="flex justify-end space-x-3">
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
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Wird gesendet...' : 'Einladung senden'}
        </button>
      </div>
    </form>
  );
};

export default AdminInviteForm;