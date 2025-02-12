import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import BrokerGrid from './components/BrokerGrid';
import BrokerFilters from './components/BrokerFilters';
import BrokerCommissionHierarchy from './components/BrokerCommissionHierarchy';
import { useBrokers } from '../../hooks/useBrokers';
import { useAuthStore } from '../../store/authStore';

const BrokerList = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { brokers, isLoading, error, refreshBrokers } = useBrokers();
  const [filters, setFilters] = useState({
    status: 'all',
    registrationStatus: 'all',
    dateRange: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBrokers = brokers.filter(broker => {
    // Apply filters
    if (filters.status !== 'all' && broker.status !== filters.status) return false;
    if (filters.registrationStatus !== 'all') {
      const isRegistered = !!broker.lastLoginAt;
      if (filters.registrationStatus === 'registered' && !isRegistered) return false;
      if (filters.registrationStatus === 'pending' && isRegistered) return false;
    }
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        broker.fullName.toLowerCase().includes(searchLower) ||
        broker.email.toLowerCase().includes(searchLower) ||
        broker.companyName.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Makler-Verwaltung</h1>
        <button
          onClick={() => navigate('/brokers/invite')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Makler einladen
        </button>
      </div>

      {/* Show commission hierarchy only for brokers */}
      {user?.role === 'broker' && (
        <div className="bg-white rounded-lg shadow">
          <BrokerCommissionHierarchy />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <BrokerFilters
            filters={filters}
            onChange={setFilters}
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <BrokerGrid
        brokers={filteredBrokers}
        isLoading={isLoading}
        error={error}
        onUpdate={refreshBrokers}
      />
    </div>
  );
};

export default BrokerList;
