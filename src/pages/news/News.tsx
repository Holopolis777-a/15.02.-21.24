import React from 'react';
import { Newspaper } from 'lucide-react';
import NewsList from './components/NewsList';
import NewsCreateButton from './components/NewsCreateButton';
import { useAuthStore } from '../../store/authStore';

const News = () => {
  const { user } = useAuthStore();
  const canCreateNews = user?.role === 'admin' || user?.role === 'content_manager';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Newspaper className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-bold text-gray-900">News</h1>
        </div>
        {canCreateNews && <NewsCreateButton />}
      </div>
      
      <NewsList />
    </div>
  );
};

export default News;