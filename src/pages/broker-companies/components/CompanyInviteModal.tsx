import React from 'react';
import BrokerCompanyInviteForm from './BrokerCompanyInviteForm';

interface CompanyInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompanyInviteModal: React.FC<CompanyInviteModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
        <h2 className="text-xl font-semibold mb-4">Neues Unternehmen einladen</h2>
        <BrokerCompanyInviteForm onClose={onClose} />
      </div>
    </div>
  );
};

export default CompanyInviteModal;
