import React, { useState, useEffect } from 'react';
import { User } from '../../../types/auth';
import { updateDocument } from '../../../lib/firebase/db';
import { useAuthStore } from '../../../store/authStore';
import { useBrokerData } from '../../../hooks/useBrokerData';
import AvatarUpload from './AvatarUpload';
import PersonalInfo from './PersonalInfo';
import PasswordChange from './PasswordChange';
import AdditionalInfo from './AdditionalInfo';
import CompanyData from './CompanyData';

interface ProfileFormProps {
  user: User | null;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ user }) => {
  const { setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(true); // Start in editing mode
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { brokerData } = useBrokerData();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    street: user?.street || '',
    houseNumber: user?.houseNumber || '',
    postalCode: user?.postalCode || '',
    city: user?.city || '',
    mobileNumber: user?.mobileNumber || '',
    phone: user?.role === 'broker' ? user?.phone || brokerData?.phone || '' : ''
  });

  // Update form data when broker data becomes available
  useEffect(() => {
    if (user?.role === 'broker' && brokerData) {
      setFormData(prev => ({
        ...prev,
        street: brokerData.address?.street || prev.street,
        postalCode: brokerData.address?.postalCode || prev.postalCode,
        city: brokerData.address?.city || prev.city,
        phone: brokerData.phone || prev.phone
      }));
    }
  }, [brokerData, user?.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Only include logoUrl if it exists
      if (user.logoUrl) {
        updateData.logoUrl = user.logoUrl;
      }

      // Add additional fields based on user role
      if (user.role === 'broker' && user.brokerId) {
        // Update user document
        updateData.street = formData.street;
        updateData.postalCode = formData.postalCode;
        updateData.city = formData.city;
        updateData.phone = formData.phone;
        await updateDocument('users', user.id, updateData);

        // Update broker document
        await updateDocument('brokers', user.brokerId, {
          address: {
            street: formData.street,
            postalCode: formData.postalCode,
            city: formData.city
          },
          phone: formData.phone,
          updatedAt: new Date().toISOString()
        });
      } else if (user.role === 'employee_normal' || user.role === 'employee_salary' || user.role === 'customer') {
        updateData.street = formData.street;
        updateData.houseNumber = formData.houseNumber;
        updateData.postalCode = formData.postalCode;
        updateData.city = formData.city;
        updateData.mobileNumber = formData.mobileNumber;
        updateData.isProfileComplete = Boolean(
          formData.street &&
          formData.houseNumber &&
          formData.postalCode &&
          formData.city &&
          formData.mobileNumber
        );

        // Für Mitarbeiter das companyId-Feld setzen, für Kunden explizit auf null setzen
        if (user.role === 'customer') {
          updateData.companyId = null;
        } else if (user.companyId) {
          updateData.companyId = user.companyId;
        }
      }

      // Update user profile in Firestore (for non-broker users)
      if (user.role !== 'broker') {
        await updateDocument('users', user.id, updateData);
      }

      // Update local user state
      setUser({
        ...user,
        ...updateData
      });

      setSuccess('Profil wurde erfolgreich aktualisiert');
      
      // Don't reload the page, state is already updated
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <AvatarUpload user={user} />
          <PersonalInfo 
            user={user} 
            isEditing={isEditing} 
            formData={formData}
            onChange={handleChange}
          />
          {user?.role === 'broker' ? (
            <CompanyData
              user={user}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              formData={formData}
              onChange={handleChange}
            />
          ) : (
            <AdditionalInfo
              user={user}
              isEditing={isEditing}
              formData={formData}
              onChange={handleChange}
            />
          )}
          <PasswordChange 
            isEditing={isEditing}
            formData={formData}
            onChange={handleChange}
          />
          
          <div className="flex justify-end space-x-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isLoading}
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? 'Wird gespeichert...' : 'Speichern'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Bearbeiten
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
