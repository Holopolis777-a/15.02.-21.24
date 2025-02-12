import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';
import { Broker } from '../types/broker';

export const useSubBrokers = () => {
  const { user } = useAuthStore();
  const [subBrokers, setSubBrokers] = useState<Broker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubBrokers = async () => {
      if (!user?.id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Query brokers where parentBrokerId matches current user's ID
        const brokersRef = collection(db, 'brokers');
        const q = query(brokersRef, where('parentBrokerId', '==', user.id));
        const querySnapshot = await getDocs(q);

        const brokers: Broker[] = [];
        for (const doc of querySnapshot.docs) {
          const broker = { id: doc.id, ...doc.data() } as Broker;
          
          // For each sub-broker, fetch their sub-brokers
          const subBrokersQuery = query(brokersRef, where('parentBrokerId', '==', broker.brokerId));
          const subBrokersSnapshot = await getDocs(subBrokersQuery);
          
          broker.subBrokers = subBrokersSnapshot.docs.map(subDoc => ({
            id: subDoc.id,
            ...subDoc.data()
          })) as Broker[];
          
          brokers.push(broker);
        }

        setSubBrokers(brokers);
      } catch (err) {
        console.error('Error fetching sub-brokers:', err);
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Unter-Broker');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubBrokers();
  }, [user?.id]);

  return {
    subBrokers,
    isLoading,
    error
  };
};
