import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import DataCompletionModal from '../DataCompletionModal';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
  const { user } = useAuthStore();
  const [showDataModal, setShowDataModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Prüfen, ob das Daten-Vervollständigungsmodal angezeigt werden soll
    if (
      user &&
      !user.isProfileComplete &&
      user.role !== 'employer' &&
      user.role !== 'admin' &&
      user.role !== 'broker' &&
      !location.pathname.startsWith('/verify/') &&
      !location.pathname.startsWith('/register/')
    ) {
      setShowDataModal(true);
    } else {
      setShowDataModal(false);
    }
  }, [user, location.pathname]);

  const handleCloseModal = () => {
    setShowDataModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-xl overflow-hidden w-full min-h-[calc(100vh-2rem)] border border-white/20 backdrop-blur-sm">
        <Navigation />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
      <DataCompletionModal 
        isOpen={showDataModal} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Layout;
