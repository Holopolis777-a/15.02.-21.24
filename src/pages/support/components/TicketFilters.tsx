import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { TicketStatus } from '../../../types/ticket';

const TicketFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={searchParams.get('status') || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Alle</option>
            <option value="open">Offen</option>
            <option value="in_progress">In Bearbeitung</option>
            <option value="waiting">Wartend</option>
            <option value="closed">Geschlossen</option>
          </select>
      </div>
    </div>
  );
};

export default TicketFilters;
