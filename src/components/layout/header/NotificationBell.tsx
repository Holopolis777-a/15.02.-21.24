import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface NotificationBellProps {
  count?: number;
  onSettingsClick: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, onSettingsClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {count > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          onClose={() => setIsOpen(false)}
          onSettingsClick={onSettingsClick}
        />
      )}
    </div>
  );
};

export default NotificationBell;