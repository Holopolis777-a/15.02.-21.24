import React, { useState } from 'react';
import { Bell, Mail, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { updateDocument } from '../../lib/firebase/db';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  type: 'push' | 'email';
  enabled: boolean;
  frequency?: 'immediately' | 'daily' | 'weekly';
}

const Notifications = () => {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new_vehicle',
      label: 'Neue Fahrzeuge',
      description: 'Benachrichtigungen über neue verfügbare Fahrzeuge',
      type: 'push',
      enabled: true,
      frequency: 'immediately'
    },
    {
      id: 'request_status',
      label: 'Anfragestatus',
      description: 'Updates zum Status Ihrer Fahrzeuganfragen',
      type: 'push',
      enabled: true,
      frequency: 'immediately'
    },
    {
      id: 'maintenance',
      label: 'Wartungserinnerungen',
      description: 'Erinnerungen an anstehende Wartungen',
      type: 'email',
      enabled: true,
      frequency: 'weekly'
    },
    {
      id: 'promotions',
      label: 'Aktionen & Angebote',
      description: 'Informationen über spezielle Angebote und Aktionen',
      type: 'email',
      enabled: false,
      frequency: 'weekly'
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const handleFrequencyChange = (id: string, frequency: 'immediately' | 'daily' | 'weekly') => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, frequency } : setting
    ));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateDocument('users', user.id, {
        notificationSettings: settings
      });

      setSuccess('Einstellungen wurden erfolgreich gespeichert');
    } catch (err) {
      setError('Fehler beim Speichern der Einstellungen');
      console.error('Save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center space-x-3 mb-8">
        <Bell className="w-8 h-8 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">
          Benachrichtigungseinstellungen
        </h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
          {success}
        </div>
      )}

      <div className="bg-white shadow rounded-lg divide-y">
        {settings.map(setting => (
          <div key={setting.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {setting.type === 'push' ? (
                  <Bell className="w-5 h-5 text-gray-400" />
                ) : (
                  <Mail className="w-5 h-5 text-gray-400" />
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {setting.label}
                  </h3>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={setting.enabled}
                  onChange={() => handleToggle(setting.id)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {setting.enabled && setting.frequency && (
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-sm text-gray-500">Häufigkeit:</span>
                <div className="flex space-x-2">
                  {['immediately', 'daily', 'weekly'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => handleFrequencyChange(setting.id, freq as any)}
                      className={`px-3 py-1 text-sm rounded-full ${
                        setting.frequency === freq
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {freq === 'immediately' ? 'Sofort' : 
                       freq === 'daily' ? 'Täglich' : 'Wöchentlich'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Wird gespeichert...' : 'Einstellungen speichern'}
        </button>
      </div>
    </div>
  );
};

export default Notifications;