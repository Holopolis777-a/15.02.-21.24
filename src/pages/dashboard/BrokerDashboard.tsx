import React from 'react';
import { Building2, Users, Calendar, EuroIcon } from 'lucide-react';
import { useNews } from '../../hooks/useNews';
import { useBrokerStats } from '../../hooks/useBrokerStats';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const BrokerDashboard = () => {
  const { stats, loading, error } = useBrokerStats();

  const statsData = [
    {
      title: 'Aktive Unternehmen',
      value: loading ? '...' : stats.activeCompanies.toString(),
      icon: Building2,
      color: 'text-purple-500',
    },
    {
      title: 'Aktive Mitglieder',
      value: loading ? '...' : stats.activeMembers.toString(),
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Verfügbare Provision',
      value: loading ? '...' : `${stats.monthlyCommission.toLocaleString('de-DE')} €`,
      icon: EuroIcon,
      color: 'text-emerald-500',
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsData.map((stat) => (
          <div
            key={stat.title}
            className={`bg-white p-4 rounded-xl shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-full ${stat.color.replace('text', 'bg').replace('500', '100')}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Schnellzugriff</h2>
          <div className="space-y-3">
            <a href="/broker-customers" className="block text-blue-600 hover:text-blue-800">
              → Kunden verwalten
            </a>
            <a href="/commissions" className="block text-blue-600 hover:text-blue-800">
              → Provisionsübersicht
            </a>
            <a href="/documents" className="block text-blue-600 hover:text-blue-800">
              → Dokumente
            </a>
          </div>
        </div>
      </div>

      {/* News Feed Section */}
      <div className="mt-6">
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

export default BrokerDashboard;
