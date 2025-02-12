import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface Employer {
  id: string;
  email: string;
  companyName?: string;
  status: 'active' | 'pending' | 'declined';
  createdAt: Date;
  invitedBy: string;
}

export const useEmployersList = () => {
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id || !user?.companyId) {
      setLoading(false);
      return;
    }

    const fetchEmployers = async () => {
      try {
        // Query for active employees from users collection
        const usersQuery = query(
          collection(db, 'users'),
          where('role', 'in', ['employee_normal', 'employee_salary']),
          where('companyId', '==', user.companyId),
          where('status', '==', 'active')
        );

        // Query for pending/declined invites from employeeInvites collection
        const invitesQuery = query(
          collection(db, 'employeeInvites'),
          where('companyId', '==', user.companyId),
          where('status', 'in', ['pending', 'declined'])
        );

        let activeEmployers: Employer[] = [];
        let pendingEmployers: Employer[] = [];

        // Listen to active employees
        const unsubscribeUsers = onSnapshot(usersQuery, (snapshot) => {
          activeEmployers = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              email: data.email,
              companyName: data.companyName || data.company?.name,
              status: 'active' as const,
              createdAt: data.createdAt?.toDate() || new Date(),
              invitedBy: data.invitedBy
            };
          });
          setEmployers([...activeEmployers, ...pendingEmployers]);
        });

        // Listen to pending invites
        const unsubscribeInvites = onSnapshot(invitesQuery, (snapshot) => {
          pendingEmployers = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              email: data.email,
              companyName: data.companyName || data.company?.name,
              status: data.status as 'pending' | 'declined',
              createdAt: data.createdAt?.toDate() || new Date(),
              invitedBy: data.invitedBy
            };
          });
          setEmployers([...activeEmployers, ...pendingEmployers]);
        });

        setLoading(false);

        return () => {
          unsubscribeUsers();
          unsubscribeInvites();
        };
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Fehler beim Laden der Mitarbeiter');
        setLoading(false);
      }
    };

    fetchEmployers();
  }, [user?.id, user?.companyId]);

  return { employers, loading, error };
};
