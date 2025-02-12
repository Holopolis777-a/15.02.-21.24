import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import NewsEditModal from './NewsEditModal';

const NewsCreateButton = () => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuthStore();

  // Show button for admin and content manager roles
  const canCreateNews = user?.role === 'admin' || user?.role === 'content_manager';

  if (!canCreateNews) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        News erstellen
      </button>

      {showModal && (
        <NewsEditModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default NewsCreateButton;