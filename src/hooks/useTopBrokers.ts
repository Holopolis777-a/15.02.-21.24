import { useState, useEffect } from 'react';
import { useAuthStore } from './useAuthStore';
import { db } from '../lib/firebase/config';
import { collection, query, where, getDocs, DocumentData } from 'firebase/firestore';

interface TopBroker {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  soldVehicles: number;
  percentageOfTop: number;
}

export const useTopBrokers = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topBrokers, setTopBrokers] = useState<TopBroker[]>([]);

  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    async function getAllSubBrokerIds(parentEmail: string): Promise<string[]> {
      const brokerEmails: string[] = [parentEmail];
      const brokersRef = collection(db, 'brokers');
      
      const subBrokersQuery = query(brokersRef, where('parentBrokerId', '==', parentEmail));
      const subBrokersSnapshot = await getDocs(subBrokersQuery);
      
      for (const doc of subBrokersSnapshot.docs) {
        const brokerData = doc.data();
        const brokerEmail = brokerData.email || doc.id;
        brokerEmails.push(brokerEmail);
        
        const subBrokerEmails = await getAllSubBrokerIds(brokerEmail);
        brokerEmails.push(...subBrokerEmails);
      }
      
      return [...new Set(brokerEmails)];
    }

    async function fetchTopBrokers() {
      if (!user?.email) return;
      
      try {
        setLoading(true);
        
        // Get all broker emails recursively
        const brokerEmails = await getAllSubBrokerIds(user.email);

        // Get broker details directly from their documents
        const brokersData: { [key: string]: DocumentData } = {};
        
        // Get broker details
        for (const email of brokerEmails) {
          const brokerDoc = await getDocs(query(collection(db, 'brokers'), where('email', '==', email)));
          if (!brokerDoc.empty) {
            brokersData[email] = brokerDoc.docs[0].data();
          }
        }

        // Get vehicles for each broker
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const vehiclesRef = collection(db, 'vehicles');
        const brokerVehicleCounts: { [key: string]: number } = {};

        for (const email of brokerEmails) {
          const vehiclesQuery = query(
            vehiclesRef,
            where('brokerId', '==', email),
            where('status', '==', 'delivered'),
            where('deliveryDate', '>=', startOfMonth)
          );
          const vehiclesSnapshot = await getDocs(vehiclesQuery);
          brokerVehicleCounts[email] = vehiclesSnapshot.size;
        }

        // Sort brokers by vehicle count and create TopBroker objects
        const sortedBrokers = Object.entries(brokerVehicleCounts)
          .sort(([, countA], [, countB]) => countB - countA)
          .slice(0, 5)
          .reduce<TopBroker[]>((acc, [email, soldVehicles]) => {
            const brokerData = brokersData[email];
            if (!brokerData?.firstName || !brokerData?.lastName) return acc;
            
            acc.push({
              id: email,
              name: `${brokerData.firstName} ${brokerData.lastName}`.trim(),
              firstName: brokerData.firstName,
              lastName: brokerData.lastName,
              photoURL: brokerData.photoURL,
              soldVehicles,
              percentageOfTop: 0
            });
            return acc;
          }, []);

        // Calculate percentage based on top performer
        if (sortedBrokers.length > 0) {
          const maxVehicles = sortedBrokers[0].soldVehicles;
          const brokersWithPercentage = sortedBrokers.map(broker => ({
            ...broker,
            percentageOfTop: maxVehicles > 0 ? (broker.soldVehicles / maxVehicles) * 100 : 0
          }));

          setTopBrokers(brokersWithPercentage);
        } else {
          setTopBrokers([]);
        }
      } catch (err) {
        console.error('Error in fetchTopBrokers:', err);
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setLoading(false);
      }
    }

    fetchTopBrokers();
  }, [user?.email]);

  return { topBrokers, loading, error };
};
