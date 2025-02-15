import React from 'react';
import { createPortal } from 'react-dom';
import { Settings, LogOut, Building2 } from 'lucide-react';
import { User } from '../../../types/auth';
import UserDropdownItem from './UserDropdownItem';

interface UserDropdownProps {
  user: User | null;
  onProfileClick: () => void;
  onCompanyDataClick: () => void;
  onSignOut: () => void;
  anchorRect: DOMRect | null;
  dropdownRef: React.RefObject<HTMLDivElement>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  onProfileClick,
  onCompanyDataClick,
  onSignOut,
  anchorRect,
  dropdownRef
}) => {
  const showCompanyData = user?.role === 'employer' || user?.role === 'broker';
    
  return createPortal(
    <div 
      ref={dropdownRef}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: 'fixed',
        zIndex: 999999,
        width: '18rem',
        top: anchorRect ? `${anchorRect.bottom + 4}px` : '0',
        left: anchorRect ? `${anchorRect.left}px` : '0',
        transform: 'translateZ(0)',
        willChange: 'transform'
      }} 
      className="user-dropdown bg-white rounded-lg shadow-lg py-2 border border-gray-200"
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b">
        <div className="font-medium text-gray-900">
          {user?.firstName} {user?.lastName}
        </div>
        <div className="text-sm text-gray-500">{user?.email}</div>
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
    </div>,
    document.body
  );
};

export { UserDropdown };
