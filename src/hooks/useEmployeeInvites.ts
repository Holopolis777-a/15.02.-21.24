import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface EmployeeInvite {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  companyId: string;
  employerCompanyId: string;
  portalType: 'normal' | 'salary';
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  invitedBy: string;
  type: 'employee_invite';
  method?: 'link' | 'email';
  inviteType: 'employer' | 'employee';
}

export const useEmployeeInvites = () => {
  const [invites, setInvites] = useState<EmployeeInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchInvites = async () => {
      try {
        console.log('[DEBUG] useEmployeeInvites - Starting hook with user:', {
          id: user?.id,
          companyId: user?.companyId,
          email: user?.email,
          role: user?.role
        });
        
        if (!user?.companyId) {
          console.log('[DEBUG] useEmployeeInvites - No company ID, stopping loading');
          setLoading(false);
          return;
        }

        // Verify the company ID exists in Firestore
        const companyDoc = await getDoc(doc(db, 'companies', user.companyId));
        console.log('[DEBUG] useEmployeeInvites - Company exists:', companyDoc.exists());

        if (!companyDoc.exists()) {
          console.log('[DEBUG] useEmployeeInvites - Company not found in Firestore');
          setError('Company not found');
          setLoading(false);
          return;
        }

        console.log(`[DEBUG] useEmployeeInvites - Fetching invites for company: ${user.companyId}`);

        // Query for invites (exclude salary portal invites)
        const q = query(
          collection(db, 'employeeInvites'),
          where('employerCompanyId', '==', user.companyId),
          where('portalType', '!=', 'salary')
        );

        console.log('[DEBUG] useEmployeeInvites - Query params:', {
          employerCompanyId: user.companyId
        });

        unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log(`[DEBUG] useEmployeeInvites - Got snapshot with ${snapshot.docs.length} documents`);
        
        if (snapshot.empty) {
          console.log('[DEBUG] useEmployeeInvites - Snapshot is empty');
          setInvites([]);
          setLoading(false);
          return;
        }

        const inviteData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('[DEBUG] Document data:', {
            id: doc.id,
            email: data.email,
            employerCompanyId: data.employerCompanyId,
            status: data.status,
            type: data.type
          });
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as EmployeeInvite;
        });

        console.log(`[DEBUG] useEmployeeInvites - Processed ${inviteData.length} invites`);
        setInvites(inviteData);
        setLoading(false);
      },
      (error) => {
        console.error('[DEBUG] useEmployeeInvites - Error:', error);
        setError('Fehler beim Laden der Einladungen');
        setLoading(false);
      }
    );

      } catch (error) {
        console.error('[DEBUG] useEmployeeInvites - Error in fetchInvites:', error);
        setError('Fehler beim Laden der Einladungen');
        setLoading(false);
      }
    };

    fetchInvites();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.companyId]);

  return { invites, loading, error };
};
