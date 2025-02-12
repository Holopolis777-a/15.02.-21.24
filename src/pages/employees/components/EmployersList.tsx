import React from 'react';
import { UserCircle2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useEmployersList } from '../../../hooks/useEmployersList';

const EmployersList = () => {
  const { employers, loading, error } = useEmployersList();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  // Sort employers by date, most recent first
  const sortedEmployers = [...employers].sort((a, b) => 
    b.createdAt.getTime() - a.createdAt.getTime()
  );

  // Debug log
  console.log('Employers data:', sortedEmployers);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'declined':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktiv';
      case 'pending':
        return 'Ausstehend';
      case 'declined':
        return 'Abgelehnt';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Eingeladene Mitarbeiter</h2>

      <div className="space-y-2">
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-2 bg-gray-50 rounded-t-lg">
          <span className="text-sm font-medium text-gray-500"></span>
          <span className="text-sm font-medium text-gray-500">Email</span>
          <span className="text-sm font-medium text-gray-500">Status</span>
          <span className="text-sm font-medium text-gray-500">Datum</span>
        </div>

        {sortedEmployers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Noch keine Mitarbeiter eingeladen</p>
            <p className="text-sm text-gray-400 mt-2">
              Eingeladene Mitarbeiter werden hier angezeigt
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sortedEmployers.map((employer) => (
              <div key={employer.id} className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-3 items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-50 p-1.5 rounded">
                    <UserCircle2 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-900">{employer.email}</div>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusIcon(employer.status)}
                  <span className="text-sm capitalize text-gray-700">
                    {getStatusText(employer.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {employer.createdAt.toLocaleDateString('de-DE')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployersList;
