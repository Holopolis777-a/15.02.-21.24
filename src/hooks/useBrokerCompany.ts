import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from '../store/authStore';

export const useBrokerCompany = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (user?.brokerId) {
        try {
          const brokerDoc = await getDoc(doc(db, 'brokers', user.brokerId));
          if (brokerDoc.exists()) {
            setCompanyName(brokerDoc.data().companyName || '');
          }
        } catch (error) {
          console.error('Error fetching broker company:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCompanyData();
  }, [user?.brokerId]);

  return { companyName, loading };
};
