import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { updateBroker } from '../services/brokerService';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';
import { Broker } from '../types/broker';

export const useBrokerData = () => {
  const [brokerData, setBrokerData] = useState<Partial<Broker> | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchBrokerData = async () => {
      console.log('Fetching broker data, user:', user);
      if (!user || user.role !== 'broker') {
        console.log('Not a broker user');
        setLoading(false);
        return;
      }

      try {
        if (!user?.email) {
          console.log('No user email available');
          setLoading(false);
          return;
        }

        console.log('Fetching broker document by email:', user.email);
        const brokerDoc = await getDoc(doc(db, 'brokers', user.email));

        console.log('Document exists:', brokerDoc.exists());
        if (brokerDoc.exists()) {
          const data = brokerDoc.data() as Broker;
          console.log('Found broker data:', data);
          setBrokerData(data);
        } else {
          console.log('No broker document found');
        }
      } catch (error) {
        console.error('Error fetching broker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerData();
  }, [user?.email, user?.role]);

  const updateBrokerData = useCallback(async (data: Partial<Broker>) => {
    if (!user?.email) return false;
    
    try {
      await updateBroker(user.email, data);
      setBrokerData(prev => prev ? { ...prev, ...data } : null);
      return true;
    } catch (error) {
      console.error('Error updating broker data:', error);
      return false;
    }
  }, [user?.email]);

  return { brokerData, loading, updateBrokerData };
};
