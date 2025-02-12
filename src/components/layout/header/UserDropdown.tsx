import React from 'react';
import { Settings, LogOut, Building2 } from 'lucide-react';
import { User } from '../../../types/auth';
import UserAvatar from './UserAvatar';
import UserDropdownItem from './UserDropdownItem';

interface UserDropdownProps {
  user: User | null;
  onProfileClick: () => void;
  onCompanyDataClick: () => void;
  onSignOut: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  onProfileClick,
  onCompanyDataClick,
  onSignOut
}) => {
  const showCompanyData = user?.role === 'employer' || user?.role === 'broker';
  return (
    <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
      {/* User Info */}
      <div className="px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} size="lg" />
          <div>
            <div className="font-medium text-gray-900">
              {user?.firstName} {user?.lastName}
            </div>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <UserDropdownItem
          icon={Settings}
          label="Profil bearbeiten"
          onClick={onProfileClick}
          showArrow
        />
        {showCompanyData && (
          <UserDropdownItem
            icon={Building2}
            label="Firmendaten"
            onClick={onCompanyDataClick}
            showArrow
          />
        )}
        <UserDropdownItem
          icon={LogOut}
          label="Abmelden"
          onClick={onSignOut}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default UserDropdown;
