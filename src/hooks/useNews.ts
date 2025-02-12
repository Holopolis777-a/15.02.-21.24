import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { NewsPost } from '../types/news';
import { useAuthStore } from '../store/authStore';

export const useNews = () => {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    const newsQuery = query(
      collection(db, 'news_posts'),
      orderBy('publishedAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      newsQuery,
      (snapshot) => {
        const newsData: NewsPost[] = [];
        snapshot.forEach((doc) => {
          newsData.push({ 
            id: doc.id, 
            ...doc.data() 
          } as NewsPost);
        });
        setNews(newsData);
        setIsLoading(false);
      },
      (err) => {
        console.error('Error fetching news:', err);
        setError('Fehler beim Laden der News');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const deleteNews = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'news_posts', id));
      return true;
    } catch (err) {
      console.error('Error deleting news:', err);
      throw new Error('Fehler beim Löschen des News-Eintrags');
    }
  };

  return { news, isLoading, error, deleteNews };
};