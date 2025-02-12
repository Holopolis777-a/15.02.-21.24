import React from 'react';

interface PasswordChangeProps {
  isEditing: boolean;
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({ 
  isEditing,
  formData,
  onChange
}) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Passwort ändern
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Aktuelles Passwort
          </label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Neues Passwort
          </label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Passwort bestätigen
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-50"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;