import React from 'react';
import { Building2, Users, Phone, Mail, Clock, User, Briefcase } from 'lucide-react';
import { useBrokerCompanies } from '../../../hooks/useBrokerCompanies';

const BrokerCompaniesList = () => {
  const { companies, loading, error } = useBrokerCompanies(false);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {companies.map((company) => (
        <div 
          key={company.id}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.companyName || company.name || company.email}
                    className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {company.companyName || company.name || company.email}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {company.legalForm}
                    </span>
                    {company.status === 'pending' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Ausstehend
                      </span>
                    ) : !company.firstLoginAt && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Neu
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {company.industry && (
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{company.industry}</span>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                <span>{company.employeeCount || '0'} Mitarbeiter</span>
              </div>

              {company.contactPerson && (
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>{company.contactPerson}</span>
                </div>
              )}

              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <a 
                  href={`mailto:${company.email}`}
                  className="hover:text-blue-600"
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.email}
                </a>
              </div>

              {company.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a 
                    href={`tel:${company.phone}`}
                    className="hover:text-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {company.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {/* Verwende entweder das address Objekt oder die einzelnen Felder */}
                {company.address ? (
                  <>
                    {company.address.street}<br />
                    {company.address.postalCode} {company.address.city}
                  </>
                ) : (
                  <>
                    {company.street}<br />
                    {company.zipCode} {company.city}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {companies.length === 0 && (
        <div className="col-span-full bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-40 text-gray-500">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-2" />
              <p>Noch keine Unternehmen eingeladen</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerCompaniesList;
