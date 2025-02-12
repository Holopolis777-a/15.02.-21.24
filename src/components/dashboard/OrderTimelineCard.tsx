import React from 'react';
import { useOrders } from '../../hooks/useOrders';
import { useAuthStore } from '../../store/authStore';
import OrderTimeline from '../OrderTimeline';
import { Clock } from 'lucide-react';
import { OrderStatus } from '../../types/vehicleRequest';

const OrderTimelineCard: React.FC = () => {
  const { user } = useAuthStore();
  const { orders, loading } = useOrders(undefined, user?.id);

  // Sortiere Bestellungen nach Datum (neueste zuerst)
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
    const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
    return dateB.getTime() - dateA.getTime();
  });

  const latestOrder = sortedOrders[0];

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (!latestOrder) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <h2 className="text-xl font-bold text-gray-800">Bestellstatus</h2>
        </div>
        <p className="text-gray-500">Keine aktiven Bestellungen vorhanden</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-500" />
        <h2 className="text-xl font-bold text-gray-800">Bestellstatus</h2>
      </div>
      <div className="mb-4">
        <h3 className="font-medium text-gray-700">
          {latestOrder.brand} {latestOrder.model}
        </h3>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">
            Bestellnummer: {latestOrder.id}
          </p>
          <p className="text-sm text-gray-500">
            {latestOrder.duration} Monate • {latestOrder.mileagePerYear.toLocaleString('de-DE')} km/Jahr
          </p>
          <p className="text-sm font-medium text-teal-600">
            {latestOrder.monthlyRate.toLocaleString('de-DE')},-€ / Monat
          </p>
        </div>
      </div>
      <OrderTimeline currentStatus={latestOrder.status as OrderStatus} />
    </div>
  );
};

export default OrderTimelineCard;
