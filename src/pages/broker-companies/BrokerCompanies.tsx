import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import BrokerCompaniesList from './components/BrokerCompaniesList';
import CompanyInviteModal from './components/CompanyInviteModal';

const BrokerCompanies = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unternehmen</h1>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          <span>Unternehmen einladen</span>
        </button>
      </div>

      <BrokerCompaniesList />

      <CompanyInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
};

export default BrokerCompanies;
