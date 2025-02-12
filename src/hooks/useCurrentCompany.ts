import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Company } from '../types/company';
import { useAuthStore } from '../store/authStore';

export const useCurrentCompany = () => {
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.companyId && !user?.employerCompanyId) {
      setLoading(false);
      return;
    }

    const companyId = user.companyId || user.employerCompanyId;
    if (!companyId) {
      setLoading(false);
      return;
    }
    
    const companyRef = doc(db, 'companies', companyId);
    
    const unsubscribe = onSnapshot(
      companyRef,
      (doc) => {
        if (doc.exists()) {
          setCompany({
            id: doc.id,
            ...doc.data()
          } as Company);
        } else {
          setError('Keine Firmendaten gefunden');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching company:', err);
        setError('Fehler beim Laden der Firmendaten');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.companyId, user?.employerCompanyId]);

  return { company, loading, error };
};
