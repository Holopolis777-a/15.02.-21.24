import React from 'react';
import { useSubBrokers } from '../../../hooks/useSubBrokers';
import { useBrokerCommission } from '../../../hooks/useBrokerCommission';
import { Users, ChevronRight } from 'lucide-react';

const BrokerCommissionHierarchy: React.FC = () => {
  const { commissionData, isLoading: commissionLoading } = useBrokerCommission();
  const { subBrokers, isLoading: brokersLoading } = useSubBrokers();

  if (commissionLoading || brokersLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Lade Provisionsdaten...</p>
      </div>
    );
  }

  if (!commissionData) {
    return null;
  }

  return (
    <div className="p-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Ihre Provisionsübersicht</h3>
        <div className="mt-2 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Ihre Provision pro Fahrzeug</p>
              <p className="text-lg font-medium text-blue-600">{commissionData.commissionPerVehicle}€</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verfügbare Provision</p>
              <p className="text-lg font-medium text-blue-600">
                {commissionData.subBrokerCommissions && Object.keys(commissionData.subBrokerCommissions).length > 0
                  ? commissionData.availableCommission
                  : commissionData.originalCommission}€
              </p>
            </div>
          </div>
        </div>
      </div>

      {subBrokers?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Provisionshierarchie</h3>
          <div className="space-y-4">
          {subBrokers.map((broker) => (
            <div key={broker.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{broker.fullName}</p>
                    <p className="text-sm text-gray-500">{broker.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Provision pro Fahrzeug</p>
                    <p className="font-medium text-gray-900">
                      {broker.commissionPerVehicle || 0}€
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {(broker.subBrokers && broker.subBrokers.length > 0) && (
                <div className="mt-4 pl-14">
                  <p className="text-sm text-gray-500 mb-2">Unter-Broker</p>
                  <div className="space-y-3">
                    {broker.subBrokers?.map((subBroker) => (
                      <div key={subBroker.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{subBroker.fullName}</p>
                            <p className="text-sm text-gray-500">{subBroker.companyName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Provision</p>
                          <p className="font-medium text-gray-800">
                            {subBroker.commissionPerVehicle || 0}€
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokerCommissionHierarchy;
