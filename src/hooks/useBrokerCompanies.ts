import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface BrokerCompany {
  id: string;
  email: string;
  companyName?: string;
  name?: string;
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
  contactPerson?: string;
  industry?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  ownerId?: string;
  verificationId?: string;
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

    let unsubscribe: () => void;

    const fetchCompanies = async () => {
      try {
        if (!isAdmin) {
          // Broker-spezifische Queries
          const invitedByQuery = query(
            collection(db, 'companies'),
            where('invitedBy', '==', user.id)
          );

          const brokerIdQuery = query(
            collection(db, 'companies'),
            where('brokerId', '==', user.id)
          );

          unsubscribe = onSnapshot(invitedByQuery, async (invitedBySnapshot) => {
            try {
              const brokerIdSnapshot = await getDocs(brokerIdQuery);
              
              const allDocs = [...invitedBySnapshot.docs, ...brokerIdSnapshot.docs];
              const uniqueDocs = allDocs.filter((doc, index, self) => 
                index === self.findIndex((d) => d.id === doc.id)
              );

              const companiesList = await Promise.all(uniqueDocs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                let brokerName;
                
                if (isAdmin && data.invitedBy) {
                  const brokerDocRef = doc(db, 'users', data.invitedBy);
                  const brokerDoc = await getDoc(brokerDocRef);
                  brokerName = brokerDoc.data()?.companyName || brokerDoc.data()?.email;
                }

                // Erstelle die Adresse aus den einzelnen Feldern oder verwende das address Objekt
                const address = data.address || {
                  street: data.street || '',
                  city: data.city || '',
                  postalCode: data.zipCode || ''
                };
                
                return {
                  id: docSnapshot.id,
                  email: data.email || '',
                  companyName: data.name || '',
                  name: data.name || '',
                  logoUrl: data.logoUrl,
                  legalForm: data.legalForm,
                  firstLoginAt: data.firstLoginAt,
                  employeeCount: data.employeeCount,
                  phone: data.phone,
                  address,
                  status: data.status || 'pending',
                  createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                  invitedBy: data.invitedBy || data.brokerId || user.id,
                  brokerName,
                  contactPerson: data.contactPerson,
                  industry: data.industry,
                  street: data.street,
                  city: data.city,
                  zipCode: data.zipCode,
                  ownerId: data.ownerId,
                  verificationId: data.verificationId
                } satisfies BrokerCompany;
              }));

              setCompanies(companiesList);
              setLoading(false);
            } catch (err) {
              console.error('Error processing companies:', err);
              setError('Fehler beim Verarbeiten der Unternehmen');
              setLoading(false);
            }
          });
        } else {
          // Admin view - show all companies
          const companiesQuery = query(collection(db, 'companies'));
          unsubscribe = onSnapshot(companiesQuery, async (snapshot) => {
            try {
              const companiesList = await Promise.all(snapshot.docs.map(async (docSnapshot) => {
                const data = docSnapshot.data();
                let brokerName;
                
                if (data.invitedBy) {
                  const brokerDocRef = doc(db, 'users', data.invitedBy);
                  const brokerDoc = await getDoc(brokerDocRef);
                  brokerName = brokerDoc.data()?.companyName || brokerDoc.data()?.email;
                }

                // Erstelle die Adresse aus den einzelnen Feldern oder verwende das address Objekt
                const address = data.address || {
                  street: data.street || '',
                  city: data.city || '',
                  postalCode: data.zipCode || ''
                };
                
                return {
                  id: docSnapshot.id,
                  email: data.email || '',
                  companyName: data.name || '',
                  name: data.name || '',
                  logoUrl: data.logoUrl,
                  legalForm: data.legalForm,
                  firstLoginAt: data.firstLoginAt,
                  employeeCount: data.employeeCount,
                  phone: data.phone,
                  address,
                  status: data.status || 'pending',
                  createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
                  invitedBy: data.invitedBy || data.brokerId || user.id,
                  brokerName,
                  contactPerson: data.contactPerson,
                  industry: data.industry,
                  street: data.street,
                  city: data.city,
                  zipCode: data.zipCode,
                  ownerId: data.ownerId,
                  verificationId: data.verificationId
                } satisfies BrokerCompany;
              }));

              setCompanies(companiesList);
              setLoading(false);
            } catch (err) {
              console.error('Error processing companies:', err);
              setError('Fehler beim Verarbeiten der Unternehmen');
              setLoading(false);
            }
          });
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Fehler beim Laden der Unternehmen');
        setLoading(false);
      }
    };

    fetchCompanies();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.id, isAdmin]);

  return { companies, loading, error };
};
