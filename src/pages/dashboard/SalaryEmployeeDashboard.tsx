import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import CompanyLogo from '../../components/company/CompanyLogo';
import { useVehicles } from '../../hooks/useVehicles';
import { useNews } from '../../hooks/useNews';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import VehicleRequestList from '../../pages/requests/components/VehicleRequestList';
import OrderTimelineCard from '../../components/dashboard/OrderTimelineCard';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Vehicle } from '../../types/vehicle';

interface VehicleCarouselProps {
  vehicles: Vehicle[];
  title: string;
}

const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ vehicles, title }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVehicle = () => {
    setCurrentIndex((prev) => 
      prev === vehicles.length - 1 ? 0 : prev + 1
    );
  };

  const previousVehicle = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? vehicles.length - 1 : prev - 1
    );
  };

  if (vehicles.length === 0) return null;

  const currentVehicle = vehicles[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 h-full">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
      <div className="relative aspect-[16/10]">
        {currentVehicle.images?.[0] ? (
          <img 
            src={currentVehicle.images[0]}
            alt={`${currentVehicle.brand} ${currentVehicle.model}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold">
            {currentVehicle.brand} {currentVehicle.model}
          </h3>
          <p className="text-sm opacity-90">
            {currentVehicle.power} PS • {currentVehicle.transmission}
          </p>
        </div>
        <button 
          onClick={previousVehicle}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          ←
        </button>
        <button 
          onClick={nextVehicle}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors"
        >
          →
        </button>
      </div>
      <div className="mt-4">
        <button 
          onClick={() => navigate(`/vehicles/${currentVehicle.id}/detail`)}
          className="w-full bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Details anzeigen
        </button>
      </div>
    </div>
  );
};

const NewsFeed: React.FC = () => {
  const { news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md divide-y">
      {news.map((post) => (
        <div key={post.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
              <p className="mt-1 text-gray-600">{post.content}</p>
            </div>
            <div className="text-sm text-gray-500">
              <Calendar className="inline-block w-4 h-4 mr-1" />
              {format(new Date(post.publishedAt), 'dd. MMMM yyyy', { locale: de })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SalaryEmployeeDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { vehicles, isLoading } = useVehicles();
  const { requests, loading, error } = useVehicleRequests();

  const salaryVehicles = vehicles.filter(v => v.categories?.includes('salary'));

  return (
    <div className="p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <CompanyLogo className="w-12 h-12" />
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.firstName ? `Willkommen, ${user.firstName} 👋` : 'Herzlich Willkommen'}
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            {!isLoading && salaryVehicles.length > 0 && (
              <VehicleCarousel vehicles={salaryVehicles} title="Gehaltsumwandlung" />
            )}

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Neuigkeiten</h2>
              <NewsFeed />
            </div>

            <div className="mt-8">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Ihre Anfragen</h2>
                <VehicleRequestList 
                  requests={requests} 
                  loading={loading} 
                  error={error} 
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <OrderTimelineCard />
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Vorteile der Gehaltsumwandlung</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="bg-teal-500 text-white p-2 rounded-lg">💰</div>
                  <div>
                    <h3 className="font-semibold">Steuerliche Vorteile</h3>
                    <p className="text-sm text-gray-600">Sparen Sie durch die Gehaltsumwandlung</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="bg-teal-500 text-white p-2 rounded-lg">🚗</div>
                  <div>
                    <h3 className="font-semibold">Große Auswahl</h3>
                    <p className="text-sm text-gray-600">Viele Modelle verfügbar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="bg-teal-500 text-white p-2 rounded-lg">✨</div>
                  <div>
                    <h3 className="font-semibold">Full-Service</h3>
                    <p className="text-sm text-gray-600">Wartung und Versicherung inklusive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryEmployeeDashboard;
