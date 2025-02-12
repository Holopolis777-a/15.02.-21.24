import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { useAuthStore } from './useAuthStore';

export interface EmployerInvite {
  id: string;
  email: string;
  companyName: string;
  contactPerson: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
  referrerId: string;
}

export interface InviteStats {
  total: number;
  accepted: number;
  acceptanceRate: number;
}

export const useEmployerInvites = () => {
  const [invites, setInvites] = useState<EmployerInvite[]>([]);
  const [stats, setStats] = useState<InviteStats>({
    total: 0,
    accepted: 0,
    acceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'verifications'),
      where('type', '==', 'employer_invite'),
      where('referrerId', '==', user.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inviteData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as EmployerInvite[];

      setInvites(inviteData);

      // Calculate statistics
      const total = inviteData.length;
      const accepted = inviteData.filter(invite => invite.status === 'accepted').length;
      const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;

      setStats({
        total,
        accepted,
        acceptanceRate
      });

      setLoading(false);
    }, (error) => {
      console.error('Error fetching employer invites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  return { invites, stats, loading };
};
