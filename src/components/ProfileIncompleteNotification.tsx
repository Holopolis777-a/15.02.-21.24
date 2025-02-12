import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProfileIncompleteNotification = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Profil unvollständig</h2>
        <p className="text-gray-600 mb-6">
          Hallo {user?.firstName}, bitte vervollständigen Sie noch Ihre Daten, bevor Sie ein Fahrzeug anfragen können.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Zurück
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Zum Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileIncompleteNotification;
