import React, { useState } from 'react';
import { NewsPost } from '../../../types/news';
import { Pencil, Trash2, Eye, Calendar, Users } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';
import { useNews } from '../../../hooks/useNews';
import NewsEditModal from './NewsEditModal';

interface NewsCardProps {
  news: NewsPost;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { user } = useAuthStore();
  const { deleteNews } = useNews();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'content_manager';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNews(news.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting news:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {news.title}
                </h3>
                {canEdit && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteDialog(true)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(news.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {news.views} Aufrufe
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {news.targetGroups.length} Zielgruppen
                </div>
              </div>

              {news.imageUrl && (
                <div className="mt-4">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="mt-4 prose prose-sm max-w-none">
                <div dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>

              {news.externalUrl && (
                <a
                  href={news.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
                >
                  Mehr erfahren
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="News-Eintrag löschen"
        message="Sind Sie sicher, dass Sie diesen News-Eintrag löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        isDeleting={isDeleting}
      />

      {showEditModal && (
        <NewsEditModal
          news={news}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default NewsCard;