import React from 'react';
import { X } from 'lucide-react';
import CompanyInviteForm from './CompanyInviteForm';

interface CompanyInviteModalProps {
  onClose: () => void;
}

const CompanyInviteModal: React.FC<CompanyInviteModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Unternehmen einladen
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <CompanyInviteForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CompanyInviteModal;