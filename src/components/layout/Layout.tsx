import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import DataCompletionModal from '../DataCompletionModal';
import { useAuthStore } from '../../store/authStore';

const Layout = () => {
  const { user } = useAuthStore();
  const [showDataModal, setShowDataModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if we should show the data completion modal
    if (user && !user.isProfileComplete && 
        user.role !== 'employer' &&
        user.role !== 'admin' &&
        user.role !== 'broker' &&
        !location.pathname.startsWith('/verify/') && 
        !location.pathname.startsWith('/register/')) {
      setShowDataModal(true);
    } else {
      setShowDataModal(false);
    }
  }, [user, location.pathname]);

  const handleCloseModal = () => {
    setShowDataModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-yellow-50">
      <Header />
      <main className="pt-28 p-8">
        <Outlet />
      </main>
      <DataCompletionModal 
        isOpen={showDataModal} 
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Layout;
