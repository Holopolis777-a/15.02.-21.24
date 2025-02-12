import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';
import type { VehicleRequestWithCompany } from '../types/vehicleRequest';

export const useSalaryRequests = () => {
  const [requests, setRequests] = useState<VehicleRequestWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.companyId) return;

    setLoading(true);
    const q = query(
      collection(db, 'vehicleRequests'),
      where('companyId', '==', user.companyId),
      where('type', '==', 'salary_conversion'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const vehicleRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as VehicleRequestWithCompany[];
        setRequests(vehicleRequests);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching salary conversion requests:', err);
        setError('Failed to fetch salary conversion requests');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.companyId]);

  return { requests, loading, error };
};
