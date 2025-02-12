import React, { useState } from 'react';
import { createCompanyInvitation } from '../../../lib/firebase/services/companyInviteService';
import CompanyLogoUpload from '../../../components/company/CompanyLogoUpload';
import { useAuthStore } from '../../../store/authStore';

interface CompanyInviteFormProps {
  onClose: () => void;
}

const CompanyInviteForm: React.FC<CompanyInviteFormProps> = ({ onClose }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    legalForm: '',
    industry: '',
    contactPerson: '',
    email: '',
    phone: '',
    employeeCount: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    logoUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!user?.id) {
        throw new Error('Benutzer nicht gefunden');
      }

      const inviteData = {
        ...formData,
        invitedBy: user.id
      };

      await createCompanyInvitation(inviteData);
      setSuccess('Einladung wurde erfolgreich versendet');
      setTimeout(onClose, 2000);
    } catch (err) {
      console.error('Error inviting company:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
          {success}
        </div>
      )}

      <CompanyLogoUpload
        onUploadSuccess={(logoUrl) => {
          setFormData(prev => ({ ...prev, logoUrl }));
          setSuccess('Logo wurde erfolgreich hochgeladen');
        }}
        onUploadError={(error) => setError(error)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Firmenname <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rechtsform <span className="text-red-500">*</span>
          </label>
          <select
            name="legalForm"
            required
            value={formData.legalForm}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Bitte wählen</option>
            <option value="GmbH">GmbH</option>
            <option value="AG">AG</option>
            <option value="GmbH_CoKG">GmbH & Co. KG</option>
            <option value="GbR">GbR</option>
            <option value="Einzelunternehmen">Einzelunternehmen</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Branche <span className="text-red-500">*</span>
          </label>
          <select
            name="industry"
            required
            value={formData.industry}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Bitte wählen</option>
            <option value="Automotive">Automotive</option>
            <option value="IT">IT</option>
            <option value="Handel">Handel</option>
            <option value="Handwerk">Handwerk</option>
            <option value="Dienstleistung">Dienstleistung</option>
            <option value="Produktion">Produktion</option>
            <option value="Sonstige">Sonstige</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ansprechpartner <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="contactPerson"
            required
            value={formData.contactPerson}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-Mail <span className="text-red-500">*</span>
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
            Handynummer <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mitarbeiteranzahl
          </label>
          <input
            type="number"
            name="employeeCount"
            min="1"
            value={formData.employeeCount}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Straße und Hausnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.street"
              required
              value={formData.address.street}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              PLZ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.postalCode"
              required
              pattern="[0-9]{5}"
              value={formData.address.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stadt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.city"
              required
              value={formData.address.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
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
          {isLoading ? 'Wird gesendet...' : 'Einladung senden'}
        </button>
      </div>
    </form>
  );
};

export default CompanyInviteForm;
