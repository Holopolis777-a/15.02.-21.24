import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface BrokerCompany {
  id: string;
  email: string;
  companyName?: string;
  status: 'active' | 'pending' | 'declined';
  createdAt: Date;
  invitedBy: string;
  brokerName?: string;
  logoUrl?: string;
  legalForm?: string;
  firstLoginAt?: string;
  employeeCount?: number;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
  };
}

export const useBrokerCompanies = (isAdmin: boolean = false) => {
  const [companies, setCompanies] = useState<BrokerCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchCompanies = async () => {
      try {
        // Query companies collection directly
        let companiesQuery = query(collection(db, 'companies'));
        
        // Add broker-specific filter if not admin
        if (!isAdmin) {
          companiesQuery = query(companiesQuery, where('invitedBy', '==', user.id));
        }

        const unsubscribe = onSnapshot(companiesQuery, async (snapshot) => {
          const companiesList = await Promise.all(snapshot.docs.map(async (docSnapshot: QueryDocumentSnapshot<DocumentData>) => {
            const data = docSnapshot.data();
            let brokerName;
            
            if (isAdmin && data.invitedBy) {
              // Fetch broker name for admin view
              const brokerDocRef = doc(db, 'users', data.invitedBy);
              const brokerDoc = await getDoc(brokerDocRef);
              brokerName = brokerDoc.data()?.companyName || brokerDoc.data()?.email;
            }
            
            return {
              id: docSnapshot.id,
              email: data.email || '',
              companyName: data.name || '',
              logoUrl: data.logoUrl,
              legalForm: data.legalForm,
              firstLoginAt: data.firstLoginAt,
              employeeCount: data.employeeCount,
              phone: data.phone,
              address: data.address,
              status: data.status || 'pending',
              createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
              invitedBy: data.invitedBy || user.id,
              brokerName
            } satisfies BrokerCompany;
          }));

          setCompanies(companiesList);
          setLoading(false);
        });

        // Cleanup function
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Fehler beim Laden der Unternehmen');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [user?.id, isAdmin]);

  return { companies, loading, error };
};
