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
    // Verwende eine Map, um Duplikate zu vermeiden
    const ordersMap = new Map<string, VehicleRequestWithCompany>();

    // Query für Bestellungen, bei denen der Broker als einladender Broker eingetragen ist
    const qInvited = query(
      collection(db, 'vehicleRequests'),
      where('isOrder', '==', true),
      where('invitedByBrokerId', '==', user.id)
    );
    const unsubscribeInvited = onSnapshot(qInvited,
      (snapshot) => {
        snapshot.forEach((doc) => {
          ordersMap.set(doc.id, { id: doc.id, ...doc.data() } as VehicleRequestWithCompany);
        });
        setOrders(Array.from(ordersMap.values()));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching broker orders (invited):', err);
        setError('Fehler beim Laden der Bestellungen (invited)');
        setLoading(false);
      }
    );

    // Query für Bestellungen der Unterbroker, bei denen der ParentBroker die ID des aktuellen Brokers besitzt
    const qSubBroker = query(
      collection(db, 'vehicleRequests'),
      where('isOrder', '==', true),
      where('parentBrokerId', '==', user.id)
    );
    const unsubscribeSubBroker = onSnapshot(qSubBroker,
      (snapshot) => {
        snapshot.forEach((doc) => {
          ordersMap.set(doc.id, { id: doc.id, ...doc.data() } as VehicleRequestWithCompany);
        });
        setOrders(Array.from(ordersMap.values()));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching broker orders (subbroker):', err);
        setError('Fehler beim Laden der Unterbroker-Bestellungen');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeInvited();
      unsubscribeSubBroker();
    };
  }, [user?.id]);

  return {
    orders,
    loading,
    error
  };
};
