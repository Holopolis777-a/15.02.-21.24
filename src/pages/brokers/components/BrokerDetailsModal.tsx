import React from 'react';
import { X, Mail, Phone, MapPin } from 'lucide-react';
import { Broker } from '../../../types/broker';
import { formatDistanceToNow } from '../../../utils/dateUtils';

interface BrokerDetailsModalProps {
  broker: Broker;
  onClose: () => void;
}

const BrokerDetailsModal: React.FC<BrokerDetailsModalProps> = ({ broker, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Makler Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            {broker.logoUrl ? (
              <img
                src={broker.logoUrl}
                alt={broker.companyName}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500 font-medium">
                  {broker.companyName.charAt(0)}
                </span>
              </div>
            )}
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{broker.fullName}</h3>
              <p className="text-gray-500">{broker.companyName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Kontakt</h4>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <Mail className="h-5 w-5 mr-2 text-gray-400" />
                  <a href={`mailto:${broker.email}`} className="hover:text-blue-600">
                    {broker.email}
                  </a>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  <a href={`tel:${broker.phone}`} className="hover:text-blue-600">
                    {broker.phone}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Adresse</h4>
              <div className="flex items-start text-gray-700">
                <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                <div>
                  {broker.address.street}<br />
                  {broker.address.postalCode} {broker.address.city}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Provision</h4>
            <div className="mb-6">
              <p className="text-sm text-gray-500">Provision pro Fahrzeug</p>
              <p className="text-gray-900">
                {broker.commissionPerVehicle?.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) || '0,00 €'}
              </p>
            </div>

            <h4 className="text-sm font-medium text-gray-500 mb-2">Status & Aktivität</h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Eingeladen am</p>
                <p className="text-gray-900">
                  {formatDistanceToNow(new Date(broker.createdAt))}
                </p>
              </div>
              {broker.lastLoginAt && (
                <div>
                  <p className="text-sm text-gray-500">Letzte Anmeldung</p>
                  <p className="text-gray-900">
                    {formatDistanceToNow(new Date(broker.lastLoginAt))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerDetailsModal;
