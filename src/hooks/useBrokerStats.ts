import { useState, useEffect } from 'react';
import { useAuthStore } from './useAuthStore';
import { db } from '../lib/firebase/config';
import { collection, query, where, getDocs, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

export const useBrokerStats = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeCompanies: 0,
    activeMembers: 0,
    activeSubBrokers: 0,
    totalVehicles: 0
  });

  useEffect(() => {
    if (!user?.email) return;

    async function getAllSubBrokerIds(parentEmail: string): Promise<string[]> {
      const brokerIds: string[] = [parentEmail];
      const brokersRef = collection(db, 'brokers');
      
      // Get direct sub-brokers
      const subBrokersQuery = query(brokersRef, where('parentBrokerId', '==', parentEmail));
      const subBrokersSnapshot = await getDocs(subBrokersQuery);
      
      // For each sub-broker
      for (const doc of subBrokersSnapshot.docs) {
        const brokerData = doc.data();
        const brokerId = brokerData.email;
        brokerIds.push(brokerId);
        
        // Recursively get their sub-brokers
        const subBrokerIds = await getAllSubBrokerIds(brokerId);
        brokerIds.push(...subBrokerIds);
      }
      
      return [...new Set(brokerIds)]; // Remove duplicates
    }

    async function fetchStats() {
      if (!user?.email) return;

      try {
        setLoading(true);
        
        // Get all broker IDs recursively (using email as ID)
        const brokerIds = await getAllSubBrokerIds(user.email);
        console.log('All broker IDs (including nested):', brokerIds);

        // Get all companies for all brokers
        const companiesQuery = query(
          collection(db, 'companies'),
          where('brokerId', 'in', brokerIds)
        );
        const companiesSnapshot = await getDocs(companiesQuery);
        console.log('Companies:', companiesSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        const activeCompanies = companiesSnapshot.size;

        // Get all customers for all brokers
        const customersQuery = query(
          collection(db, 'customers'),
          where('brokerId', 'in', brokerIds)
        );
        const customersSnapshot = await getDocs(customersQuery);
        console.log('Customers:', customersSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        const activeMembers = customersSnapshot.size;

        // Get all sub-brokers (direct only)
        const subBrokersQuery = query(
          collection(db, 'brokers'),
          where('parentBrokerId', '==', user.email)
        );
        const subBrokersSnapshot = await getDocs(subBrokersQuery);
        const activeSubBrokers = subBrokersSnapshot.size;

        // Get all delivered vehicles by the broker and sub-brokers
        const vehiclesQuery = query(
          collection(db, 'vehicles'),
          where('brokerId', 'in', brokerIds),
          where('status', '==', 'delivered')
        );
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        const totalVehicles = vehiclesSnapshot.size;

        setStats({
          activeCompanies,
          activeMembers,
          activeSubBrokers,
          totalVehicles
        });
      } catch (err) {
        console.error('Error in fetchStats:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    }

    // Set up real-time listener for broker changes
    const brokersQuery = query(
      collection(db, 'brokers'),
      where('parentBrokerId', '==', user.email)
    );

    const unsubscribe = onSnapshot(brokersQuery, () => {
      fetchStats();
    });

    // Initial fetch
    fetchStats();

    return () => unsubscribe();
  }, [user?.email]);

  return { stats, loading, error };
};
