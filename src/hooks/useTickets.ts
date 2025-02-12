import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/firebase/config';
import { Ticket } from '../types/ticket';
import { useAuthStore } from '../store/authStore';

export const useTickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!user) return;

    let constraints = [];

    // Add user filter for non-admins
    if (user.role !== 'admin') {
      constraints.push(where('createdBy', '==', user.id));
    }

    // Add status filter if present
    const status = searchParams.get('status');
    if (status) {
      constraints.push(where('status', '==', status));
    }

    // Add sorting (always last)
    constraints.push(orderBy('createdAt', 'desc'));

    const finalQuery = query(collection(db, 'tickets'), ...constraints);

    const unsubscribe = onSnapshot(
      finalQuery,
      (snapshot) => {
        const ticketData: Ticket[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          ticketData.push({ 
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
          } as Ticket);
        });
        setTickets(ticketData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching tickets:', err);
        setError('Fehler beim Laden der Tickets');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { tickets, isLoading, error };
};
