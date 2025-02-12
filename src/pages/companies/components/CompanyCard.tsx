import React, { useState } from 'react';
import { Building2, Users, Phone, Mail, Clock, UserPlus } from 'lucide-react';
import { Company } from '../../../types/company';
import CompanyDetails from './CompanyDetails';

interface CompanyCardProps {
  company: Company;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleUpdate = () => {
    setShowDetails(false);
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setShowDetails(true)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {company.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="w-12 h-12 rounded-lg object-contain bg-gray-50"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {company.name}
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
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              <span>{company.employeeCount} Mitarbeiter</span>
            </div>

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

            {company.brokerName && (
              <div className="flex items-center text-sm text-gray-600">
                <UserPlus className="w-4 h-4 mr-2" />
                <span>Eingeladen von {company.brokerName}</span>
              </div>
            )}
          </div>

          {company.address && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                {company.address.street}<br />
                {company.address.postalCode} {company.address.city}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
            <CompanyDetails 
              company={company} 
              onClose={() => setShowDetails(false)}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyCard;
