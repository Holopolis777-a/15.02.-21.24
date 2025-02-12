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
    monthlyCommission: 0
  });

  useEffect(() => {
    if (!user?.id) return;

    // Echtzeit-Listener für Broker-Änderungen
    const brokersQuery = query(
      collection(db, 'brokers'),
      where('parentBrokerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(brokersQuery, async (brokerSnapshot) => {
      await fetchStats(brokerSnapshot);
    });

    // Initial stats fetch
    fetchStats();

    return () => unsubscribe();

    async function getAllSubBrokerIds(parentId: string): Promise<string[]> {
      const brokerIds: string[] = [parentId];
      const brokersRef = collection(db, 'brokers');
      
      // Get direct sub-brokers
      const subBrokersQuery = query(brokersRef, where('parentBrokerId', '==', parentId));
      const subBrokersSnapshot = await getDocs(subBrokersQuery);
      
      // For each sub-broker
      for (const doc of subBrokersSnapshot.docs) {
        const brokerData = doc.data();
        const brokerId = brokerData.brokerId || doc.id;
        brokerIds.push(brokerId);
        
        // Recursively get their sub-brokers
        const subBrokerIds = await getAllSubBrokerIds(brokerId);
        brokerIds.push(...subBrokerIds);
      }
      
      return [...new Set(brokerIds)]; // Remove duplicates
    }

    async function fetchStats(brokerSnapshotParam?: QuerySnapshot<DocumentData>) {
      if (!user) return;

      try {
        setLoading(true);
        
        // Get all broker IDs recursively
        const brokerIds = await getAllSubBrokerIds(user.id);
        console.log('All broker IDs (including nested):', brokerIds);

        // Get all companies for all brokers
        const companiesQuery = query(
          collection(db, 'companies'),
          where('invitedBy', 'in', brokerIds)
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

        // Get all vehicles delivered this month by the broker and sub-brokers
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const vehiclesQuery = query(
          collection(db, 'vehicles'),
          where('brokerId', 'in', brokerIds),
          where('status', '==', 'delivered'),
          where('deliveryDate', '>=', startOfMonth)
        );
        const vehiclesSnapshot = await getDocs(vehiclesQuery);
        
        let totalCommission = 0;

        // Calculate commission for each vehicle
        for (const vehicleDoc of vehiclesSnapshot.docs) {
          const vehicle = vehicleDoc.data();
          const broker = await getDocs(query(
            collection(db, 'brokers'),
            where('brokerId', '==', vehicle.brokerId)
          ));
          
          if (broker.docs.length > 0) {
            const brokerData = broker.docs[0].data();
            if (vehicle.brokerId === user.id) {
              // Main broker's commission
              totalCommission += brokerData.commission || 250;
            } else {
              // Commission from sub-broker (difference between main broker and sub-broker commission)
              totalCommission += (brokerData.commission || 250) - (brokerData.subBrokerCommission || 150);
            }
          }
        }

        setStats({
          activeCompanies,
          activeMembers,
          monthlyCommission: totalCommission
        });
      } catch (err) {
        console.error('Error in fetchStats:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  return { stats, loading, error };
};
