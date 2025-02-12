import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useVehicles } from '../../hooks/useVehicles';
import { useOrders } from '../../hooks/useOrders';
import OrderTimelineCard from '../../components/dashboard/OrderTimelineCard';
import { Vehicle } from '../../types/vehicle';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { vehicles } = useVehicles();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Willkommen {user?.firstName} {user?.lastName}
        </h1>
        <p className="mt-2 text-gray-600">
          Hier finden Sie eine Übersicht Ihrer Aktivitäten und verfügbaren Fahrzeuge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fahrzeuge */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Verfügbare Fahrzeuge</h2>
          <div className="space-y-4">
            {vehicles?.slice(0, 3).map((vehicle: Vehicle) => (
              <Link
                key={vehicle.id}
                to={`/vehicles/${vehicle.id}/detail`}
                className="block hover:bg-gray-50 p-3 rounded-lg transition duration-150 ease-in-out"
              >
                <div className="flex items-center space-x-4">
                  {vehicle.images?.[0] && (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="text-sm text-gray-500">
                      {vehicle.fuelType} • {vehicle.transmission}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/vehicles"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Alle Fahrzeuge ansehen
            <svg
              className="ml-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Bestellungen */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ihre Bestellungen</h2>
          <OrderTimelineCard />
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Alle Bestellungen ansehen
            <svg
              className="ml-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>

        {/* Support */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Support</h2>
          <p className="text-gray-600 mb-4">
            Haben Sie Fragen oder benötigen Sie Hilfe? Unser Support-Team steht Ihnen zur Verfügung.
          </p>
          <Link
            to="/support"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Support kontaktieren
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
