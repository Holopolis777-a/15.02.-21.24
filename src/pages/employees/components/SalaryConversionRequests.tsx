import React from 'react';
import { VehicleRequestWithCompany } from '../../../types/vehicleRequest';
import { useAuthStore } from '../../../store/authStore';
import { formatDate } from '../../../utils/dateUtils';

interface SalaryConversionRequestsProps {
  requests: VehicleRequestWithCompany[];
  loading: boolean;
  error: string | null;
  onUpdateStatus: (requestId: string, newStatus: VehicleRequestWithCompany['status']) => Promise<void>;
}

const SalaryConversionRequests: React.FC<SalaryConversionRequestsProps> = ({
  requests,
  loading,
  error,
  onUpdateStatus,
}) => {
  const user = useAuthStore(state => state.user);
  const isEmployer = user?.role === 'employer';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  const salaryConversionRequests = requests.filter(request => request.type === 'salary_conversion');

  if (salaryConversionRequests.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">
        Keine Gehaltsumwandlungsanfragen vorhanden
      </div>
    );
  }

  const getStatusColor = (status: VehicleRequestWithCompany['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'salary_conversion_approved':
        return 'bg-green-100 text-green-800';
      case 'salary_conversion_rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: VehicleRequestWithCompany['status']) => {
    switch (status) {
      case 'pending':
        return 'Ausstehend';
      case 'salary_conversion_approved':
        return 'Genehmigt';
      case 'salary_conversion_rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Gehaltsumwandlungsanfragen
      </h3>
      {salaryConversionRequests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {request.brand} {request.model}
              </h4>
              <p className="text-sm text-gray-600">
                Erstellt am: {formatDate(request.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 text-sm rounded ${getStatusColor(request.status)}`}>
              {getStatusText(request.status)}
            </span>
          </div>

          {request.salaryConversion && (
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <p>Bruttogehalt: {request.salaryConversion.grossSalary.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                })}</p>
                <p>Steuerklasse: {request.salaryConversion.taxClass}</p>
                <p>Kirchensteuer: {request.salaryConversion.churchTax}</p>
              </div>
              <div>
                <p>Laden beim AG: {request.salaryConversion.powerCosts}</p>
                <p>Entfernung: {request.salaryConversion.distance} km</p>
                <p>Effektivkosten: {request.salaryConversion.effectiveCost.toLocaleString('de-DE', {
                  style: 'currency',
                  currency: 'EUR'
                })}</p>
              </div>
            </div>
          )}

          {isEmployer && request.status === 'pending' && (
            <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => onUpdateStatus(request.id!, 'salary_conversion_rejected')}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Ablehnen
              </button>
              <button
                onClick={() => onUpdateStatus(request.id!, 'salary_conversion_approved')}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Genehmigen
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SalaryConversionRequests;
