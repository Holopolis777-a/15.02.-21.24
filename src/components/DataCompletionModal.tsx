import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { User } from '../types/auth';

interface DataCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DataCompletionModal: React.FC<DataCompletionModalProps> = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuthStore();
  const [formData, setFormData] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    street: user?.street || '',
    houseNumber: user?.houseNumber || '',
    postalCode: user?.postalCode || '',
    city: user?.city || '',
    mobileNumber: user?.mobileNumber || ''
  }));

  // Reset form data when user changes or modal opens
  React.useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        street: user.street || '',
        houseNumber: user.houseNumber || '',
        postalCode: user.postalCode || '',
        city: user.city || '',
        mobileNumber: user.mobileNumber || ''
      });
    }
  }, [isOpen, user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset states when modal is closed
  React.useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    setError(null);
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Get current user data first
      const userRef = doc(db, 'users', user.id);
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.data() || {};

      // Check if all required fields are filled
      const isComplete = Boolean(
        formData.firstName &&
        formData.lastName &&
        formData.street &&
        formData.houseNumber &&
        formData.postalCode &&
        formData.city &&
        formData.mobileNumber
      );

      // Preserve existing data and add new fields
      // Start with required base data
      const updateData: any = {
        ...formData,
        isProfileComplete: isComplete,
        role: currentData.role || user.role,
        email: currentData.email || user.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        createdAt: currentData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // For customers, handle brokerId
      if (user.role === 'customer') {
        const existingBrokerId = currentData.brokerId || user.brokerId;
        if (existingBrokerId) {
          updateData.brokerId = existingBrokerId;
        }
      } else {
        // For other roles, handle companyId
        const existingCompanyId = currentData.companyId || user.companyId;
        if (existingCompanyId) {
          updateData.companyId = existingCompanyId;
        }
      }

      // Only include optional fields if they exist
      if (currentData.portalType === 'normal' || currentData.portalType === 'salary') {
        updateData.portalType = currentData.portalType;
      }

      if (currentData.inviteId) {
        updateData.inviteId = currentData.inviteId;
      }

      console.log('Saving user data:', {
        isComplete,
        formData,
        updateData
      });

      // Update Firestore
      await updateDoc(userRef, updateData);

      // Update the invite status
      if (user.inviteId) {
        const inviteRef = doc(db, 'employeeInvites', user.inviteId);
        const inviteDoc = await getDoc(inviteRef);
        if (inviteDoc.exists()) {
          const currentStatus = inviteDoc.data()?.status;
          // Only update if not already in a final state
          if (currentStatus === 'pending') {
            await updateDoc(inviteRef, {
              status: 'accepted',
              updatedAt: new Date().toISOString()
            });
          }
        }
      }

      // Create a new user object with required fields
      const updatedUser: User = {
        id: user.id, // Always required
        email: updateData.email,
        role: updateData.role,
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        street: updateData.street,
        houseNumber: updateData.houseNumber,
        postalCode: updateData.postalCode,
        city: updateData.city,
        mobileNumber: updateData.mobileNumber,
        isProfileComplete: updateData.isProfileComplete,
        updatedAt: updateData.updatedAt,
        createdAt: updateData.createdAt
      };

      // Handle role-specific fields
      if (user.role === 'customer') {
        if (updateData.brokerId) {
          updatedUser.brokerId = updateData.brokerId;
        }
      } else if (updateData.companyId) {
        updatedUser.companyId = updateData.companyId;
      }

      // Only include optional fields if they exist in updateData
      if (updateData.portalType === 'normal' || updateData.portalType === 'salary') {
        updatedUser.portalType = updateData.portalType;
      }

      if (updateData.inviteId) {
        updatedUser.inviteId = updateData.inviteId;
      }

      // Update local user state
      setUser(updatedUser);

      setSuccess('Daten wurden erfolgreich gespeichert');
      
      // Wait a bit to show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force reload user data from Firestore to ensure sync
      const refreshDoc = await getDoc(userRef);
      const refreshData = refreshDoc.data();
      if (refreshData) {
        // Create refreshed user with required fields
        const refreshedUser: User = {
          id: user.id,
          email: refreshData.email,
          role: refreshData.role,
          firstName: refreshData.firstName,
          lastName: refreshData.lastName,
          street: refreshData.street,
          houseNumber: refreshData.houseNumber,
          postalCode: refreshData.postalCode,
          city: refreshData.city,
          mobileNumber: refreshData.mobileNumber,
          isProfileComplete: refreshData.isProfileComplete,
          updatedAt: refreshData.updatedAt,
          createdAt: refreshData.createdAt
        };

        // Handle role-specific fields
        if (user.role === 'customer') {
          if (refreshData.brokerId) {
            refreshedUser.brokerId = refreshData.brokerId;
          }
        } else if (refreshData.companyId) {
          refreshedUser.companyId = refreshData.companyId;
        }

        // Only include optional fields if they exist
        if (refreshData.portalType === 'normal' || refreshData.portalType === 'salary') {
          refreshedUser.portalType = refreshData.portalType;
        }

        if (refreshData.inviteId) {
          refreshedUser.inviteId = refreshData.inviteId;
        }

        setUser(refreshedUser);
      }

      // Close the modal
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten';
      console.error('Error updating user data:', error);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Daten vervollständigen</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Vorname
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Nachname
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Straße
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="houseNumber" className="block text-sm font-medium text-gray-700">
                Hausnummer
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                Postleitzahl
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                Ort
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
              Handynummer
            </label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Speichern...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataCompletionModal;
