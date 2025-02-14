import React, { useState } from 'react';
import { UserPlus, Link } from 'lucide-react';
import BrokerCompaniesList from './components/BrokerCompaniesList';
import CompanyInviteModal from './components/CompanyInviteModal';
import CompanyInviteLinkModal from './components/CompanyInviteLinkModal';
import { useAuthStore } from '../../store/authStore';

const BrokerCompanies = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Unternehmen</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            <span>Unternehmen einladen</span>
          </button>
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Link className="w-5 h-5" />
            <span>Link generieren</span>
          </button>
        </div>
      </div>

      <BrokerCompaniesList />

      <CompanyInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />

      <CompanyInviteLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        brokerId={user?.id || ''}
      />
    </div>
  );
};

export default BrokerCompanies;
