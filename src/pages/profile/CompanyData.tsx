import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCompanyData } from '../../hooks/useCompanyData';
import { Company } from '../../types/company';
import { useAuthStore } from '../../store/authStore';
import { useBrokerCompany } from '../../hooks/useBrokerCompany';
import CompanyDataComponent from './components/CompanyData';
import BrokerCompanyData from './components/BrokerCompanyData';

type FormDataType = {
  id?: string;
  name: string;
  legalForm: string;
  industry: string;
  contactPerson: string;
  email: string;
  phone: string;
  employeeCount: number;
  address: {
    street: string;
    city: string;
    postalCode: string;
  };
  status?: 'pending' | 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  logoUrl?: string;
};

const CompanyData: React.FC = () => {
  const { user } = useAuthStore();
  const { company: employerCompany, loading: employerLoading, error: employerError, updateCompany } = useCompanyData();

  // Redirect if not an employer or broker
  if (user?.role !== 'employer' && user?.role !== 'broker') {
    return <Navigate to="/profile" replace />;
  }

  // For brokers, show the broker company data component
  if (user?.role === 'broker') {
    return <BrokerCompanyData user={user} />;
  }

  const [formData, setFormData] = useState<FormDataType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  
  const company = employerCompany;
  const loading = employerLoading;
  const error = employerError;

  // Initialize form data when company data is loaded
  React.useEffect(() => {
    if (company) {
      const initialData: FormDataType = {
        id: company.id,
        name: company.name,
        legalForm: company.legalForm,
        industry: company.industry,
        contactPerson: company.contactPerson,
        email: company.email,
        phone: company.phone,
        employeeCount: company.employeeCount,
        address: {
          street: company.address.street,
          city: company.address.city,
          postalCode: company.address.postalCode,
        },
        status: company.status,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        logoUrl: company.logoUrl,
      };
      setFormData(initialData);
    }
  }, [company]);

  if (loading) {
    return <div className="p-4">Laden...</div>;
  }

  // For employers, show full company data form
  if (!company || !formData) {
    return <div className="p-4">Keine Firmendaten gefunden.</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const [, field] = name.split('.');
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          address: {
            ...prev.address,
            [field]: value,
          },
        };
      });
    } else {
      setFormData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: name === 'employeeCount' ? parseInt(value) || 0 : value,
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const success = await updateCompany(formData);
    if (success) {
      setUpdateMessage('Firmendaten erfolgreich aktualisiert');
      setIsEditing(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const resetForm = () => {
    if (!company) return;
    setIsEditing(false);
    const resetData: FormDataType = {
      id: company.id,
      name: company.name,
      legalForm: company.legalForm,
      industry: company.industry,
      contactPerson: company.contactPerson,
      email: company.email,
      phone: company.phone,
      employeeCount: company.employeeCount,
      address: {
        street: company.address.street,
        city: company.address.city,
        postalCode: company.address.postalCode,
      },
      status: company.status,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      logoUrl: company.logoUrl,
    };
    setFormData(resetData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Firmendaten</h2>
          {!isEditing && user?.role === 'employer' && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Bearbeiten
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {updateMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {updateMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Firmenname inkl. Rechtsform
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rechtsform
              </label>
              <input
                type="text"
                name="legalForm"
                value={formData.legalForm}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branche
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ansprechpartner
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Anzahl Mitarbeiter
              </label>
              <input
                type="number"
                name="employeeCount"
                value={formData.employeeCount}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Straße
                </label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stadt
                </label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Speichern
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanyData;
