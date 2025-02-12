import React from 'react';
import { UserRole } from '../../../../types/auth';

interface RoleSelectorProps {
  selectedRoles: UserRole[];
  onChange: (roles: UserRole[]) => void;
}

const AVAILABLE_ROLES: { role: UserRole; label: string }[] = [
  { role: 'admin', label: 'Administrator' },
  { role: 'employer', label: 'Arbeitgeber' },
  { role: 'broker', label: 'Vermittler' },
  { role: 'employee_normal', label: 'Mitarbeiter (Normal)' },
  { role: 'employee_salary', label: 'Mitarbeiter (Gehaltsumwandlung)' },
  { role: 'customer', label: 'Kunde' }
];

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRoles, onChange }) => {
  const handleRoleToggle = (role: UserRole) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    onChange(newRoles);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Berechtigungen</h3>
      <p className="text-sm text-gray-500">
        Wählen Sie aus, welche Benutzerrollen Zugriff auf dieses Fahrzeug haben sollen.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AVAILABLE_ROLES.map(({ role, label }) => (
          <div key={role} className="flex items-center">
            <input
              type="checkbox"
              id={`role-${role}`}
              checked={selectedRoles.includes(role)}
              onChange={() => handleRoleToggle(role)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`role-${role}`} className="ml-2 text-sm text-gray-700">
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;