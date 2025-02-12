import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Broker } from '../types/broker';
import { useAuthStore } from '../store/authStore';

export const useBrokers = () => {
  const { user } = useAuthStore();
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBrokers = useCallback(() => {
    // For admin users, show all brokers
    // For broker users, only show their sub-brokers
    const brokersQuery = user?.role === 'admin'
      ? query(
          collection(db, 'brokers'),
          orderBy('createdAt', 'desc')
        )
      : query(
          collection(db, 'brokers'),
          where('parentBrokerId', '==', user?.id),
          orderBy('createdAt', 'desc')
        );

    return onSnapshot(
      brokersQuery,
      (snapshot) => {
        const brokerData: Broker[] = [];
        snapshot.forEach((doc) => {
          brokerData.push({ 
            id: doc.id, 
            ...doc.data() 
          } as Broker);
        });
        setBrokers(brokerData);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching brokers:', err);
        // Don't set error for empty results or permission issues
        if (err.code !== 'permission-denied' && err.code !== 'not-found') {
          setError('Fehler beim Laden der Makler');
        }
        setIsLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const unsubscribe = loadBrokers();
    return () => unsubscribe();
  }, [loadBrokers]);

  const refreshBrokers = useCallback(() => {
    setIsLoading(true);
    const unsubscribe = loadBrokers();
    return () => unsubscribe();
  }, [loadBrokers]);

  return { brokers, isLoading, error, refreshBrokers };
};
