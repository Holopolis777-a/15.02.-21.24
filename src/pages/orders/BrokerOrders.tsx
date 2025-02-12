import React, { useState } from 'react';
import { useBrokerOrders } from '../../hooks/useBrokerOrders';
import OrderList from './components/OrderList';
import { OrderStatus } from '../../types/vehicleRequest';
import { ChevronDown } from 'lucide-react';

const StatusFilter: React.FC<{
  value: OrderStatus | '';
  onChange: (value: OrderStatus | '') => void;
}> = ({ value, onChange }) => (
  <div className="relative w-64">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as OrderStatus | '')}
      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Alle Status</option>
      <option value="credit_check_started">Bonität gestartet</option>
      <option value="credit_check_passed">Bonität bestätigt</option>
      <option value="credit_check_failed">Bonität abgelehnt</option>
      <option value="lease_contract_sent">Leasingvertrag versandt</option>
      <option value="lease_contract_signed">Leasingvertrag unterschrieben</option>
      <option value="in_delivery">In Auslieferung</option>
      <option value="delivered">Ausgeliefert</option>
      <option value="cancelled">Storniert</option>
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
  </div>
);

const BrokerOrders = () => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const { orders, loading, error } = useBrokerOrders();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bestellungen</h1>
        <p className="mt-2 text-gray-600">
          Übersicht aller Bestellungen Ihrer eingeladenen Unternehmen, Unterbroker und Kunden
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1">
          <div className="rounded-lg shadow p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Bestellübersicht
              </h2>
              <StatusFilter
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            <OrderList
              orders={orders}
              loading={loading}
              error={error}
              selectedStatus={statusFilter || undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerOrders;
