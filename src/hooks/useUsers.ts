import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { User } from '../types/auth';
import { useAuthStore } from '../store/authStore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      setError('Keine Berechtigung zum Anzeigen der Benutzer');
      setIsLoading(false);
      return;
    }

    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      usersQuery,
      (snapshot) => {
        const userData: User[] = [];
        snapshot.forEach((doc) => {
          userData.push({ 
            id: doc.id, 
            ...doc.data() 
          } as User);
        });
        setUsers(userData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setError('Fehler beim Laden der Benutzer');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  return { users, isLoading, error };
};
