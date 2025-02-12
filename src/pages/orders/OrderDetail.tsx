import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useVehicles } from '../../hooks/useVehicles';
import { formatDate } from '../../utils/dateUtils';
import { getDateFromTimestamp } from '../../utils/firestoreUtils';
import { Car } from 'lucide-react';
import { OrderStatus } from '../../types/vehicleRequest';
import { Vehicle } from '../../types/vehicle';
import OrderTimeline from '../../components/OrderTimeline';
import ServiceComparison from '../../components/ServiceComparison';
import VehicleFeatures from '../../components/VehicleFeatures';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, loading: ordersLoading, error: ordersError } = useOrders();
  const { vehicles, isLoading: vehiclesLoading, error: vehiclesError } = useVehicles();
  
  const order = orders.find(o => o.id === id);
  const vehicle = vehicles.find((v: Vehicle) => v.id === order?.vehicleId);

  if (ordersLoading || vehiclesLoading || !order) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (ordersError || vehiclesError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {ordersError || vehiclesError || 'Ein Fehler ist aufgetreten'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Zurück zur Übersicht
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {order.brand} {order.model}
          </h1>
          {order.trimLevel && (
            <p className="mt-2 text-lg text-gray-600">{order.trimLevel}</p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Vehicle Image */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                {order.vehicleImage ? (
                  <img
                    src={order.vehicleImage}
                    alt={`${order.brand} ${order.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Car className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Fahrzeugdetails</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Marke</p>
                  <p className="font-medium">{order.brand}</p>
                </div>
                <div>
                  <p className="text-gray-500">Modell</p>
                  <p className="font-medium">{order.model}</p>
                </div>
                {order.trimLevel && (
                  <div>
                    <p className="text-gray-500">Ausstattung</p>
                    <p className="font-medium">{order.trimLevel}</p>
                  </div>
                )}
                {order.color && (
                  <div>
                    <p className="text-gray-500">Farbe</p>
                    <p className="font-medium">{order.color}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Features */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Ausstattung</h2>
              <VehicleFeatures 
                features={[
                  ...(vehicle?.standardFeatures?.map(feature => ({ name: feature, included: true })) || []),
                  ...(vehicle?.additionalFeatures?.map(feature => ({ name: feature, included: true })) || [])
                ]} 
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Order Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bestelldetails</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Laufzeit</p>
                    <p className="font-medium">{order.duration} Monate</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Laufleistung</p>
                    <p className="font-medium">{order.mileagePerYear.toLocaleString()} km/Jahr</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monatliche Rate</p>
                    <p className="font-medium">
                      {order.monthlyRate.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Bestellt am</p>
                    <p className="font-medium">
                      {formatDate(getDateFromTimestamp(order.createdAt))}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Bestellstatus</h2>
              <OrderTimeline currentStatus={order.status as OrderStatus} />
            </div>

            {/* Service Comparison */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Inkludierte Leistungen</h2>
              <ServiceComparison />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
