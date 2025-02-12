import React from 'react';
import { User } from '../../../types/auth';

interface PersonalInfoProps {
  user: User | null;
  isEditing: boolean;
  formData: {
    firstName: string;
    lastName: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ 
  user, 
  isEditing,
  formData,
  onChange
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Persönliche Informationen
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vorname
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nachname
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;