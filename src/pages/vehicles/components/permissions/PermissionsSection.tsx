import React from 'react';
import { Vehicle } from '../../../../types/vehicle';
import RoleSelector from './RoleSelector';
import CategorySelector from './CategorySelector';

interface PermissionsSectionProps {
  data: Partial<Vehicle>;
  onChange: (data: Partial<Vehicle>) => void;
}

const PermissionsSection: React.FC<PermissionsSectionProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <CategorySelector
        value={data.categories || []}
        onChange={(categories) => onChange({ ...data, categories })}
        data={data}
        onDataChange={onChange}
      />

      <div className="border-t pt-8">
        <RoleSelector
          selectedRoles={data.allowedRoles || []}
          onChange={(roles) => onChange({ ...data, allowedRoles: roles })}
        />
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Administratoren haben immer Zugriff auf alle Fahrzeuge, unabhängig von den hier gewählten Berechtigungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsSection;