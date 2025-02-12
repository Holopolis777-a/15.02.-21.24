import React from 'react';
import { useTickets } from '../../../hooks/useTickets';
import TicketListItem from './TicketListItem';
import TicketFilters from './TicketFilters';
import { LifeBuoy } from 'lucide-react';

const TicketList = () => {
  const { tickets, isLoading, error } = useTickets();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <LifeBuoy className="w-12 h-12 mx-auto mb-2" />
            <p>Keine Tickets gefunden</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TicketFilters />
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {tickets.map((ticket) => (
          <TicketListItem key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TicketList;