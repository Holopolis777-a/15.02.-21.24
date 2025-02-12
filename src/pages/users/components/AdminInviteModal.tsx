import React, { useState } from 'react';
import { X } from 'lucide-react';
import AdminInviteForm from './AdminInviteForm';

interface AdminInviteModalProps {
  onClose: () => void;
}

const AdminInviteModal: React.FC<AdminInviteModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Administrator einladen
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <AdminInviteForm onClose={onClose} />
      </div>
    </div>
  );
};

export default AdminInviteModal;