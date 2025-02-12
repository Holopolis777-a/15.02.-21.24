import React from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getFAQsByTarget } from '../../../lib/firebase/faq';
import { FAQ } from '../../../types/faq';
import FAQItem from './FAQItem';
import { HelpCircle } from 'lucide-react';

const FAQList = () => {
  const { user } = useAuthStore();
  const [faqs, setFaqs] = React.useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadFAQs = async () => {
      if (!user?.role) return;
      
      try {
        const loadedFAQs = await getFAQsByTarget(user.role);
        setFaqs(loadedFAQs);
      } catch (err) {
        setError('Fehler beim Laden der FAQs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
        {error}
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-2" />
            <p>Keine FAQs gefunden</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {faqs.map((faq) => (
        <FAQItem key={faq.id} faq={faq} />
      ))}
    </div>
  );
};

export default FAQList;