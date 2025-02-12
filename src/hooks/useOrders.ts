import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { VehicleRequestWithCompany } from '../types/vehicleRequest';

export const useOrders = (companyId?: string, userId?: string) => {
  const [orders, setOrders] = useState<VehicleRequestWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    let q = query(
      collection(db, 'vehicleRequests'),
      where('isOrder', '==', true)
    );

    // Wenn ein Benutzer eingeloggt ist, füge die entsprechenden Filter hinzu
    if (userId) {
      // Für normale Benutzer: Nur eigene Bestellungen
      q = query(q, where('userId', '==', userId));
    } else if (companyId) {
      // Für Arbeitgeber: Bestellungen der Mitarbeiter
      q = query(q, where('companyId', '==', companyId));
    }

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
        console.error('Error fetching orders:', err);
        setError('Fehler beim Laden der Bestellungen');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [companyId, userId]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'vehicleRequests', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error('Error updating order status:', err);
      throw new Error('Fehler beim Aktualisieren des Bestellungsstatus');
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'vehicleRequests', orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      throw new Error('Fehler beim Löschen der Bestellung');
    }
  };

  return {
    orders,
    loading,
    error,
    updateStatus,
    deleteOrder,
  };
};
