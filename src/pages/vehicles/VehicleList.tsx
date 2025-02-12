import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useVehicles } from '../../hooks/useVehicles';
import { useAuthStore } from '../../hooks/useAuthStore';
import { VehicleCategory } from '../../types/vehicle';
import CategoryFilters from './components/CategoryFilters';
import VehicleCard from './components/VehicleCard';

const VehicleList = () => {
  const navigate = useNavigate();
  const { vehicles, isLoading, error } = useVehicles();
  const user = useAuthStore(state => state.user);
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredVehicles = vehicles.filter(vehicle => 
    selectedCategory === 'all' || vehicle.category === selectedCategory
  );

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
        Fehler beim Laden der Fahrzeuge
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Fahrzeugverwaltung</h1>
        {user?.role === 'admin' && (
          <button
            onClick={() => navigate('/vehicles/new')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Fahrzeug hinzufügen
          </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <CategoryFilters
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
        
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marke & Modell
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Baujahr
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grundpreis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      {vehicle.trimLevel && (
                        <div className="text-sm text-gray-500">{vehicle.trimLevel}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.category === 'company'
                          ? 'bg-purple-100 text-purple-800'
                          : vehicle.category === 'salary'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {vehicle.category === 'company'
                          ? 'Firmenwagen'
                          : vehicle.category === 'salary'
                          ? 'Gehaltsumwandlung'
                          : 'Standard'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.basePrice
                        ? new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(vehicle.basePrice)
                        : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        vehicle.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vehicle.isAvailable ? 'Verfügbar' : `Lieferzeit: ${vehicle.deliveryTime} Monate`}
                      </span>
                    </td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Bearbeiten
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
