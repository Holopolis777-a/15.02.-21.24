import React, { useState } from 'react';
import { User } from '../../../types/auth';
import { useBrokerData } from '../../../hooks/useBrokerData';
import { Broker } from '../../../types/broker';

interface CompanyDataProps {
  user: User | null;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  formData: {
    firstName: string;
    lastName: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    mobileNumber: string;
    phone: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CompanyData: React.FC<CompanyDataProps> = ({ user, isEditing, setIsEditing, formData: parentFormData, onChange }) => {
  const { brokerData, loading, updateBrokerData } = useBrokerData();
  const [formData, setFormData] = useState<{
    companyName?: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
    };
  } | null>(null);
  const [updateMessage, setUpdateMessage] = useState('');

  React.useEffect(() => {
    if (brokerData) {
      // Ensure address fields are initialized with empty strings if not present
      setFormData({
        companyName: brokerData.companyName,
        phone: brokerData.phone,
        address: {
          street: brokerData.address?.street || '',
          city: brokerData.address?.city || '',
          postalCode: brokerData.address?.postalCode || ''
        }
      });
    }
  }, [brokerData]);

  if (loading) {
    return <div>Lade Firmendaten...</div>;
  }

  if (!user || user.role !== 'broker' || !formData) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const [, field] = name.split('.');
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          address: {
            street: prev.address.street || '',
            city: prev.address.city || '',
            postalCode: prev.address.postalCode || '',
            [field]: value
          }
        };
      });
    } else {
      setFormData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const updateData: Partial<Broker> = {
      companyName: formData.companyName || '',
      phone: formData.phone || '',
      address: formData.address
    };

    const success = await updateBrokerData(updateData);
    if (success) {
      setUpdateMessage('Firmendaten erfolgreich aktualisiert');
      setIsEditing(false);
      setTimeout(() => setUpdateMessage(''), 3000);
    }
  };

  const resetForm = () => {
    if (brokerData) {
      setFormData({
        companyName: brokerData.companyName,
        phone: brokerData.phone,
        address: {
          street: brokerData.address?.street || '',
          city: brokerData.address?.city || '',
          postalCode: brokerData.address?.postalCode || ''
        }
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Firmendaten</h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Bearbeiten
          </button>
        )}
      </div>

      {updateMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {updateMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Firmenname inkl. Rechtsform
          </label>
          {isEditing ? (
            <input
              type="text"
              name="companyName"
              value={formData.companyName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{formData.companyName || '-'}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Straße
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address.street"
                value={formData.address?.street || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.address?.street || '-'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700">
              Postleitzahl
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address.postalCode"
                value={formData.address?.postalCode || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.address?.postalCode || '-'}</p>
            )}
          </div>
          <div>
            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
              Ort
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address.city"
                value={formData.address?.city || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{formData.address?.city || '-'}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Telefon
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{formData.phone || '-'}</p>
          )}
        </div>

        {isEditing && (
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Speichern
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default CompanyData;
