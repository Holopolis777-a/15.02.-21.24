import React, { useState } from 'react';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import { useAuthStore } from '../../store/authStore';
import VehicleRequestList from './components/VehicleRequestList';
import { VehicleRequestWithCompany, RegularStatus, SalaryStatus } from '../../types/vehicleRequest';
import { ChevronDown } from 'lucide-react';

// Salary conversion requests status map
const SALARY_STATUS_MAP: Record<SalaryStatus, string> = {
  'pending': 'Ausstehend',
  'salary_conversion_approved': 'Gehaltsumwandlung genehmigt',
  'salary_conversion_rejected': 'Gehaltsumwandlung abgelehnt',
  'lease_offer_sent': 'Leasingangebot geschickt',
  'lease_request_submitted': 'Leasinganfrage gestellt',
  'lease_request_approved': 'Leasinganfrage genehmigt',
  'lease_request_rejected': 'Leasinganfrage abgelehnt',
  'in_delivery': 'Lieferung',
  'delivered': 'Geliefert',
  'withdrawn': 'Zurückgezogen',
  'closed': 'Geschlossen'
};

const StatusFilter: React.FC<{
  value: SalaryStatus | '';
  onChange: (value: SalaryStatus | '') => void;
}> = ({ value, onChange }) => (
  <div className="relative w-64">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SalaryStatus | '')}
      className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="">Alle Status</option>
      {(Object.entries(SALARY_STATUS_MAP) as [SalaryStatus, string][]).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
  </div>
);

const Requests = () => {
  const [salaryStatusFilter, setSalaryStatusFilter] = useState<SalaryStatus | ''>('');

  const user = useAuthStore(state => state.user);
  const isAdmin = user?.role === 'admin';
  const isEmployer = user?.role === 'employer';
  const isBroker = user?.role === 'broker';
  
  const { requests, loading, error, updateStatus, deleteRequest } = useVehicleRequests(
    isAdmin ? undefined : isEmployer ? user?.companyId : undefined,
    !isAdmin && !isEmployer ? (isBroker ? undefined : user?.id) : undefined
  );

  // Filter salary conversion requests and orders
  const salaryRequests = requests.filter(r => {
    // Für Employer: Zeige nur ausstehende oder abgelehnte Gehaltsumwandlungsanfragen
    if (isEmployer) {
      return r.type === 'salary_conversion' && !r.isOrder && 
             (r.status === 'pending' || r.status === 'salary_conversion_rejected');
    }
    // Für Employee: Zeige nur eigene Gehaltsumwandlungsanfragen, die noch nicht als Bestellung markiert sind
    if (user?.role === 'employee_salary') {
      return r.type === 'salary_conversion' && r.userId === user.id && !r.isOrder;
    }
    // Für Admin: Zeige alle Gehaltsumwandlungsanfragen
    if (isAdmin) {
      return r.type === 'salary_conversion';
    }
    return false;
  });
  const orderRequests = requests.filter(r => r.isOrder && (r.category === 'private' || r.category === 'company'));

  const title = isAdmin 
    ? 'Alle Fahrzeuganfragen' 
    : isBroker
      ? 'Fahrzeuganfragen'
      : isEmployer 
        ? 'Fahrzeuganfragen Ihrer Mitarbeiter'
        : 'Ihre Fahrzeuganfragen';
      
  const description = isAdmin 
    ? 'Verwalten Sie hier alle Fahrzeuganfragen von Arbeitgebern'
    : isBroker
      ? 'Verwalten Sie hier die Fahrzeuganfragen Ihrer eingeladenen Unternehmen'
      : isEmployer
        ? 'Verwalten Sie hier die Fahrzeuganfragen Ihrer Mitarbeiter'
        : 'Verwalten Sie hier Ihre Fahrzeuganfragen';

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">{description}</p>
      </div>
      
      <div className="space-y-6">
        {/* Salary Conversion Requests Box */}
        {(isAdmin || isEmployer || user?.role === 'employee_salary') && (
          <div className="grid grid-cols-1">
            <div className="rounded-lg shadow p-6" style={{ backgroundColor: '#98FB98' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Gehaltsumwandlungs Anfragen</h2>
                {(isAdmin || isEmployer || isBroker) && (
                  <StatusFilter
                    value={salaryStatusFilter}
                    onChange={setSalaryStatusFilter}
                  />
                )}
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : salaryRequests.length === 0 ? (
                <div className="text-center text-gray-500">Keine Gehaltsumwandlungs Anfragen vorhanden</div>
              ) : (
                <VehicleRequestList
                  requests={salaryRequests}
                  loading={false}
                  error={null}
                  onUpdateStatus={(isAdmin || isEmployer) ? updateStatus : undefined}
                  selectedStatus={salaryStatusFilter || undefined}
                  onDeleteRequest={isAdmin ? deleteRequest : undefined}
                />
              )}
            </div>
          </div>
        )}

        {/* Orders Box - Only visible for admin */}
        {isAdmin && (
          <div className="grid grid-cols-1">
            <div className="rounded-lg shadow p-6 bg-blue-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Privat- und Firmenwagen Bestellungen</h2>
              </div>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : orderRequests.length === 0 ? (
                <div className="text-center text-gray-500">Keine Bestellungen vorhanden</div>
              ) : (
                <VehicleRequestList
                  requests={orderRequests}
                  loading={false}
                  error={null}
                  onUpdateStatus={updateStatus}
                  onDeleteRequest={deleteRequest}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
