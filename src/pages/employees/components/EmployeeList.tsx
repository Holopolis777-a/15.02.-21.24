import React from 'react';
import { useCompanyEmployees } from '../../../hooks/useCompanyEmployees';
import { Building2, Wallet, Check, AlertCircle, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const PortalTypeInfo = () => (
  <div className="flex items-center gap-8 mb-6 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
        <Building2 className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">Mitarbeiter Portal</span>
        <span className="text-xs text-gray-500">Standard Mitarbeiter Zugang</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
        <Wallet className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">Gehaltsumwandlungs Portal</span>
        <span className="text-xs text-gray-500">Erweiterter Zugang mit Gehaltsumwandlung</span>
      </div>
    </div>
  </div>
);

const EmployeeList = () => {
  const { employees, loading } = useCompanyEmployees();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Alle Mitarbeiter</h2>
      <PortalTypeInfo />
      
      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Laden...</p>
        </div>
      ) : employees.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Keine Mitarbeiter gefunden</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600 font-medium">MITARBEITER</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">EMAIL</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">ERSTELLT AM</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">PORTAL TYP</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">EINLADUNG</th>
                <th className="text-left py-3 px-4 text-gray-600 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4">
                    {employee.firstName && employee.lastName 
                      ? `${employee.firstName} ${employee.lastName}`
                      : 'Nicht angegeben'}
                  </td>
                  <td className="py-3 px-4">{employee.email}</td>
                  <td className="py-3 px-4">
                    {format(new Date(employee.createdAt), 'dd.MM.yyyy', { locale: de })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {employee.portalType === 'normal' ? (
                        <>
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
                            <Building2 className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{employee.portalTypeDe}</span>
                            <span className="text-xs text-gray-500">Mitarbeiter Portal</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">{employee.portalTypeDe}</span>
                            <span className="text-xs text-gray-500">Gehaltsumwandlung</span>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {employee.inviteMethod ? (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          employee.inviteMethod === 'email' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {employee.inviteMethod === 'email' ? (
                            <>
                              <Mail className="w-4 h-4 mr-1" />
                              Email
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Link
                            </>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {employee.status === 'approved' ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          <Check className="w-4 h-4 mr-1" />
                          Registriert
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Ausstehend
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
