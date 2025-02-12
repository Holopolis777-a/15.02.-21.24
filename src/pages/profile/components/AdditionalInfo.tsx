import React from 'react';
import { User } from '../../../types/auth';

interface AdditionalInfoProps {
  user: User | null;
  isEditing: boolean;
  formData: {
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    mobileNumber: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  user,
  isEditing,
  formData,
  onChange,
}) => {
  if (!user || (user.role !== 'employee_normal' && user.role !== 'employee_salary' && user.role !== 'customer')) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Zusätzliche Informationen</h3>
      <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Straße
            </label>
            {isEditing ? (
              <input
                type="text"
                name="street"
                id="street"
                value={formData.street}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.street || '-'}</p>
            )}
          </div>
          <div>
            <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">
              Hausnummer
            </label>
            {isEditing ? (
              <input
                type="text"
                name="houseNumber"
                id="houseNumber"
                value={formData.houseNumber}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.houseNumber || '-'}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
              Postleitzahl
            </label>
            {isEditing ? (
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                value={formData.postalCode}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.postalCode || '-'}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Ort
            </label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                id="city"
                value={formData.city}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{user.city || '-'}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
            Handynummer
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="mobileNumber"
              id="mobileNumber"
              value={formData.mobileNumber}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          ) : (
            <p className="mt-1 text-sm text-gray-900">{user.mobileNumber || '-'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
