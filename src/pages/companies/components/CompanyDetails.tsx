import React, { useState } from 'react';
import { X, Building2, Mail, RefreshCw, Clock } from 'lucide-react';
import { Company } from '../../../types/company';
import { updateDocument } from '../../../lib/firebase/db';
import { resendCompanyInvitation } from '../../../lib/email/verification';

interface CompanyDetailsProps {
  company: Company;
  onClose: () => void;
  onUpdate: () => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(company);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await updateDocument('companies', company.id, formData);
      setSuccess('Unternehmensdaten wurden aktualisiert');
      onUpdate();
      setIsEditing(false);
    } catch (err) {
      setError('Fehler beim Speichern der Änderungen');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendInvite = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await resendCompanyInvitation(company.id, company.email);
      setSuccess('Einladung wurde erneut versendet');
    } catch (err) {
      setError('Fehler beim Versenden der Einladung. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Unternehmensdetails
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {company.name}
              </h3>
              <p className="text-sm text-gray-500">{company.legalForm}</p>
            </div>
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-full text-sm ${
            company.firstLoginAt 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <Clock className="w-4 h-4 mr-2" />
            {company.firstLoginAt 
              ? `Erste Anmeldung: ${new Date(company.firstLoginAt).toLocaleDateString()}` 
              : 'Noch nie angemeldet'}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-Mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mitarbeiteranzahl
              </label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="border-t pt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Adresse</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Straße
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  PLZ
                </label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ort
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="flex space-x-4">
              {!company.firstLoginAt && (
                <button
                  type="button"
                  onClick={handleResendInvite}
                  disabled={isLoading}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Einladung erneut senden
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? 'Wird gespeichert...' : 'Speichern'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Bearbeiten
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Email Log */}
        {company.emailLog && company.emailLog.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900 mb-4">E-Mail-Verlauf</h3>
            <div className="space-y-4">
              {company.emailLog.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-900">{log.type}</p>
                    <p className="text-gray-500">
                      {new Date(log.sentAt).toLocaleString()}
                    </p>
                    {log.error && (
                      <p className="text-red-600 mt-1">{log.error}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;