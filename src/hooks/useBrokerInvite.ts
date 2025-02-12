import { useState } from 'react';
import { BrokerInviteFormData } from '../types/broker';
import { inviteBroker } from '../services/brokerService';
import { validateBrokerData } from '../utils/brokerValidation';

export const useBrokerInvite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInvite = async (data: BrokerInviteFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate form data
      validateBrokerData(data);

      // Send invitation
      await inviteBroker(data);

      return true;
    } catch (err) {
      console.error('Error sending invitation:', err);
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendInvite,
    isLoading,
    error
  };
};