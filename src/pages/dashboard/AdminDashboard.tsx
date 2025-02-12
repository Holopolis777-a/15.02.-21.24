import React from 'react';
import { Users, Car, AlertCircle, Calendar, Building2, Briefcase, Building, Clock } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { useVehicleRequests } from '../../hooks/useVehicleRequests';
import { VehicleRequestWithCompany } from '../../types/vehicleRequest';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '../../hooks/useDashboardStats';

const PendingVehicleRequests = () => {
  const { requests, loading, error } = useVehicleRequests();
  const navigate = useNavigate();

  const pendingRequests = requests.filter((request: VehicleRequestWithCompany) => request.status === 'pending');

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Clock className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-700">Ausstehende Fahrzeuganfragen</h2>
        </div>
      </div>
      
      <div className="space-y-2">
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">Keine ausstehenden Anfragen</p>
        ) : (
          pendingRequests.map((request: VehicleRequestWithCompany) => (
            <div
              key={request.id}
              onClick={() => navigate('/requests')}
              className="bg-gray-50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-800 font-medium">{request.brand} {request.model}</h3>
                  <p className="text-gray-600 text-sm">{request.company.name}</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {request.type === 'salary_conversion' ? 'Gehaltsumwandlung' : 'Standard'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { activeVehicles, openRequests, activeCompanies, activeUsers, isLoading, error } = useDashboardStats();

  const stats = [
    {
      title: 'Aktive Fahrzeuge',
      value: isLoading ? '...' : activeVehicles.toString(),
      icon: Car,
      description: 'Summe aller aktiven Fahrzeuge',
      color: 'text-blue-500',
    },
    {
      title: 'Offene Anfragen',
      value: isLoading ? '...' : openRequests.toString(),
      icon: AlertCircle,
      description: 'Ausstehende Anfragen aller Typen',
      color: 'text-amber-500',
    },
    {
      title: 'Aktive Unternehmen',
      value: isLoading ? '...' : activeCompanies.toString(),
      icon: Building,
      description: 'Registrierte Unternehmen',
      color: 'text-emerald-500',
    },
    {
      title: 'Aktive Nutzer',
      value: isLoading ? '...' : activeUsers.toString(),
      icon: Users,
      description: 'Registrierte Benutzer',
      color: 'text-purple-500',
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={() => navigate('/companies')}
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Building2 className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-gray-800">
              <h2 className="text-xl font-bold">Unternehmen</h2>
              <p className="text-gray-600">Unternehmen verwalten</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => navigate('/brokers')}
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 bg-purple-100 rounded-full">
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
            <div className="text-gray-800">
              <h2 className="text-xl font-bold">Broker</h2>
              <p className="text-gray-600">Broker verwalten</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Vehicle Requests Section */}
      <PendingVehicleRequests />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {error ? (
          <div className="col-span-4 p-4 bg-red-50 rounded-lg text-red-600">
            Fehler beim Laden der Statistiken
          </div>
        ) : (
          stats.map((stat) => (
            <div
              key={stat.title}
              className={`bg-white p-4 rounded-xl shadow-md`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-full ${stat.color.replace('text', 'bg').replace('500', '100')}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-sm text-gray-500">{stat.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* News Feed Section */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Neuigkeiten</h2>
        <NewsFeed />
      </div>
    </div>
  );
};

const NewsFeed = () => {
  const { news, isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4">
        <p className="text-gray-500">Keine Neuigkeiten verfügbar</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg divide-y">
      {news.map((post) => (
        <div key={post.id} className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
              <p className="mt-1 text-gray-600">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="mt-3 rounded-lg max-h-40 object-cover"
                />
              )}
              {post.externalUrl && (
                <a
                  href={post.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-blue-600 hover:text-blue-800"
                >
                  Mehr erfahren →
                </a>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {format(new Date(post.publishedAt), 'dd. MMMM yyyy', { locale: de })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
