import React from 'react';
import BrokerInviteForm from './components/BrokerInviteForm';

const BrokerInvite: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Broker einladen</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <BrokerInviteForm />
      </div>
    </div>
  );
};

export default BrokerInvite;
