import React from 'react';
import { Settings, Bell } from 'lucide-react';

interface NotificationDropdownProps {
  onClose: () => void;
  onSettingsClick: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  onClose,
  onSettingsClick
}) => {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
      <div className="px-4 py-2 border-b flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Benachrichtigungen</h3>
        <button
          onClick={onSettingsClick}
          className="p-1 hover:bg-gray-100 rounded-full"
          title="Einstellungen"
        >
          <Settings className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {/* Placeholder for empty state */}
        <div className="py-8 text-center text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Keine neuen Benachrichtigungen</p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;