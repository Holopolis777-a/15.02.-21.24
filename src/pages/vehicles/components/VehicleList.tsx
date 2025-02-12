import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Vehicle } from '../../../types/vehicle';
import { useAuthStore } from '../../../hooks/useAuthStore';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, isLoading, error }) => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {user?.role === 'admin' && (
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/vehicles/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Fahrzeug hinzufügen
          </button>
        </div>
      )}

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          Keine Fahrzeuge gefunden
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
