import React, { useState } from 'react';
import { User } from '../../../types/auth';
import { useBrokerData } from '../../../hooks/useBrokerData';
import CompanyDataComponent from './CompanyData';

interface BrokerCompanyDataProps {
  user: User;
}

const BrokerCompanyData: React.FC<BrokerCompanyDataProps> = ({ user }) => {
  const { brokerData, loading, updateBrokerData } = useBrokerData();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return <div className="p-4">Laden...</div>;
  }

  const formData = {
    firstName: '',
    lastName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    street: brokerData?.address?.street || '',
    houseNumber: '',
    postalCode: brokerData?.address?.postalCode || '',
    city: brokerData?.address?.city || '',
    mobileNumber: '',
    phone: brokerData?.phone || ''
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      const currentAddress = brokerData?.address || { street: '', city: '', postalCode: '' };
      await updateBrokerData({
        address: {
          ...currentAddress,
          [field]: value
        }
      });
    } else {
      await updateBrokerData({
        [name]: value
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <CompanyDataComponent
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          formData={formData}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default BrokerCompanyData;
