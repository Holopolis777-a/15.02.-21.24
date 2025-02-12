import React from 'react';
import { useBrokerData } from '../../../hooks/useBrokerData';

const BrokerWelcome = () => {
  const { brokerData, loading } = useBrokerData();
  
  if (loading) {
    return <span>Willkommen</span>;
  }
  
  return <span>Willkommen {brokerData?.fullName || brokerData?.companyName || ''}</span>;
};

export default BrokerWelcome;
