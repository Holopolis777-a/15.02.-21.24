import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Broker } from '../../../types/broker';
import { updateBroker } from '../../../services/brokerService';
import ImageUpload from './ImageUpload';
import { uploadBrokerLogo } from '../../../utils/fileUpload';

interface BrokerEditModalProps {
  broker: Broker;
  onClose: () => void;
  onUpdate: () => void;
}

const BrokerEditModal: React.FC<BrokerEditModalProps> = ({ broker, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: broker.fullName,
    email: broker.email,
    phone: broker.phone,
    companyName: broker.companyName,
    address: {
      street: broker.address.street,
      city: broker.address.city,
      postalCode: broker.address.postalCode
    },
    commissionPerVehicle: broker.commissionPerVehicle || 0
  });
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updateData = { ...formData };

      // Update logo if provided
      if (logo) {
        Object.assign(updateData, { logoUrl: logo });
      }

      await updateBroker(broker.id, updateData);
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error updating broker:', err);
      setError(err instanceof Error ? err.message : 'Fehler beim Aktualisieren des Maklers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Makler bearbeiten
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logo</h3>
            <div className="flex items-center space-x-6">
              {/* Current Logo Preview */}
              {broker.logoUrl && !logo && (
                <div className="relative">
                  <img
                    src={broker.logoUrl}
                    alt="Aktuelles Logo"
                    className="w-24 h-24 object-contain bg-gray-50 rounded-lg"
                  />
                  <span className="block mt-2 text-sm text-gray-500">Aktuelles Logo</span>
                </div>
              )}
              
              {/* New Logo Preview */}
              {logo && (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Neues Logo"
                    className="w-24 h-24 object-contain bg-gray-50 rounded-lg"
                  />
                  <span className="block mt-2 text-sm text-gray-500">Neues Logo</span>
                </div>
              )}

              {/* Upload Component */}
              <div className="flex-1">
                <ImageUpload
                  onUpload={(base64: string) => setLogo(base64)}
                  maxSize={2}
                  accept="image/jpeg,image/png"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Provision pro Fahrzeug (€)
              </label>
              <input
                type="number"
                name="commissionPerVehicle"
                min="0"
                step="0.01"
                value={formData.commissionPerVehicle}
                onChange={handleChange}
                disabled={broker.parentBrokerId !== null}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${
                  broker.parentBrokerId !== null 
                  ? 'bg-gray-100 cursor-not-allowed' 
                  : 'focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
              {broker.parentBrokerId !== null && (
                <p className="mt-2 text-sm text-gray-600">
                  Wenn Sie die Provision ändern möchten, wenden Sie sich an Ihren VILONDA Beauftragten.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
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
                E-Mail
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
                Telefon
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
                Firmenname
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

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Adresse</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Straße und Hausnummer
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
                  PLZ
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

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stadt
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
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BrokerEditModal;
