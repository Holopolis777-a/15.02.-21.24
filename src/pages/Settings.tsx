import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to profile page immediately
    navigate('/profile');
  }, [navigate]);

  // Return null since we're redirecting immediately
  return null;
};

export default Settings;