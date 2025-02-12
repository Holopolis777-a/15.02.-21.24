import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import EmployeeInviteModal from './components/EmployeeInviteModal';
import PortalBenefits from './components/PortalBenefits';
import PendingApprovals from './components/PendingApprovals';
import EmployeeList from './components/EmployeeList';
import { useCurrentCompany } from '../../hooks/useCurrentCompany';
import EmployeePageGuard from '../../components/auth/EmployeePageGuard';

const Employees = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { company, loading: companyLoading } = useCurrentCompany();

  return (
    <EmployeePageGuard>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mitarbeiter verwalten</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!company?.id || companyLoading}
          className={`flex items-center px-4 py-2 bg-blue-500 text-white rounded transition-colors ${
            !company?.id || companyLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Neuen Mitarbeiter einladen
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mitarbeiter Portal Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Mitarbeiter Portal</h2>
          <p className="text-gray-600">
            Das Standard-Mitarbeiterportal bietet Zugang zu allgemeinen Funktionen und Informationen.
          </p>
        </div>

        {/* Gehaltsumwandlungs Portal Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Gehaltsumwandlungs Portal</h2>
          <p className="text-gray-600">
            Das Gehaltsumwandlungsportal ermöglicht Mitarbeitern die Verwaltung ihrer Gehaltsumwandlung für Dienstwagen.
          </p>
        </div>
      </div>

      <PortalBenefits />

      <div className="mt-8 space-y-8">
        <PendingApprovals />
        <EmployeeList />
      </div>

      <EmployeeInviteModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      </div>
    </EmployeePageGuard>
  );
};

export default Employees;
