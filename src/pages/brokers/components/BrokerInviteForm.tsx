import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrokerInviteFormData } from '../../../types/broker';
import { useBrokerInvite } from '../../../hooks/useBrokerInvite';
import { useBrokerCommission } from '../../../hooks/useBrokerCommission';
import { useAuthStore } from '../../../store/authStore';
import ImageUpload from './ImageUpload';
import SuccessModal from '../../../components/SuccessModal';

const BrokerInviteForm = () => {
  const navigate = useNavigate();
  const { sendInvite, isLoading: isInviteLoading } = useBrokerInvite();
  const { user } = useAuthStore();
  const { commissionData, isLoading: isCommissionLoading } = useBrokerCommission();
  const [error, setError] = useState<string | null>(null);
  const isAdmin = user?.role === 'admin';
  const [formData, setFormData] = useState<BrokerInviteFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    address: {
      street: '',
      city: '',
      postalCode: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'commissionPerVehicle') {
      // Convert commission to integer
      const commission = value ? Math.floor(Number(value)) : undefined;
      setFormData(prev => ({ ...prev, [name]: commission }));
    } else if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getAvailableCommission = () => {
    if (isAdmin) return null; // Admin can set any commission
    if (!commissionData) return 0;
    return commissionData.subBrokerCommissions && Object.keys(commissionData.subBrokerCommissions).length > 0
      ? commissionData.availableCommission
      : commissionData.originalCommission;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate that required fields are filled
      if (!formData.fullName || !formData.email || !formData.phone || !formData.companyName ||
          !formData.address.street || !formData.address.city || !formData.address.postalCode ||
          !formData.commissionPerVehicle) {
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus');
      }

      // Validate commission amount only for non-admin users
      if (!isAdmin) {
        if (!commissionData) {
          throw new Error('Provisionsdaten nicht verfügbar');
        }

        const availableCommission = getAvailableCommission();
        if (availableCommission !== null && formData.commissionPerVehicle > availableCommission) {
          throw new Error('Die angegebene Provision übersteigt Ihre verfügbare Provision');
        }
      }

      const success = await sendInvite(formData);
      if (success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/brokers');
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Persönliche Daten */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Persönliche Daten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vollständiger Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-Mail-Adresse <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefonnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Firmenname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Geschäftsadresse */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Geschäftsadresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Straße und Hausnummer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.street"
              required
              value={formData.address.street}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stadt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.city"
              required
              value={formData.address.city}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Postleitzahl <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.postalCode"
              required
              pattern="[0-9]{5}"
              value={formData.address.postalCode}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Provision */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Provision</h3>
        <div className="mb-4">
          {!isAdmin && (
            <div className="text-sm text-gray-600 mb-2">
              Ihre verfügbare Provision: {getAvailableCommission() || 0}€
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700">
            {isAdmin ? 'Provision pro Fahrzeug' : 'Provision pro Fahrzeug für den neuen Broker'} <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="number"
              name="commissionPerVehicle"
              required
              min="0"
              step="1"
              pattern="\d*"
              max={isAdmin ? undefined : getAvailableCommission() || undefined}
              value={formData.commissionPerVehicle || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {isAdmin ? (
              <>
                Diese Provision wird auch als verfügbare Provision für den Broker gesetzt.<br />
                Die Provision muss eine ganze Zahl sein.
              </>
            ) : (
              'Die Provision muss eine ganze Zahl sein.'
            )}
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
        <ImageUpload
          onUpload={(base64Data) => {
            try {
              setFormData(prev => ({
                ...prev,
                logo: base64Data // Store base64 data directly
              }));
            } catch (err) {
              console.error('Error setting logo:', err);
              setError(err instanceof Error ? err.message : 'Fehler beim Hochladen des Logos');
            }
          }}
          maxSize={2}
          accept="image/jpeg,image/png"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/brokers')}
          disabled={isInviteLoading || isCommissionLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isInviteLoading || isCommissionLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isInviteLoading ? 'Wird gesendet...' : 'Einladung senden'}
        </button>
      </div>
      </form>
      
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        title="Einladung erfolgreich versendet"
        description="Der Makler wurde erfolgreich eingeladen und wird in Kürze eine E-Mail mit weiteren Informationen erhalten."
        buttonText="Zur Übersicht"
      />
    </div>
  );
};

export default BrokerInviteForm;
