import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, getDoc, DocumentData } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { Company } from '../types/company';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const companiesQuery = query(
      collection(db, 'companies'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      companiesQuery,
      (snapshot) => {
        const companyData: Company[] = [];
        const processCompanies = async () => {
          const companiesWithBrokers = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const data = docSnapshot.data() as DocumentData;
              let brokerName;
              
              if (data.invitedBy) {
                const brokerDocRef = doc(db, 'users', data.invitedBy);
                const brokerDoc = await getDoc(brokerDocRef);
                brokerName = brokerDoc.data()?.companyName || brokerDoc.data()?.email;
              }
              
              // Ensure address exists with default values if not present
              const address = data.address || {
                street: '',
                city: '',
                postalCode: ''
              };

              return {
                id: docSnapshot.id,
                ...data,
                address,
                brokerName
              } as Company;
            })
          );
          
          setCompanies(companiesWithBrokers);
        };
        
        processCompanies();
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching companies:', err);
        setError('Fehler beim Laden der Unternehmen');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { companies, isLoading, error };
};
