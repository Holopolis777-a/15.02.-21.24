import React from 'react';
import { useNews } from '../../../hooks/useNews';
import NewsCard from './NewsCard';
import { Newspaper } from 'lucide-react';

const NewsList = () => {
  const { news, isLoading, error } = useNews();

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

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-40 text-gray-500">
          <div className="text-center">
            <Newspaper className="w-12 h-12 mx-auto mb-2" />
            <p>Keine News-Einträge gefunden</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {news.map((newsItem) => (
        <NewsCard key={newsItem.id} news={newsItem} />
      ))}
    </div>
  );
};

export default NewsList;