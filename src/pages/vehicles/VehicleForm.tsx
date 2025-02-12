import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { Vehicle } from '../../types/vehicle';
import { useAuthStore } from '../../store/authStore';
import { useVehicleForm } from '../../hooks/useVehicleForm';
import BasicInformation from './components/BasicInformation';
import PromotionSection from './components/PromotionSection';
import TechnicalData from './components/TechnicalData';
import FeaturesSection from './components/features/FeaturesSection';
import PricingSection from './components/pricing/PricingSection';
import ImagesSection from './components/images/ImagesSection';
import PermissionsSection from './components/permissions/PermissionsSection';
import ColorSection from './components/colors/ColorSection';

const VehicleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAdmin = useAuthStore.getState().user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/vehicles" replace />;
  }
  const { vehicle, isLoading, error: loadError, saveVehicle } = useVehicleForm(id);
  const [currentTab, setCurrentTab] = useState('basic');
  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await saveVehicle(formData);
      navigate('/vehicles');
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Grundinformationen' },
    { id: 'promotion', label: 'Aktion / Promotion' },
    { id: 'colors', label: 'Farben' },
    { id: 'technical', label: 'Technische Daten' },
    { id: 'features', label: 'Ausstattung' },
    { id: 'pricing', label: 'Preise' },
    { id: 'images', label: 'Bilder' },
    { id: 'permissions', label: 'Berechtigungen' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug anlegen'}
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSaving ? 'Wird gespeichert...' : 'Speichern'}
          </button>
        </div>
      </div>

      {(error || loadError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {error || loadError}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                  currentTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {(() => {
            const commonProps = {
              data: formData,
              onChange: (data: Partial<Vehicle>) => {
                setFormData(prev => ({ ...prev, ...data }));
              }
            };

            switch (currentTab) {
              case 'basic':
                return <BasicInformation {...commonProps} />;
              case 'promotion':
                return <PromotionSection {...commonProps} />;
              case 'colors':
                return <ColorSection {...commonProps} />;
              case 'technical':
                return <TechnicalData {...commonProps} />;
              case 'features':
                return <FeaturesSection {...commonProps} />;
              case 'pricing':
                return <PricingSection {...commonProps} />;
              case 'images':
                return <ImagesSection {...commonProps} />;
              case 'permissions':
                return <PermissionsSection {...commonProps} />;
              default:
                return null;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default VehicleForm;
