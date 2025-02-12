import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import FAQEditModal from './FAQEditModal';

const FAQCreateButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        FAQ erstellen
      </button>

      {showModal && (
        <FAQEditModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default FAQCreateButton;