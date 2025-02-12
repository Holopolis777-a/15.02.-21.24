import React, { useState } from 'react';
import { Eye, Ban, RefreshCw, Check, Mail, Phone, MapPin, Pencil } from 'lucide-react';
import { Broker } from '../../../types/broker';
import { formatDistanceToNow } from '../../../utils/dateUtils';
import BrokerDetailsModal from './BrokerDetailsModal';
import BrokerEditModal from './BrokerEditModal';
import { toggleBrokerStatus, resendBrokerInvitation } from '../../../services/brokerService';

interface BrokerGridProps {
  brokers: Broker[];
  isLoading: boolean;
  error: string | null;
  onUpdate: () => void;
}

const BrokerGrid: React.FC<BrokerGridProps> = ({ brokers, isLoading, error, onUpdate }) => {
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [editingBroker, setEditingBroker] = useState<Broker | null>(null);
  const [isResending, setIsResending] = useState<string | null>(null);

  const handleStatusToggle = async (broker: Broker) => {
    try {
      await toggleBrokerStatus(broker.id, broker.status);
      onUpdate();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleResendInvite = async (broker: Broker) => {
    try {
      setIsResending(broker.id);
      await resendBrokerInvitation(broker.id);
      onUpdate();
    } catch (error) {
      console.error('Error resending invitation:', error);
    } finally {
      setIsResending(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error && brokers.length > 0) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (brokers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Keine Unter-Broker vorhanden</h3>
          <p className="text-gray-500">Laden Sie neue Broker ein, um Ihr Team zu erweitern.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <div key={broker.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
              <div className="flex items-center space-x-4">
                {broker.logoUrl ? (
                  <img
                    src={broker.logoUrl}
                    alt={broker.companyName}
                    className="h-16 w-16 rounded-lg object-cover bg-white"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-white flex items-center justify-center border">
                    <span className="text-2xl font-medium text-gray-400">
                      {broker.companyName.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{broker.fullName}</h3>
                  <p className="text-sm text-gray-500">{broker.companyName}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href={`mailto:${broker.email}`} className="hover:text-blue-600">
                    {broker.email}
                  </a>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href={`tel:${broker.phone}`} className="hover:text-blue-600">
                    {broker.phone}
                  </a>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                  <span>{broker.address.street}, {broker.address.postalCode} {broker.address.city}</span>
                </div>
                {broker.commissionPerVehicle !== undefined && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Provision pro Fahrzeug:</span>
                    <span className="ml-2">{broker.commissionPerVehicle.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    broker.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : broker.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {broker.status === 'active' ? 'Aktiv' :
                     broker.status === 'inactive' ? 'Gesperrt' : 'Ausstehend'}
                  </span>
                  <span className="text-sm text-gray-500">
                    Eingeladen: {formatDistanceToNow(new Date(broker.createdAt))}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedBroker(broker)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </button>
                  <button
                    onClick={() => setEditingBroker(broker)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Bearbeiten
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusToggle(broker)}
                    className={`p-1.5 rounded-md ${
                      broker.status === 'active'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={broker.status === 'active' ? 'Sperren' : 'Entsperren'}
                  >
                    {broker.status === 'active' ? (
                      <Ban className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>

                  {!broker.lastLoginAt && (
                    <button
                      onClick={() => handleResendInvite(broker)}
                      disabled={isResending === broker.id}
                      className={`p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md ${
                        isResending === broker.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      title="Einladung erneut senden"
                    >
                      <RefreshCw className={`w-4 h-4 ${isResending === broker.id ? 'animate-spin' : ''}`} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBroker && (
        <BrokerDetailsModal
          broker={selectedBroker}
          onClose={() => setSelectedBroker(null)}
        />
      )}

      {editingBroker && (
        <BrokerEditModal
          broker={editingBroker}
          onClose={() => setEditingBroker(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default BrokerGrid;
