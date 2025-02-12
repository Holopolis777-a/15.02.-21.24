import React, { useState } from 'react';
import { FAQ } from '../../../types/faq';
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import DeleteConfirmationDialog from '../../../components/DeleteConfirmationDialog';
import { useFAQs } from '../../../hooks/useFAQs';
import FAQEditModal from './FAQEditModal';

interface FAQCardProps {
  faq: FAQ;
}

const FAQCard: React.FC<FAQCardProps> = ({ faq }) => {
  const { user } = useAuthStore();
  const { deleteFAQ } = useFAQs();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteFAQ(faq.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting FAQ:', error);
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
                <h3 className="text-lg font-semibold text-gray-900">
                  {faq.title}
                </h3>
                {isAdmin && (
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

              <div className="mt-2 flex flex-wrap gap-2">
                {faq.targets.map((target) => (
                  <span
                    key={target}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {target}
                  </span>
                ))}
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  Priorität: {faq.priority}
                </span>
                {!faq.isActive && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Inaktiv
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Mehr anzeigen
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-4 prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: faq.content }} />
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="FAQ löschen"
        message="Sind Sie sicher, dass Sie diese FAQ löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        isDeleting={isDeleting}
      />

      {showEditModal && (
        <FAQEditModal
          faq={faq}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default FAQCard;