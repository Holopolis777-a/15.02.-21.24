import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { FAQ } from '../types/faq';
import { useAuthStore } from '../store/authStore';

export const useFAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const faqsQuery = query(
      collection(db, 'faqs'),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      faqsQuery,
      (snapshot) => {
        const faqData: FAQ[] = [];
        snapshot.forEach((doc) => {
          faqData.push({ 
            id: doc.id, 
            ...doc.data() 
          } as FAQ);
        });
        setFaqs(faqData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching FAQs:', err);
        setError('Fehler beim Laden der FAQs');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const deleteFAQ = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'faqs', id));
      return true;
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      throw new Error('Fehler beim Löschen der FAQ');
    }
  };

  return { faqs, isLoading, error, deleteFAQ };
};