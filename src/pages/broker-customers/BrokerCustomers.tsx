import React, { useState } from 'react';
import CustomerInviteModal from './components/CustomerInviteModal';
import CustomersList from './components/CustomersList';
import { useAuthStore } from '../../store/authStore';
import BrokerGuard from '../../components/auth/BrokerGuard';

const BrokerCustomers: React.FC = () => {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const { user } = useAuthStore() as { user: { id: string; role: string } | null };

  if (!user) {
    return null;
  }

  if (user.role !== 'broker') {
    return (
      <div className="text-center py-8 text-red-500">
        Sie haben keine Berechtigung, auf diese Seite zuzugreifen.
      </div>
    );
  }

  return (
    <BrokerGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Meine Kunden</h1>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Kunde einladen
          </button>
        </div>

        <CustomersList brokerId={user.id || ''} />

        <CustomerInviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          brokerId={user.id || ''}
        />
      </div>
    </BrokerGuard>
  );
};

export default BrokerCustomers;
