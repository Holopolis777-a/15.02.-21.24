import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CompanyInviteModal from './CompanyInviteModal';

const CompanyInviteButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <Plus className="w-5 h-5 mr-2" />
        Unternehmen einladen
      </button>

      {isModalOpen && (
        <CompanyInviteModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}

export default CompanyInviteButton;