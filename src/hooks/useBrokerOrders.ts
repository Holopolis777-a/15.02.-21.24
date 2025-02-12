import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { VehicleRequestWithCompany } from '../types/vehicleRequest';
import { useAuthStore } from '../store/authStore';

export const useBrokerOrders = () => {
  const [orders, setOrders] = useState<VehicleRequestWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    // Query für alle Bestellungen von Unternehmen, die vom Broker eingeladen wurden
    const q = query(
      collection(db, 'vehicleRequests'),
      where('isOrder', '==', true),
      where('invitedByBrokerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData: VehicleRequestWithCompany[] = [];
        snapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as VehicleRequestWithCompany);
        });
        setOrders(ordersData);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching broker orders:', err);
        setError('Fehler beim Laden der Bestellungen');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  return {
    orders,
    loading,
    error
  };
};
