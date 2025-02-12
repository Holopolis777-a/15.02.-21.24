import React from 'react';
import { Search } from 'lucide-react';

interface FAQFiltersProps {
  filters: {
    search: string;
    status: string;
    dateRange: string;
    target: string;
  };
  onChange: (filters: any) => void;
}

const FAQFilters: React.FC<FAQFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Suche</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="pl-10 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="FAQ suchen..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle</option>
            <option value="active">Aktiv</option>
            <option value="inactive">Inaktiv</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Zeitraum</label>
          <select
            value={filters.dateRange}
            onChange={(e) => onChange({ ...filters, dateRange: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle</option>
            <option value="today">Heute</option>
            <option value="week">Diese Woche</option>
            <option value="month">Dieser Monat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Zielgruppe</label>
          <select
            value={filters.target}
            onChange={(e) => onChange({ ...filters, target: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Alle</option>
            <option value="employer">Arbeitgeber</option>
            <option value="broker">Vermittler</option>
            <option value="employee_normal">Mitarbeiter (Normal)</option>
            <option value="employee_salary">Mitarbeiter (Gehaltsumwandlung)</option>
            <option value="customer">Kunde</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FAQFilters;