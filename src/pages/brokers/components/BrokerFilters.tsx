import React from 'react';

interface BrokerFiltersProps {
  filters: {
    status: string;
    registrationStatus: string;
    dateRange: string;
  };
  onChange: (filters: any) => void;
}

const BrokerFilters: React.FC<BrokerFiltersProps> = ({ filters, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex space-x-4">
      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Alle Status</option>
        <option value="active">Aktiv</option>
        <option value="inactive">Gesperrt</option>
        <option value="pending">Ausstehend</option>
      </select>

      <select
        name="registrationStatus"
        value={filters.registrationStatus}
        onChange={handleChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Alle Registrierungen</option>
        <option value="registered">Registriert</option>
        <option value="pending">Ausstehend</option>
      </select>

      <select
        name="dateRange"
        value={filters.dateRange}
        onChange={handleChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="all">Alle Zeiträume</option>
        <option value="today">Heute</option>
        <option value="week">Diese Woche</option>
        <option value="month">Dieser Monat</option>
      </select>
    </div>
  );
};

export default BrokerFilters;