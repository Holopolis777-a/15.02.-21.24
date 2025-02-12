import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AdminInviteModal from './AdminInviteModal';

const AdminInviteButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <UserPlus className="w-5 h-5 mr-2" />
        Admin einladen
      </button>

      {showModal && (
        <AdminInviteModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default AdminInviteButton;